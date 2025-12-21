---
layout: post
title: "Remote Input Method Released, Type on Phone Using Computer"
categories:
  - Product
tags:
  - Tool
comments: true
---


**Current article a bit outdated, can see new article** [Remote Input Method New Version Released, Type on Phone Using Browser](https://everettjf.github.io/2019/10/15/remoboard-web/)

---

`Remote Input Method` (Remote Keyboard or Remoboard) is an input method app, can implement `using computer to type on phone`. It contains `computer client` and `phone client` two parts, when inputting, computer client first connects to phone client through IP address or Bluetooth, then type in computer client's app, text will be sent to phone client, phone client's input method completes simulated input.

Simply put, this way "typing faster". Phone client supports iOS and Android, computer client supports macOS and Windows.

<!-- more -->

![](/media/15682174633090.jpg)


Normally we don't need remote input, but in following scenarios, Remote Input Method can help:

## Scenarios

Scenario one:

An app only has mobile version, no computer version (or don't want to purchase computer version ha), and this app's usage needs "lots of text input work".

1. For example iOS platform's DayOne diary app, I purchased iOS version but don't want to purchase macOS version, usually can use Remote Input Method to write diary.
2. Also for example WeChat chat, many company work computers don't allow installing WeChat computer client, at this time using Remote Input Method can speed up chatting. (Finish chatting quickly, quickly return to work) (For me, occasionally netizens private message ask questions, short text can't express clearly, I want to answer and don't want to answer, with Remote Input Method, can type quickly)
3. Paired with Android platform's excellent text writing app "Pure Writing", can also speed up writing speed.

Scenario two:

Mobile end has many excellent `programming environments`, for example JSBox, Pythonista, and recently new Robomaster (using Python to control RoboMaster S1), using Remote Input Method, can relatively conveniently complete mobile programming.


## Download Address

Mobile client

- iOS [AppStore](https://apps.apple.com/cn/app/id1474458879)
- Android [Coolapk](https://www.coolapk.com/apk/241412) or [Google PlayStore](https://play.google.com/store/apps/details?id=com.everettjf.remoboard)

Computer client

- macOS [GitHubRelease](https://github.com/remoboard/remoboard.github.io/releases) or [Baidu Cloud](https://pan.baidu.com/s/1F0LpkM4FJeYssJXmRGb6kA)
- Windows [GitHubRelease](https://github.com/remoboard/remoboard.github.io/releases) or [Baidu Cloud](https://pan.baidu.com/s/1F0LpkM4FJeYssJXmRGb6kA)


## Usage

Since mobile client has iOS and Android, computer client has macOS and Windows. So usage combinations have four, `iOS+macOS` /`iOS+Windows` / `Android+macOS` / `Android+Windows`. Since usage methods basically same, here mainly uses `iOS/Android+macOS` as example to explain, other combinations' usage methods can infer.


### Mobile Client Installation

(1) From mobile client download address above, download app.

(2) Configure input method.

iOS platform:

Open `Settings>General>Keyboard>Keyboards>Add New Keyboard`, select `Remote Input Method`.
![](/media/15677896500296.jpg)
After adding, click Remote Input Method again, enable `Allow Full Access`
![](/media/15677897187196.jpg)

Android platform:

After opening app, click `Enable Input Method`, then enable in next interface.
![](/media/15677897747263.jpg)
![](/media/15677897792986.jpg)


### Computer Client Installation

macOS client:

Download `RemoboardMac.zip` [here](https://github.com/remoboard/remoboard.github.io/releases)

![](/media/15677898790466.jpg)

Extract RemoboardMac.zip, double click Remoboard.dmg, drag Remoboard.app into Applications.

![](/media/15682472458141.jpg)

Windows client:

Download `RemoboardWindows.zip` [here](https://github.com/remoboard/remoboard.github.io/releases)

After extracting, double click to install, after installation completes computer desktop will have shortcut.

### iOS Usage

Advance note: `To simplify getting started steps, first ensure phone and computer both connected to Wi-Fi`


(1) On phone, open any app that can input text, long press bottom left to switch to Remote Input Method

![](/media/15677900349799.jpg)

Now, Remote Input Method will display a `connection code, and IP address`.

![](/media/15677901020861.jpg)

(2) Open Remote Input Method on macOS

![](/media/15677901643408.jpg)


Input connection code displayed on phone input method, then click "Connect". If everything normal, connection succeeds. If connection fails, please check if phone and computer connected to same internal network (computer can ping phone's IP address).

![](/media/15677902102892.jpg)

Corresponding phone will display Connected, type :)

### Android Usage

(1) Android when inputting, switch to Remote Input Method.
![](/media/15677903289940.jpg)

Also displays connection code, input in computer client to connect.

![](/media/15677903674581.jpg)

(2) Open Remote Input Method on macOS

![](/media/15677901643408.jpg)


Input connection code displayed on phone input method, then click "Connect". If everything normal, connection succeeds. If connection fails, please check if phone and computer connected to same internal network (computer can ping phone's IP address).

![](/media/15677902102892.jpg)


## Official Website

OK, basic functionality is these. Also some `features` and `configurations`, see below.

This is official website tutorial [https://remoboard.app/zhcn/](https://remoboard.app/zhcn/)


## Input Modes

![](/media/15677904928723.jpg)

(1) Standard Input Mode

In this mode can input "one line of text", then "press Enter to send".
![](/media/15677905088388.jpg)

(2) Multi-line Input Mode

In this mode, can "input or paste multi-line text", "click button" to send.
![](/media/15677905197719.jpg)


(3) Instant Input Mode (Programming Mode)

In this mode, text will send while typing, very suitable for some mobile programming apps. Personally think this mode is quite interesting, might suit `JSBox` or `Pure Writing` such apps.

![](/media/15677905271431.jpg)


## Connection Modes

![](/media/15677905465471.jpg)

Has two connection modes:

(1) Connection code or IP address mode. (Connection code essentially is another representation of IP address)

(2) Bluetooth mode. (Currently might not stable enough, if problems restart computer client, basically sufficient ha)

Normally, connection code is sufficient, but might in some company internal networks, due to security policy configuration, phone and computer can't connect to each other (can't ping), at this time can use Bluetooth mode.


## Free

Yes, currently all functionality free.

Although development cost me quite some time, but personally feel still niche need, exactly how many people need this app, I also can't estimate. So decided currently all functionality free. If future has new special functionality, might consider in-app purchase method.



## Development Plans

(1) Usability: Currently crashes still occasionally occur, especially Android and Windows clients, future I will gradually improve and optimize as I use.

(2) WEB Connection Mode: Some occasions not convenient to download computer client, so can consider phone as a small WEB server, when need remote input, access phone's WEB server to send text. This is also an interesting method to implement remote input.

(3) Bidirectional Message Transmission: Currently only "computer sends text to phone", future might consider "reverse" to implement some interesting functionality.


## History

Last year I developed a [USBKeyboard](https://everettjf.github.io/2018/10/22/qvkeyboard-release/), this input method needs phone and computer connected via "USB" to input, at that time netizens said can support "wireless input", so intermittently this year developed this "Remote Input Method".

Recently also coincided with me learning Android development, so iOS/Android/macOS/Windows four platforms all supported.

