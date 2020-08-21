+++
date = 2020-08-20T20:44:40Z
title = "Chromium support for the Distributed Web"
description = "Chromium adds ipfs, ipns, ethereum, dat and other URL schemes"
slug = "" 
tags = ["dweb", "ipfs", "chrome"]
categories = []
externalLink = ""
series = []
+++

# Chromium safelist dweb URL schemes

Today, as part of a [PR by Frédéric Wang](https://chromium.googlesource.com/chromium/src/+/4e8ed0cecce04c5c55dd84a09e4df0d0f11c660f), Chromium allows website to register their ability to support distributed web URL schemes.

Website gateways, such as Cloudflare IPFS Gateway or IPFS.io would be able to use Chrome navigator API to serve [Native DWeb URLs](https://docs.ipfs.io/how-to/address-ipfs-on-web/#native-urls). These new schemes are the following:

| Organisation | scheme | Example URL |
|:------------ |:------ |:----------- |
| [Cabal Club](https://cabal.chat/) | `cabal` | `cabal://1eef9ad64e284691b7c6f6310e39204b5f92765e36102046caaa6a7ff8c02d74` |
| [Dat Foundation](https://dat.foundation) | `dat` | `dat://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat_intro.gif`|
| [W3C](https://w3c.github.io/did-core) | `did` | `did:example:123456` |
| | `dweb` | |
| [Ethereum Foundation](https://ethereum.org) | `ethereum` | `ethereum://0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7/transfer?address=0x8e23ee67d1332ad560396262c48ffbb01f93d052&uint256=1` |
| [Dat Foundation](https://dat.foundation) | `hyper` | `hyper://778f8d955175c92e4ced5e4f5563f69bfec0c86cc6f670352c457943666fe639/dat_intro.gif` |
| [Protocol Labs](https://protocol.ai) | `ipfs` | `ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/wiki/` |
| [Protocol Labs](https://protocol.ai) | `ipns` | `ipns://en.wikipedia-on-ipfs.org/wiki/`|
| [Scuttlebutt](https://scuttlebutt.nz/) | `ssb` | |

They join the [schemes registered at IANA](https://www.iana.org/assignments/uri-schemes/uri-schemes.xhtml) that make it into web browsers.

# Registering protocol handler

The navigator API has, for quite some time, had the ability to [register custom protocol handler](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/registerProtocolHandler). This is how Gmail can handle mail addresses URLs starting with `mailto:`, or your favorite torrent client can recognise magnet link with `magnet:`.

To register an IPNS handler, the code would be the following

```javascript
navigator.registerProtocolHandler(
	"ipns", // scheme
    "https://cloudflare-ipfs.com/ipns/%s", // Gateway URL
    "Cloudflare IPFS Gateway", // title, displayed to the user at registration time
)
```


# What does this mean?

## Gateway usages

Registering a custom handler would abstract away the underlying protocol and proxy requests through an HTTP website.
For IPFS for instance, clicking `ipns://app.uniswap.org` would still pass you through Cloudflare IPFS Gateway.
It could allow deep linking with a desktop application, such as IPFS Desktop, but this is still unclear.

## Alternative name system

For alternative name system, this would be quite handy, as it provides a direct access to the URL.
We could imagine `ipns://uniswap.eth` or even `ipns://uniswap.crypto` . Both ENS domains and Unstoppable domains could have a handler for these URLs.

## Client side verification

Ultimately, if there are (and I don't know) [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) capable of handling these newly safelisted schemes, there would be a way towards client side content verification. And this is major.

We could imagine a service worker running and verifying the hash of the received content. It would provide a strong guarantee about the content that is being served, without requiring any extensions or local process to be installed.

# Looking forward

This step from Chromium would allow further experimentation in the distributed web.
While having the browser resolve and handle these schemes would make sense, allowing websites to register their ability to handle them should provide a fertile ground for innovation.

