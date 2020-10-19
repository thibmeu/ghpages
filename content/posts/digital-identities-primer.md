+++
date = 2020-10-19T21:25:40Z
title = "Into the world of digital identities"
description = "An analysis of France Connect, France gateway to digital identity"
slug = "" 
tags = ["did", "privacy", "identity"]
categories = []
externalLink = ""
series = []
+++

## Into the world of digital identities

The move to work from home (and not work remote) came with a lot of challenge. A growing pain for me has been the lack of a printer for administrative red tapes which is still a very paper based process.

Digital identity platform such as France Connect or Gov Gateway in the UK  (swissID, spain/estonia smart cartd system, ...) should make this easier. The KYC is done once (by the government or a private subsidies) and then you can log in on other websites to prove your identity. This is something the [EU has started to standardise](https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX:32014R0910) to make system used in countries more interoperable.

This is not without posing a threat to privacy. A number of countries have tried to prevent access to some content and placing it behind such an identity paywall. This could be social networks, pornography websites or gambling platform.

## Case study of France Connect

### Presentation

I took a look at France Connect, the system developed by France. It is based on OpenID Connect. It distinguish the service provides and identity providers. Each provider needs to be authorised by the platform to be able to use it. As of today, there are 18 providers, from tax website impots.gouv.fr to INWallet.



The information available to these services providers are the following:

| name               | description                         |
| ------------------ | ----------------------------------- |
| openid             | user identifier in France Connect   |
| given_name         |                                     |
| family_name        |                                     |
| gender             | male or female per the test dataset |
| preferred_username |                                     |
| birthdate          |                                     |
| birthcountry       |                                     |
| ...                |                                     |

>  It is quite interesting to note these are in English despite the service being French.

These data can be seen in the demonstration version available on [France Connect Github](https://github.com/france-connect/service-provider-example).



### How is the data used

Per the partners page, the private information that have been retrieve through France Connect can be stored on the service provider, and kept anywhere in the European Union. They shall be removed when the user stops to use the service.

There is no way to understand how the information shared with the service providers are going to be used. A panel is displayed (hidden by default) listing the shared information. I would like to see more enforcement while sharing these confidential data.

It also appear the service logs user IPs, time of connection and the tokens from the consent of the user. This is hidden in [the terms of services](https://franceconnect.gouv.fr/cgu) and is not prompted to the user when it uses the service. This is (to my understanding) a breach of GDPR, and at least a security problem shall (when) the service is compromised.

## Going further

The use of digital identity is convenient. It tries to make it easier for individuals to proof something (address or residence permit for instance) to authorities. At the same time, their design is challenging.

I still don't understand the need for partners to have access to some of these information without providing the background for it. This is emphasised by the logging strategy chosen by the studied provider.

Considering the various laws and debate around internet user being able to prove physical thing (age above 18, being a resident), digital identity system should provide more anonymity and be scrutinised further.

