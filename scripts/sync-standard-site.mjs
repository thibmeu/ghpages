#!/usr/bin/env node

import { readFile } from "node:fs/promises";

const identifier = process.env.BSKY_IDENTIFIER || "thibmeu.com";
const password = process.env.BSKY_APP_PASSWORD;
if (!password) {
  throw new Error("Set BSKY_APP_PASSWORD to a Bluesky app password");
}

const catalog = JSON.parse(
  await readFile(new URL("../public/standard-site.json", import.meta.url), "utf8"),
);

const json = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response.json();
};

const { did } = await json(
  `https://public.api.bsky.app/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(identifier)}`,
);
const didDocument = await json(`https://plc.directory/${encodeURIComponent(did)}`);
const pds = didDocument.service?.find(
  (service) => service.type === "AtprotoPersonalDataServer",
)?.serviceEndpoint;
if (!pds) throw new Error("ATProto identity has no PDS endpoint");

const session = await json(`${pds}/xrpc/com.atproto.server.createSession`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ identifier, password }),
});
if (session.did !== did) throw new Error("Authenticated as an unexpected DID");

const publicationUri = `at://${did}/site.standard.publication/${catalog.publication.rkey}`;
const put = (collection, rkey, record) =>
  json(`${pds}/xrpc/com.atproto.repo.putRecord`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ repo: did, collection, rkey, record }),
  });

const uploadCover = async (rkey) => {
  const bytes = await readFile(new URL(`../public/images/covers/${rkey}.png`, import.meta.url));
  return json(`${pds}/xrpc/com.atproto.repo.uploadBlob`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${session.accessJwt}`,
      "content-type": "image/png",
    },
    body: bytes,
  });
};

await put("site.standard.publication", catalog.publication.rkey, {
  $type: "site.standard.publication",
  url: catalog.publication.url,
  name: catalog.publication.name,
  description: catalog.publication.description,
  preferences: { showInDiscover: true },
});

for (const document of catalog.documents) {
  const { rkey, ...metadata } = document;
  const { blob: coverImage } = await uploadCover(rkey);
  await put("site.standard.document", rkey, {
    $type: "site.standard.document",
    site: publicationUri,
    coverImage,
    ...metadata,
  });
}

console.log(`Synced one publication and ${catalog.documents.length} documents.`);
