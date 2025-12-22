---
layout: post
title: "Xcode Extensions Using JavaScript"
tags:
  - javascript
  - runtime
  - deno
  - V8
  - web

comments: true
---


Code Friend is an Xcode Extension, provides JavaScript interface, users can based on this App simply and quickly develop Xcode plugin tools.

Official address: <https://qvcodefriend.github.io/>
Mac App Store address: <https://itunes.apple.com/cn/app/code-friend/id1441249580>

<!-- more -->

# Background

Starting from Xcode 8, Apple provided XcodeKit for developing Xcode Extensions. But because various bugs and interface too simple, never liked by developers. Until now Xcode 10, XcodeKit's provided functionality still limited.

Even so, still many enthusiasts, developed various small features, for example: Awesome native Xcode extensions
 <https://github.com/theswiftdev/awesome-xcode-extensions>

Recently joined new company, have new requirements for code standards, so wanted to use scripts to find code that doesn't meet standards, finally thought of developing an Xcode Extension to check code standards. During development also felt if using pure Native development, each time if want to adjust or add standards, need to recompile, even resubmit for review, too troublesome.

So had current Code Friend idea. Through JavaScriptCore encapsulate XcodeKit's provided functionality. Function logic uses JavaScript development.

Below officially starts introducing Code Friend.


# Basic Information

Code Friend is a macOS App, built-in Xcode Source Editor Extension. Can search `Code Friend` in Mac App Store to install.

![](/media/15421232259243.jpg)


# Usage


## Enable

Due to system's permission control for Extensions, need to enable Code Friend in `System Preferences -> Extensions -> Xcode Source Editor -> Code Friend Extension`.

![](/media/15421233842897.jpg)
![](/media/15421233931819.jpg)


## Built-in Function Usage

After Code Friend enabled, use Xcode to open any project, open menu Editor, bottom can see Code Friend.

![](/media/15421237614957.jpg)

For example select everettjf, click Convert to ASCII text (style1), can see next line of everettjf's line appears corresponding ASCII Text.

![](/media/15421238735777.jpg)

Other menus similar. Sort lines can sort selected multiple lines. About opens official website.

At this point, these are what an ordinary Xcode Extension can do.

But, here each menu's functionality is implemented using JavaScript, interesting. Code can see <https://github.com/qvcodefriend/qvcodefriend.github.io/tree/master/packages/builtin>


## DLC Pack 1 Installation and Usage

Simply implementing a menu is simple, like providing some JSAPI to H5, but if implementing a mini-program platform, is more troublesome. In this aspect, Code Friend can say is a very simple mini platform.

DLC Pack 1 is a function expansion pack (I randomly named, similar to zelda's dlc ha).

Open Code Friend's macOS App.
![](/media/15421245151297.jpg)

![](/media/15421245028819.jpg)

Click top left `AddPack`, then click top right `Try DLC Pack1`, at this time DLC Pack1's installation address (https://qvcodefriend.github.io/packages/dlc/) is filled in.

![](/media/15421246133012.jpg)

Click `Add`, will start downloading expansion pack, if smooth, will tell `All Succeed :)`.

![](/media/15421247253435.jpg)

Click `Close`.

At this time can see main interface has one more entry `Code Friend DLC Pack 1`, click, right side can display some configuration information. Currently for simplicity, directly displays this expansion pack's json configuration file. Can see which menus.

![](/media/15421248124141.jpg)

Code Friend's desktop App can close.

Xcode also needs to completely exit, reopen.
![](/media/15421250191664.jpg)


Open a project again, can see menus have new DLC Pack1 menus.

![](/media/15421251021711.jpg)


At this point, usage methods are these.

# Marketplace

Similar to DLC Pack1 such expansion packs, anyone can develop (development method see below), just need to tell an installation address, can install into Code Friend.

Then need to organize an official expansion pack marketplace, website: <https://qvcodefriend.github.io/marketplace/> . Currently just a website, can install using Url in it.

Desktop App top right click can access.

![](/media/15421252843232.jpg)

Currently only `Code Friend DLC Pack 1` this one expansion pack ha.

# Develop New Functions

## Simple Say

Time to develop own expansion pack. Simple say has two steps:

1. According to <https://qvcodefriend.github.io/develop/> format here call API to develop.
2. Publish to a website Code Friend can access (for example GitHub Pages).

Below uses GitHub Pages to quickly create an expansion pack. GitHub Pages introduction address <https://pages.github.com/>.

## Three Steps

### 1) Step One, Create an Organization

Click menu in figure below, or directly visit <https://github.com/organizations/new>

![](/media/15421258051352.jpg)

![](/media/15421258620115.jpg)

For example I call `MyCodeFriendPackage`, if you create need use a different name.

### 2) Step Two, Create GitHub Pages

Visit <https://github.com/qvcodefriend/helloworld> click Fork, and select organization just created. As below (Emmmm... My created organizations a bit many...)

![](/media/15421261491607.jpg)

After Fork completes, modify forked repository's name to: mycodefriendpackage.github.io . (Note here must be organization name's lowercase)

![](/media/15421267537385.jpg)

After renaming completes, continue in Settings page bottom, select `Choose a theme`.
![](/media/15421268178718.jpg)

![](/media/15421268398919.jpg)

Any one is fine, click `Select theme`, at this time can see GitHub Pages section prompts <https://mycodefriendpackage.github.io/> can access.

![](/media/15421269121160.jpg)



### Step Three, Implement Function

At this time can clone repository <https://github.com/MyCodeFriendPackage/mycodefriendpackage.github.io>

```
git clone git@github.com:MyCodeFriendPackage/mycodefriendpackage.github.io.git
```

Open folder, can see helloworld folder

![](/media/15421276137672.jpg)

Among them helloworld/manifest.json format:

![](/media/15421275002360.jpg)

- name expansion pack name, displayed in Code Friend desktop client list's name
- version version
- author author
- website official website
- description function description
- menu supported menu items

All simple, see know how to modify. Among them menu's id is folder (for example menu id in figure above is hello corresponds to a hello folder).

hello folder must have an entry.js, inside entry variable's array, defines all JavaScript files needed for current menu function implementation, Code Friend when loading will execute in order.

```
var entry = [
    'main.js'
];
```

main.js must have an onMenuClicked function, return value must be a dictionary containing result.

```
var onMenuClicked = function(identifier){

    invocation.appendLines(['Hello World']);

    return {
        'result':true
    };
};

```

At most important step. Call API to implement function.

API provides `invocation` and `system` two global variables, simply list below. Details see documentation <https://qvcodefriend.github.io/develop/>

```
# invocation
## getter,setter
1) [getter] invocation.contentUTI
2) [getter] invocation.tabWidth
3) [getter] invocation.indentationWidth
4) [getter] invocation.usesTabsForIndentation
5) [getter] invocation.selectionExist
6) [getter,setter] invocation.selections
7) [getter] invocation.firstSelection
8) [getter] invocation.selectionStrings
9) [getter] invocation.selectionLines
10) [getter,setter] invocation.completeBuffer
11) [getter,setter] invocation.lines
12) [getter] invocation.lineCount

## method
1) invocation.insertLinesAtIndex(ArrayOfString,Integer)
2) invocation.appendLines(ArrayOfString)
3) invocation.removeLinesFromTo(Integer,Integer)
4) invocation.assignLineAtIndex(String,Integer)

# system
## method
1) system.log(String)
2) system.openURL(String)
```

For example helloworld above's ```invocation.appendLines(['Hello World']);``` is add new line at current document's end, content is `Hello World`.


### Step Four, Complete

After above completes, helloworld expansion pack's address is <https://mycodefriendpackage.github.io/helloworld/>, can add in desktop client.
![](/media/15421282993106.jpg)

Menu name `Hello world` also appears, after clicking can append `Hello World` line.

![](/media/15421283452058.jpg)



# Reference Expansion Pack Source Code

Code Friend built-in ASCII Text, Sort lines, and DLC Pack 1 all implemented using JavaScript.
Code addresses:
<https://github.com/qvcodefriend/qvcodefriend.github.io/tree/master/packages>


# Future

Code Friend currently is just an MVP version, future will continuously improve with usage. Also, currently XcodeKit's provided functionality still limited, can only operate current file's content. Believe Apple future will open more functionality, at that time Code Friend's flexibility can be reflected.

# Summary

From idea to implementation, really not an easy process.

