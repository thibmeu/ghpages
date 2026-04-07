---
title: Projects
---

I build cryptography tools. [dee](https://github.com/thibmeu/drand-rs) is a drand client with timelock encryption; [ohttp.info](https://ohttp.info) is an explainer for Oblivious HTTP. At Cloudflare I work on Privacy Pass and bot authentication. At the IETF, I write specs.

## dee

![dee console gif](/images/dee.gif)

Retrieve public randomness, and encrypt your files to the future. dee provides a drand client, and support for timelock encryption. You can find design considerations [here](/pdf/building-dee.pdf).

[Link](https://github.com/thibmeu/drand-rs)


## ohttp.info

A site I built to explain [Oblivious HTTP](https://ohttp.info) (RFC 9458): routing requests through a relay so the target server never sees your IP. It's deployed in Apple Private Cloud Compute, Google Safe Browsing, and Firefox Telemetry — which is a decent sign the spec works.

[Link](https://ohttp.info)


## Colours side by side

![Colours side by side generated background](/images/colours_side_by_side.png)

Complementary colours presented side by side. This used to be my background for some time, and I wondered what an automated generation would do.
[Link](/html/colours.html)


## Writings and presentations

### IETF

* [HTTP Message Signatures for Automated Traffic Architecture](https://datatracker.ietf.org/doc/draft-meunier-web-bot-auth-architecture/) — draft-meunier-web-bot-auth-architecture
* [Registry and Signature Agent Card for Web Bot Auth](https://datatracker.ietf.org/doc/draft-meunier-webbotauth-registry/) — draft-meunier-webbotauth-registry
* [HTTP Message Signatures Directory](https://datatracker.ietf.org/doc/draft-meunier-http-message-signatures-directory/) — draft-meunier-http-message-signatures-directory
* [Batched Token Issuance Protocol](https://datatracker.ietf.org/doc/draft-ietf-privacypass-batched-tokens/) — draft-ietf-privacypass-batched-tokens (WG Last Call)
* [Privacy Pass Reverse Flow](https://datatracker.ietf.org/doc/draft-meunier-privacypass-reverse-flow/) — draft-meunier-privacypass-reverse-flow

More on the [IETF Datatracker](https://datatracker.ietf.org/doc/search/?name=meunier&activedrafts=on&olddrafts=on).

### Cloudflare

* [Forget IPs: using cryptography to verify bot and agent traffic](https://blog.cloudflare.com/web-bot-auth/) (2025)
* [Beyond IP lists: a registry format for bots and agents](https://blog.cloudflare.com/agent-registry/) (2025)
* [Anonymous credentials: rate-limiting bots and agents without compromising privacy](https://blog.cloudflare.com/private-rate-limiting/) (2025)
* [Sometimes I cache: implementing lock-free probabilistic caching](https://blog.cloudflare.com/sometimes-i-cache/) (2024)
* [Cloudflare helps verify the security of end-to-end encrypted messages by auditing key transparency for WhatsApp](https://blog.cloudflare.com/key-transparency/) (2024)
* [Privacy Pass: upgrading to the latest protocol version](https://blog.cloudflare.com/privacy-pass-standard/) (2024)
* [Let The Right One In: Attestation as a Usable CAPTCHA Alternative](https://www.usenix.org/conference/soups2022/presentation/whalen) — SOUPS 2022
* [Humanity wastes about 500 years per day on CAPTCHAs. It’s time to end this madness](https://blog.cloudflare.com/introducing-cryptographic-attestation-of-personhood/) (2021)

More on the [Cloudflare blog](https://blog.cloudflare.com/author/thibault/).

### Code

* [tlock-rs](https://github.com/thibmeu/tlock-rs) — Rust encryption library for practical time-lock encryption
* [drand-rs](https://github.com/thibmeu/drand-rs) — drand client in Rust
* [age-plugin-simplepq](https://github.com/thibmeu/age-plugin-simplepq) — Simple post-quantum plugin for age
* [age-plugin-hpke](https://github.com/thibmeu/age-plugin-hpke) — HPKE plugin for age
* [http-message-signatures-directory](https://github.com/thibmeu/http-message-signatures-directory) — Proposal for signing bot traffic with per-provider keys
* [ohttp-ts](https://github.com/thibmeu/ohttp-ts) — Oblivious HTTP implementation in TypeScript
* [quicvarint](https://github.com/thibmeu/quicvarint) — Variable-length integer encoding from RFC 9000
* [doh-proxy-worker-template](https://github.com/thibmeu/doh-proxy-worker-template) — DNS over HTTPS Cloudflare Worker

### Presentations

* [Des lampes à lave pour sécuriser Internet](/pdf/lava-lamps.pdf) — Cloudflare, 2024. How lava lamps generate entropy to secure the web.
* [Le développement d’un outil de chiffrement et l’importance de son interface utilisateur](/pdf/capitole-libre.html) — Capitole du Libre, 2023. Building dee and timelock encryption.
