---
layout: post
title: "USB Keyboard Input Method for iOS"
categories:
  - iOS Development
tags:
  - iOS
  - development
  - mobile

comments: true
---

*USB Keyboard originally named QVKeyboard, renamed perhaps to make easier to record and search*

USB Keyboard is an input method app, after connecting iPhone to Mac via USB, can type on Mac end, input on iPhone.

<!-- more -->

# Scenarios

I encountered following two scenarios:

1. Often need to chat about technology with others on WeChat, but many technical content needs to type many words, phone typing really not used to. In some situations, computer not suitable or don't want to install WeChat's Mac client. Want to quickly finish chatting, quickly work.
2. Day One is a good App, purchased mobile version, but sometimes when want to write more content, again feel phone typing too troublesome.

So I searched some existing Apps, either too expensive, or pairing too complex, or unstable, or doesn't support Chinese. Until one day browsing GitHub saw an old library PeerTalk. Through connecting USB cable can immediately achieve pairing, saves inputting IP, finding Bluetooth and other pairing processes, can say simple direct fast.


# Environment

Currently USB Keyboard mobile end only iOS, PC end only macOS. Future may adapt Android and Windows platforms as needed.

# Installation

iOS App : 
1. <https://itunes.apple.com/cn/app/qvkeyboard/id1439106456>
2. Search `qvkb` or `usbkeyboard` or `qvkeyboard` can find.

![](/media/15402514895616.jpg)
![](/media/15402515094809.jpg)
![](/media/15402515243124.jpg)


macOS Client : 

1. GitHub <https://github.com/qvkeyboard/qvkeyboard/releases>
2. Baidu Cloud <https://pan.baidu.com/s/1lRPMJcy22oSSiUDhM5yyAw>

![](/media/15402511097109.jpg)


# Usage

1. On iOS after USB Keyboard installed, open "Settings - General - Keyboard - Keyboards - Add New Keyboard", in "Third-party Keyboards" area click "USB Keyboard".
2. Click USB Keyboard again, click "Allow Full Access", then "Allow".
3. Open any app interface that can input text, switch input method to USB Keyboard.
4. Now keyboard will display as below:
![](/media/15402274921197.jpg)
5. Open macOS client
Icon as below:
![](/media/15402510498645.jpg)

After opening interface as below:
![](/media/15402275665008.jpg)
6. At this time if iOS and macOS connect successfully, will both display 🌈Ready for type:)

![](/media/15402289330298.jpg)

7. Can type in input box. Press Enter will send. Enjoy it :)


# Two Input Modes

- Single line mode: In single line mode pressing Enter will send. Generally suitable for chatting, etc.
- Multi-line mode: In multi-line mode, need ⌘↩ to send. Generally suitable for pasting large amounts of text to Moments, etc.

# Shortcuts

macOS client's three buttons below have shortcuts, currently no on-interface hints:

- Delete (delete key): ⌥⌫
- Return (Enter): ⌥↩
- Send to iPhone (send current content to iPhone): ⌘↩

# Delete Key

When text box content is empty, continue pressing `Delete` key, will also send `Delete` to iOS.

# Privacy

Since need to communicate with Mac client, must enable "Allow Full Access". But for input method, if allow full access, then inevitably brings security risks. Although I did nothing, but existence of trust introduces human factor.

# Principle

Actually principle is simple, see open source library <https://github.com/rsms/peertalk>

# Code

Emmm... This time not open source.

# Summary

Review process because involves multiple ends coordination, also specially recorded a video, placed at <https://youtu.be/-vr_rHpgwAM> , very poor spoken English ha.

Developing such simple App also quite time-consuming, so in future support independent developers more. Also to develop this App, almost a month didn't update subscription account, now finally released, next step continue learning and sharing.


Welcome to follow subscription account "Client Technology Review":
![](/images/fun.png)


