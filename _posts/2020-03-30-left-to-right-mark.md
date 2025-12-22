---
layout: post
title: "Hidden Symbol in ?WhatsApp App Name"
tags:
  - assembly
  - symbol
  - obfuscation
  - C
  - low-level

comments: true
---

Welcome everyone to watch this episode of "Approaching Science: WhatsApp Mysterious Symbol"～

<!-- more -->


## Crime Scene

About half a year or even longer ago, when using frida-ios-dump, accidentally discovered WhatsApp app's name a bit strange.

> frida-ios-dump is a jailbreak iOS App decryption tool (can also list iOS app list).
> Address: https://github.com/AloneMonkey/frida-ios-dump

Carefully look at WhatsApp in figure below:
![](/media/15855012198617.jpg)

WhatsApp's name left alignment different from other Apps.

... How many times hurriedly passed by ... How many times treated as non-existent ...

Until today I finally got curious once, want to see why not aligned here.


## Start

Smash, try smashing.

```
python dump.py net.whatsapp.WhatsApp
```

After smashing, as below. Appears a question mark. `?WhatsApp.ipa`, what is question mark.

![](/media/15855017374127.jpg)

Prepare `mv` to other folder to research, at this moment...

![](/media/15855018704881.jpg)

Mysterious character `\342\200\216` appeared, just curious...

## Search

Casually searched ... really found :)

![](/media/15855020124999.jpg)

> https://graphemica.com/200E

Open to see, really has meaning～ `left-to-right mark` 

![](/media/15855021218820.jpg)

## Truth Revealed

Wikipedia also has explanation

> The left-to-right mark (LRM) is a control character (an invisible formatting character) used in computerized typesetting (including word processing in a program like Microsoft Word) of text that contains a mixture of left-to-right text (such as English or Russian) and right-to-left text (such as Arabic, Persian or Hebrew). It is used to set the way adjacent characters are grouped with respect to text direction.

> https://en.wikipedia.org/wiki/Left-to-right_mark

Paste translation:

> Left-to-right mark (Left-to-right mark,LRM) is a control character, or invisible typesetting symbol. Used in computer bidirectional text typesetting.

I say in plain language. Left-to-right mark is an invisible symbol, used to include `left-to-right` text in `right-to-left` typesetting languages (for example Arabic).

Example in figure below is clearer: after using LRM symbol, Arabic (right-to-left) contains displayed `C++` (left-to-right).

![](/media/15855024011241.jpg)


## Extended Reading

Has `Left-to-right mark`, also has `Right-to-left mark`.

> https://en.wikipedia.org/wiki/Right-to-left_mark


## Further

Take WhatsApp's `Info.plist` file out to look, seems nothing special.

![](/media/15855026225476.jpg)

Look with binary editor.

![](/media/15855027112567.jpg)

`\342\200\216` is `0xE2 0x80 0x8E (e2808e)`

![](/media/15855027969727.jpg)


This way in code getting `CFBundleDisplayName` and concatenating with other localized languages, can ensure WhatsApp's order from left to right.

---

Very interesting :)

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)
