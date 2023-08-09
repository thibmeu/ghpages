+++
date = 2023-08-09T21:20:40Z
title = "Creating an age plugin for tlock"
description = "Development story about implementing age-plugin-tlock"
slug = "" 
tags = ["tlock", "age", "cryptography", "cli"]
categories = []
externalLink = ""
series = []

+++

Given you have two tools that work on their own, with a similar interfaces, how complex can it be to integrate primitives from one tool into another? It turns out harder than expected. In this blog, I'll discuss my experience understanding, designing, and implementing an age plugin for tlock.

# Background

`age` is an encryption tool with opinionated cryptography, and a clean command line interface. It's implemented in multiple languages such as Go or Rust, and has a [flourishing ecosystem]().

I want to emphasise here. If you've used CLIs in the past, `age` is among the easiest to use.

```bash
tar cvz ~/data | age -r age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p > data.tar.gz.age
```

By comparison, openssl would look like

```bash
tar cvz ~/data | openssl rsautl -encrypt -pubin -inkey ~/.ssh/id_rsa.pub > data.tar.gz.enc
```

age ships with a dedicated tool to generate key in its format.

```bash
age-keygen -o key.txt
Public key: age1ql3z7hjy54pw3hyww5ayyfg7zqgvc7w3j2elw8zmrj2kg5sfn9aqmcac8p
```

`age-keygen` generates an x25519 keypair. The public key is encrypted with a specific format and then in bech32.

> bech32 is based32 + some added checksum validation. Most notably, this got used in bitcoin address format

It's possible to extend age possibilities by creating a program that would integrate with its plugin system. We're going to detail this in a later section.

# Why creating an age plugin

The short answer is we have a new protocol which leverages age as an encryption file format, and we'd like to integrate it within the standard age tooling.

This protocol is tlock, an encryption layer encrypting towards a specific point in time. More precisely, with tlock, we define the specific stanza

```
STANZA = [round, hash]
```

where `hash` is the identifier of a distributed randomness beacon (drand beacon), and round is the round number corresponding to the desired encryption time. The relation between time and round is `encryption_time = round*period + genesis`.

This is only one stanza, and could be layer with other age compatible ones. In fact, all existing implementations for tlock leverages this by first generating an age key, and then wrapping the key within a tlock stanza. tlock-rs even involuntarily integrates a greasing stanza due to its dependency on rage (age implementation in Rust).

One could create an age file using dee as follow

```bash
tar cvz ~/data | dee crypt --encrypt -r $(date) > data.tar.gz.age
```

You notice this is very similar to age. The whole interfacing with files and stream is identical.

For the careful observer, there are two differences:

* The `-r` flag, representing the round, is no longer bech32 encoded.
* There is no flag for the `hash`.

These are two reasons why `dee` got created before an age plugin. We're going to dive into why their removals are challenging to implement an age plugin in the next sections.

# Age plugin system

age plugins are programs in the PATH which name starts with `age-plugin-`. For `tlock`, this would be `age-plugin-tlock`. These programs are able to comprehend age plugin protocol, defined as a state machine. age instantiate them automatically when required, depending on the recipient or identity.

For a recipient, the command would look like `age -r age1tlock1<BECH32>`. Similar to `age-keygen`, the recipient is provided by calling the plugin. Considering tlock requires a round number and a chain hash, a sensible first approximation would be `age-plugin-tlock --generate -r $(date) --hash <hash>`. 

The identity is loaded upon decryption for matching tlock identity `age --decrypt -i ./fastnet.key`. This needs to be generated upfront, and ideally does not change. Given tlock does not know the decryption secret ahead of time (that's the principle of tlock), we can provide a remote which can be used to fetch this information.

Taking both the recipient and the identity into account at key generation time, we proceed with the following characteristics:

| component   | value                |
| ----------- | -------------------- |
| stanza      | tlock                |
| plugin name | age-plugin-tlock     |
| recipient   | `[hash, public_key]` |
| identity    | `[remote]`           |

Therefore, key generation
```
age-plugin-tlock --generate --remote https://api.drand.sh/dbd506d6ef76e5f386f41c651dcb808c5bcbd75471cc4eafa3f4df7ad4e4c493
# created: 2023-08-08T14:38:32+02:00
# recipient: age1tlock1yrda2pkkaamwtuux7swx28wtszx9hj7h23cucn40506d77k5unzfxc9qhp32w5nlaca8xx7tty5q4d4t6ck4czmw5q7ufh0kvyhaljwsruqux92z2sthryp5wh43a3npt7xsmu9ckmww8pvpr4kulr97lwr4ne0xz63al5z5ey5fgpmxmxjmnku3uwmf0ewhp2t4rq0qqlu8ljj7lng8rlmrqvpvft27
AGE-PLUGIN-TLOCK-1Q9TXSAR5WPEN5TE0V9CXJTNYWFSKUEPWWD5Z7ERZVS6NQDNYXEJKVDEKV56KVVECXENRGVTRXC6NZERRVGURQWRRX43XXCNYXU6NGDE3VD3NGETPVESNXE35V3NRWCTYX3JNGCE58YEJ74QEJUM
```

# User experience considerations

During the recipient and identity definition, there has been multiple options to choose from.

To operate with age tooling, `age-plugin-tlock` needs all informations to be available from both the recipient and  identity. At encryption time, it needs a recipient. At decryption time,  it needs the identity that completes the stanza information.

This format has been defined ad-hoc, and is likely to  evolve in the future. It follows two design constraints. The first one is identity files need to be transferable. This means that every information within the file should be self contained. The second is to be offline first. This constraint is satisfiable for encryption, but not as easy for decryption, as we don't know the secret key ahead of time. Otherwise this would not be timelock.

# Format

## Stanza

```
tlock <ROUND> <HASH>
```

* `<ROUND>` is the drand beacon round number,
* `<HASH>` is a drand chain hash hex encoded,

Encoded in plain text.

Example
```
tlock 4641203 dbd506d6ef76e5f386f41c651dcb808c5bcbd75471cc4eafa3f4df7ad4e4c493
```

## Recipient

```
age1tlock1<HASH><PUBLIC_KEY><GENESIS><PERIOD>
```

* `<HASH>` is a drand chain hash,
* `<PUBLIC_KEY>` is a drand chain public key,
* `<GENESIS>` is the genesis unix time of a drand chain in seconds,
* `<PERIOD>` is the period between rounds of a drand chain in seconds,

Encoded as wireformat bech32 text.

Example
```
age1tlock1yrda2pkkaamwtuux7swx28wtszx9hj7h23cucn40506d77k5unzfxc9qhp32w5nlaca8xx7tty5q4d4t6ck4czmw5q7ufh0kvyhaljwsruqux92z2sthryp5wh43a3npt7xsmu9ckmww8pvpr4kulr97lwr4ne0xz63al5z5ey5fgpmxmxjmnku3uwmf0ewhp2t4rq0qqlu8ljj7lng8rlmrqvpvft27
```

`<HASH>` is required to fill the stanza, nothing more. `<PUBLIC_KEY>` is required for tlock encryption. `<GENESIS>` and `<PERIOD>` are used to parse beacon round information. Round is provided at encryption time. This is a tradeoff between being able to reuse the same identity multiple times (one per drand chain), and having a more accurate recipient, which would be limited to round and public key information.

## Identity

```
AGE-PLUGIN-TLOCK-<TYPE><IDENTITY>
```

* `<TYPE>` is 0 for `RAW` or 1 for `HTTP`. It provides flexibility on upgrading the identity between implementation and threat model,
* `<IDENTITY>` is the bytes of the beacon signature corresponding to the round for `RAW`, and is an remote HTTP URL in case of `HTTP`,

Encoded as wireformat bech32 text.

Example
```
AGE-PLUGIN-TLOCK-1Q9TXSAR5WPEN5TE0V9CXJTNYWFSKUEPWWD5Z7ERZVS6NQDNYXEJKVDEKV56KVVECXENRGVTRXC6NZERRVGURQWRRX43XXCNYXU6NGDE3VD3NGETPVESNXE35V3NRWCTYX3JNGCE58YEJ74QEJUM
```

# Implementation

One can find the implementation of `age-plugin-tlock` on [thibmeu/tlock-rs](https://github.com/thibmeu/tlock-rs/tree/main/age-plugin-tlock). To use it, first make sure you have a valid [`age` installation](https://github.com/FiloSottile/age#installation). Then run the [installation process](https://github.com/thibmeu/tlock-rs/tree/main/age-plugin-tlock), which is `cargo install --https://github.com/thibmeu/tlock-rs age-plugin-tlock`.

## Usage

### Generate recipient and identity

None of the recipient or identity is secret. The identity secrecy resides in its usefulness only after a certain point in time.

Create an identity for fastnet.
```bash
age-plugin-tlock --generate --remote https://api.drand.sh/dbd506d6ef76e5f386f41c651dcb808c5bcbd75471cc4eafa3f4df7ad4e4c493 > fastnet.key
```

For convenience, you can also create an associated recipient
```bash
cat fastnet.key | grep 'recipient' | sed 's/.*\(age1.*\)/\1/' > fastnet.key.pub
```

If we check `fastnet.key`, it looks like shown below. The recipient is long.

```
# created: 2023-08-08T14:38:32+02:00
# recipient: age1tlock1yrda2pkkaamwtuux7swx28wtszx9hj7h23cucn40506d77k5unzfxc9qhp32w5nlaca8xx7tty5q4d4t6ck4czmw5q7ufh0kvyhaljwsruqux92z2sthryp5wh43a3npt7xsmu9ckmww8pvpr4kulr97lwr4ne0xz63al5z5ey5fgpmxmxjmnku3uwmf0ewhp2t4rq0qqlu8ljj7lng8rlmrqvpvft27
AGE-PLUGIN-TLOCK-1Q9TXSAR5WPEN5TE0V9CXJTNYWFSKUEPWWD5Z7ERZVS6NQDNYXEJKVDEKV56KVVECXENRGVTRXC6NZERRVGURQWRRX43XXCNYXU6NGDE3VD3NGETPVESNXE35V3NRWCTYX3JNGCE58YEJ74QEJUM
```

### Timelock encryption

Encrypt `Hello age-plugin-tlock!` string to round 30 seconds in the future, using fastnet publickey. If you wait 30 seconds before decrypting, the message is decrypted using the new fastnet signature.

```
echo "Hello age-plugin-tlock" | ROUND="30s" age -a -R fastnet.key.pub > data.age
age --decrypt -i fastnet.key data.age
Hello age-plugin-tlock
```

## Rust library

The cli is powered by a wrapper around [rage](https://github.com/str4d/rage). This library exposes the following methods

```rust
/// Run the state machine for the plugin, as defined on [GitHub](https://github.com/C2SP/C2SP/blob/main/age-plugin.md).
/// This is the entry point for the plugin. It is called by the age client.
pub fn run_state_machine(
    state_machine: String,
    plugin_name: &str,
    parse_round: fn(&RecipientInfo, &str) -> u64,
    get_signature: fn(&str, &Header) -> Vec<u8>,
) -> io::Result<()>;

/// Print the new identity information.
pub fn print_new_identity(plugin_name: &str, identity: &IdentityInfo, recipient: &RecipientInfo);
```

In addition, a client needs to decide on the correct identity, either `RAW` or `HTTP`, exposed as

```rust
pub struct RawIdentityInfo {
    signature: Vec<u8>,
}

pub struct HTTPIdentityInfo {
    url: String,
}
```

To learn more about the implementation details, check out the [library implementation](https://github.com/thibmeu/tlock-rs/blob/main/age-plugin-tlock/src/lib.rs). It wraps `tlock_age` identities within plugin compatible identities.


# Moving forward

We now have an age plugin! This does not mean we should stop there, There are improvements we could do moving forwards.

Concerning the interaction between tlock and drand, I think we should remove the chain hash from the stanza. It comes from an assumption this is going to be useful at decryption time, which is not the case for tlock. The public key would be more useful, and we might be able to reconstruct it from the encrypted file.

For tlock and age, we should iterate on what constitute a valid recipient. Especially, I consider offline encryption as necessary, and being able to parse `30s` as well.

Finally, for age specifically, the plugin system works, but does not provide the smoothest experience. The maintainer mentioned having state for identities, a la GPG, which would match pet names of dee. In this case, I think these should be clearly distinct from existing age recipient, as they would not be portable identities. In addition, it would be great to have a mechanism to add arguments to the age binary. For age-plugin-tlock, it could be `age -r fastnet.key -- --round 30s`. This is simpler than the current request-public mechanism, and allows for integration in every cli, which the tty does not allow for.

# Call for action

Thanks for reading through. I'll leave you with links to learn more about dee and age-plugin-tlock

* [dee GitHub](https://github.com/thibmeu/drand-rs)
* [age-plugin-tlock GitHub](https://github.com/thibmeu/tlock-rs)