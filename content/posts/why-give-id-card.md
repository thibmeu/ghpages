+++
date = 2021-02-08T20:00:00Z
title = "Why should I give you my ID card"
description = "Youtube asks me for my ID card. Follow me as I dig further on how they could have done this differently"
slug = "" 
tags = ["privacy", "identity", "youtube"]
categories = []
externalLink = ""
series = []

+++

Today, Youtube asked me to verify my age. To do so, I got asked to either enter a credit card in my name, or to upload my ID card.

![Youtube age verification](/images/why-give-id-card-01.png)

And that's a no. I won't. Why should I?



# Youtube and European regulations

Digging more into this, I find out that Youtube posted [a blog](https://blog.youtube/news-and-events/using-technology-more-consistently-apply-age-restrictions/) on September 22, 2020, annoucing the new changes to their policy. In this blog post, titled _Using technology to more consistently apply age restrictions_, Youtube team goes over the forthcoming European Union's [Audiovisual Media Services Directive](https://ec.europa.eu/digital-single-market/en/revision-audiovisual-media-services-directive-avmsd), and how, under this directive, they have to make sure their user is over 18 to access restricted content.

Fair enough. Let's check [this directive](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32018L1808&from=EN#d1e1323-69-1).

> Article 6a
>
> Member States shall take appropriate measures to ensure that audiovisual media services provided by media service providers under their  jurisdiction which may impair the physical, mental or moral development  of minors are only made available in such a way as to ensure that minors will not normally hear or see them. Such measures may include selecting the time of the broadcast, age verification tools or other technical  measures. They shall be proportionate to the potential harm of the  programme.

Indeed, the directive mentions age verification tools. This is used as an example, and clearly balanced based on the content. Like, I may be young, but I know there is porn on TV. In short, this age verification is not something Youtube has to do, it's something they decided to implement.

They could have leveraged:

+ the age of the account, mine is 14 years old, and I did not open it at age 4
+ the kind of videos/channels I'm subscribe to
+ or ask me to come at a later time, if the content is too sensitive

This is not a legal advice. I'm not a lawyer. Nevertheless, I'm sure there were better way to handle this.

## Everyone does it

The ask from Youtube feels an extension of showing a card to buy alcohol or to enter a club. It is a weird moment between you and what you are looking for, protected by a bored guardian.

And to their defence, they are not the only one asking for my ID card. In fact, most services I use are moving to this type of check. This is labelled as Know Your Customer (KYC) policies.

For what I recall, the first service asking me to upload my identity card was my bank. Then came an airline company. Then a company mandated by an estate agent. Now Youtube.

Is this really necessary? I put money on my bank account monthly, I fly regularly with my airline company, and I have a deposit with my estate agent. Youtube probably has more data than all of these companies combined, and is still asking for some verification.

The thing that depresses me the most is when they all come at the end of the year with shiny web interfaces telling me how great the year with me was. The bank telling me I spent hundreds in groceries, the airline that it's missing me, the estate agent that my rented flat is the best they've ever seen. And Youtube celebrating creators I don't follow. So clearly, they have data, they know me. Nevertheless, they still ask me.

## The cost to user

I should not feel concern but I am. We are in 2021. It is easier than ever to [impersonate a website](https://patents.google.com/patent/US7370015B2/en). Most users do [not know basic security principles](https://dl.acm.org/doi/abs/10.1145/2858036.2858214). I probably don't either.

And with all this in mind, most companies require users to upload sensitive information via web forms. Companies that do not have an actual need for it! Youtube does not, my estate agent does not, my airline company falls into a category I wish would not. And my bank, well, is my bank.

The KYC system is worse than it looks. Once one of the company you have KYC-ed with falls victim of a breach, your online identity is compromised everywhere. With a manual verification, the attacker can now impersonate you in most of your accounts. ID cards don't lie.

A remedial to this issue came when companies started asking for a unique passcode (usually 6 digits) to be written down when uploading the picture of your ID card. I am still unsure how this helps. Sure, it delays the scammers that got ID before, but we are in 2021; Adobe Photoshop is more than [30 years old](https://en.wikipedia.org/wiki/Adobe_Photoshop). Moreover, computer generated pictures start to look good, very good.

![Picture of generated.photos](/images/why-give-id-card-02.png)

In the end, users pay the cost. They are the ones which credentials get compromised. It is their identity that is placed at risk. Their life being uploaded online. I trust companies saying they are complying with the law. I trust Youtube telling me they have to check my age. I simply think that these checks do not fulfil their goals and place an immense burden on users.

## A better path

This post could have ended here. Me ranting that things were better before, pointing out issues in the way data is being handle by tech companies. However, the picture would not be complete. I think there are ways to make this better.

First, no company should ask me for documents defining my identity. These are _very_ sensitive data and I don't trust any company with them. No matter how secure they are, they [will have a breach](https://en.wikipedia.org/wiki/List_of_data_breaches). This is [trickier](https://onlinelibrary.wiley.com/doi/abs/10.1111/lsi.12303) for services that have actual legal requirements to do so, such as my bank.

Second, if your password system does not offer Multi-Factor Authentication (MFA), do not bother ask for secure documents. Asking for specific letters in a second password does not count as MFA. If you are expecting me to trust you are doing everything possible to store my documents securely, apply standard security practices. I don't care about "but our telephone support needs to know the 3rd character of your password". This is a no!

Thirdly, look at cryptography. Recent research in Fully Homomorphic Encryption and Zero Knowledge Proof made secure assessment on the client side feasible. I imagine a company valued over a trillion dollar, and with some of the best researchers on the planet, has resources to unearth privacy preserving age verification tools.

Finally, companies should be more transparent on their policy enforcement. Internet has become a central place of exchange for a lot of people online. New policies have a huge impact on users, and their daily life. I applaud the effort of the Youtube team to share a blog about their policy change, but I can only deplore the absence of user quotes. An additional requirement places content [one step away from the user](https://twitter.com/yopalmm/status/1344806043881189383?s=20).