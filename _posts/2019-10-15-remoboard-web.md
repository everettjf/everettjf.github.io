---
layout: post
title: "Remote Input Method - Type on Phone Using Browser"
categories:
  - Product
tags:
  - Product
  - Input Method
  - Work
comments: true
---

Thanks:

- [Minority: "Remote Input Method" New Version Released, Type on Phone Using Browser]( https://sspai.com/post/57008)
- [iPlaySoft: Remote Input Method - Creative Efficiency App for Typing on Phone Using Computer Keyboard! Saves Bluetooth Keyboard Money](https://www.iplaysoft.com/remoboard.html)
- [Most Beautiful App: This APP Finally Solved Trouble That Bothered Me So Many Years](https://mp.weixin.qq.com/s/PLWkVuEdJCk6cLGEQVZDbw)
- [Virtual Framework: Remote Input Method Released, Type on Phone Using Computer](https://mp.weixin.qq.com/s/wC7clnEAGCHA09zrVd2s4w)
- [Minority Software: This Idea Is Big: Remote Input Method, Type on Phone Using Computer](https://www.appinn.com/remoboard/amp/)

Also thanks to "PriceTag" and other media's promotion.

---

`Remote Input Method` is an input method app, can implement `using computer to type on phone`, make phone typing faster. When using Remote Input Method, phone client will display a URL, access this URL in computer browser, can start input. Text entered in browser sent to phone, thus implementing typing on phone using computer.

Mobile client supports iOS and Android, computer just needs browser (so supports macOS/Windows/Linux three platforms).

Remote Input Method displays as `Remoboard` in English systems, meaning Remote Keyboard.

![](/media/15711544847169.jpg)



<!-- more -->


Normally we don't need remote input, but in following scenarios, Remote Input Method can help:

## Scenarios

Scenario one:

An app only has mobile version, no computer version (or don't want to purchase computer version ha), and this app's usage needs "lots of text input work".

1. For example iOS platform's DayOne diary app, I purchased iOS version but don't want to purchase macOS version, usually can use Remote Input Method to write diary.
2. Also for example WeChat chat, many company work computers don't allow installing WeChat computer client, at this time using Remote Input Method can speed up chatting. (Finish chatting quickly, quickly return to work) (For me, occasionally netizens private message ask questions, short text can't express clearly, I want to answer and don't want to answer, with Remote Input Method, can type quickly)
3. Paired with Android platform's excellent text writing app "Pure Writing", can also speed up writing speed.

Scenario two:

Mobile end has many excellent `programming environments`, for example JSBox, Pythonista, and recently new Robomaster (using Python to control RoboMaster S1), using Remote Input Method, can relatively conveniently complete mobile programming.

Scenario three:

Even Android smart TVs can install input method, then phone browser accesses input URL, speed up text input speed on TV.

## Download Address

- iOS [AppStore](https://apps.apple.com/cn/app/id1474458879)
- Android [Coolapk](https://www.coolapk.com/apk/241412) or [Google PlayStore](https://play.google.com/store/apps/details?id=com.everettjf.remoboard)

## Quick Start

### iOS Quick Start

(1) Download Remote Input Method from AppStore [AppStore](https://apps.apple.com/cn/app/id1474458879)

(2) Open `Settings>General>Keyboard>Keyboards>Add New Keyboard`

(3) Click `Remote Input Method`

![](/media/15711565435200.jpg)

(4) Keyboard installation complete

![](/media/15711565507727.jpg)

(5) Again click `Remote Input Method` in interface just completed, as shown below `Enable Allow Full Access`

![](/media/15711565163725.jpg)

(6) Now installation complete, in place that can input text, switch to "Remote Input Method", can see a URL (first ensure Wi-Fi already connected), open this address in computer browser, can start input.

Note:
1. Need to ensure phone and computer connected to one network, computer can ping phone's IP address.
2. In browser input complete URL in figure below, for example: http://192.168.31.11:7777

![](/media/15711566433576.jpg)

Addition: If macOS and iOS logged into same AppleId, can use "Copy" and "Handoff" to more quickly open URL on computer. See end of article.

### Android Quick Start

(1) Install from [Coolapk](https://www.coolapk.com/apk/241412) or [Google PlayStore](https://play.google.com/store/apps/details?id=com.everettjf.remoboard), then open app, click Enable Input Method

![](/media/15711572903292.jpg)

![](/media/15711572968980.jpg)

Here might "prompt restart", normally click "OK" ignore.

![](/media/15711573164862.jpg)

(2) Switch Input Method

![](/media/15711573239250.jpg)

(3) Now installation complete, in place that can input text, switch to "Remote Input Method", can see a URL (first ensure Wi-Fi already connected), open this address in computer browser, can start input.

Note:
1. Need to ensure phone and computer connected to one network, computer can ping phone's IP address.
2. In browser input complete URL in figure below, for example: http://192.168.31.11:7777

![](/media/15711573337744.jpg)


## Input Modes


### Input Modes

Has three input modes:

![](/media/15711573669509.jpg)

(1) Standard Input Mode

In this mode can input "one line of text", then "press Enter to send".

![](/media/15711573759717.jpg)

(2) Multi-line Input Mode

In this mode, can "input or paste multi-line text", "click button" to send.

![](/media/15711573838602.jpg)

(3) Programming Input Mode

![](/media/15711573928921.jpg)

In this mode, text will send while typing, very suitable for some mobile programming apps.

## Input Tips

In three input modes, when input text box content is empty, also supports following keys:

1. Backspace: Delete text on phone
2. Left and right keys: Move cursor left and right
3. Up and down keys: Move left and right 20 characters. If phone's left or right not enough 20 characters, won't move.
4. 
![](/media/15711582888909.jpg)



## Copy and Handoff

iOS input method will have "Copy" and "Handoff" buttons, current usage scenario mainly: iOS paired with macOS, and logged into "same AppleID".

![](/media/15711562848185.jpg)

When click "Copy", iOS clipboard content will sync to macOS, open browser on macOS, paste into address bar to open can start input.

But when click "Handoff", due to system restrictions, will first jump to "Remote Input Method's main interface", at this time macOS Dock will appear a "browser icon", click to open corresponding URL.

![-w190](/media/15711562470401.jpg)


## Laboratory

When Remote Input Method first released, I wrote an [article introduction](https://everettjf.github.io/2019/09/06/remoboard-release/), at that time didn't have current "browser input" method. Used older "install computer client software" method, usage more troublesome, and "stability also not good". So this new version I moved these two connection modes to "Laboratory".

Laboratory contains "Connection Mode" switching functionality, can switch to "Bluetooth" and "IP" connection modes. About these two modes, plans:

1. Bluetooth connection mode: Future will gradually optimize.
2. IP connection mode: Will be deprecated. According to situation, gradually replace with Web connection mode's Http interface.

Simply put, functionality in "Laboratory", temporarily not recommended to use ha.


## Free

Currently completely free, existing functionality future also won't charge. If possible, future will develop some small paid functionality.


## Summary

Hope everyone enjoys, if possible, help recommend to more friends to use :)
