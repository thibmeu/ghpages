#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { coverSvg } from "../static/js/endpaper-core.mjs";

const catalogPath = process.argv[2] || "public/standard-site.json";
const outputDirectory = process.argv[3] || "public/images/covers";
const catalog = JSON.parse(await readFile(catalogPath, "utf8"));

await mkdir(outputDirectory, { recursive: true });
await Promise.all(catalog.documents.map(async ({ rkey }) => {
  const { svg } = coverSvg(rkey, { patina: 24 });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  await writeFile(path.join(outputDirectory, `${rkey}.png`), png);
}));

console.log(`Generated ${catalog.documents.length} deterministic covers.`);
