+++
date = 2026-04-18T08:00:00Z
title = "quicvarint: variable-length integers in TypeScript"
description = "Encoding variable-length integers in TypeScript"
slug = "" 
tags = ["varint", "2msb", "cryptography", "typescript", "rfc-implementation"]
categories = []
externalLink = ""
series = []
+++

How do you encode an integer on the wire? Fixed-size works until you want to send `1` and you're burning 8 bytes on zeroes. Variable-length encoding trades a bit of complexity for smaller payloads.

QUIC defines its own scheme in [RFC 9000](https://www.rfc-editor.org/rfc/rfc9000.html#name-variable-length-integer-enc): the 2-MSB varint. The two most significant bits of the first byte tell you the total length: 1, 2, 4, or 8 bytes. The remaining bits are the value.

```
0b00xxxxxx  →  1 byte,  max 63
0b01xxxxxx  →  2 bytes, max 16383
0b10xxxxxx  →  4 bytes, max 1073741823
0b11xxxxxx  →  8 bytes, max 4611686018427387903
```

This library stops at `2147483647`, due to constraints of [JavaScript bitwise operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_AND#description).

When most values in a protocol fit in 1 or 2 bytes, you only pay for what you need.

# Why

I needed this for [privacypass-ts](https://github.com/cloudflare/privacypass-ts/) to implement [batched token issuance](https://datatracker.ietf.org/doc/draft-ietf-privacypass-batched-tokens/) and for [ohttp-ts](https://github.com/thibmeu/ohttp-ts) to implement, well, [Oblivious HTTP](https://www.rfc-editor.org/rfc/rfc9458.html). OHTTP borrows binary framing from [Binary HTTP](https://www.rfc-editor.org/rfc/rfc9292.html#section-3), which in turn borrows from [QUIC](https://www.rfc-editor.org/rfc/rfc9000.html#name-sample-variable-length-inte). I looked for an existing package, found nothing small and typed with no dependencies. So I wrote mine.

# Usage

```typescript
import { encode, decode, MAX } from "quicvarint"

const n = 1234
const { value, usize } = decode(encode(n))
console.log(value, usize) // 1234 2
```

`MAX` is `2147483647` (`0x7fffffff`). This is a cap within the library. [QUIC RFC 9000](https://www.rfc-editor.org/rfc/rfc9000.html#name-sample-variable-length-inte) allows for values up to `2^62-1`. `encode` also accepts an explicit length if the framing expects a fixed-width field. Otherwise, the minimum is picked.

# Implementation

Let's look into the encode path.

```typescript
export const encode = (n: number): Uint8Array => {
    const bytes = new Uint8Array(length(n))
    const BYTE = 0b1111_1111
    switch (bytes.length) {
        case 1:
            bytes[0] = 0b0000_0000 | (n & 0x3f)
            break
        case 2:
            bytes[0] = 0b0100_0000 | ((n >> 8) & 0x3f)
            bytes[1] = n & BYTE
            break
        case 4:
            bytes[0] = 0b1000_0000 | ((n >> 24) & 0x3f)
            bytes[1] = (n >> 16) & BYTE
            bytes[2] = (n >> 8) & BYTE
            bytes[3] = n & BYTE
            break
        case 8:
            bytes[0] = 0b1100_0000
            bytes[4] = (n >> 24) & BYTE
            bytes[5] = (n >> 16) & BYTE
            bytes[6] = (n >> 8) & BYTE
            bytes[7] = n & BYTE
            break
    }
    return bytes
}
```

The binary literals match the table above: `0b0100_0000` is the 2-byte prefix, and the remaining bits - 6 in the first byte, 8 in the second - carry the value. In the 8-byte case, bytes 1–3 are always zero. The package only goes up to 32-bit values.

Decoding reads the prefix, masks it off, and shifts the remaining bytes into the value. The `read` variant does the same from a `DataView` at an offset, useful when parsing a larger buffer.

Testing for correctness was a bit challenging. RFC 9000 does provide only 4 examples in [Section A.1](https://www.rfc-editor.org/rfc/rfc9000.html#name-sample-variable-length-inte). For broader coverage, I've [imported](https://github.com/thibmeu/quicvarint/blob/2ca9a6a91df4e186e14905300b583f965e07fa7f/test/fixtures/vectors.json) tests from [quic-go](https://github.com/quic-go/quic-go/blob/306fc96d50087cd16998053e0b30abcc85146972/quicvarint/varint_test.go#L109-L120) implementation.

# To use it

The package is available on [npm](https://www.npmjs.com/package/quicvarint).

```bash
npm install quicvarint
```

Source on GitHub [thibmeu/quicvarint](https://github.com/thibmeu/quicvarint).
