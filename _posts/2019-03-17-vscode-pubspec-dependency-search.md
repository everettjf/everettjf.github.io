---
layout: post
title: "vscode Extension for pubspec Dependencies"
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---


Recently preliminarily learned Flutter (https://flutter.dev/).


While learning some open source code discovered a small need: pubspec.yaml has many dependencies, beginners many unfamiliar, need to copy one by one to https://pub.dartlang.org/ to search and query documentation.


Thought can develop a vscode extension, add a button next to corresponding package name, I just need to click. (Ah, too lazy?)

<!-- more -->


So today developed such a vscode extension:

Pubspec Dependency Search

![](/media/15528243123320.jpg)


After installing extension, when opening pubspec.yaml, extension will find dependencies and dev_dependencies, and add a line of text (link) above each dependency. For example: Search flutter in Dart Packages .

![](/media/15528243493141.jpg)

After clicking can open Dart Packages to search.

![](/media/15528243710418.jpg)


Installation address:

<https://marketplace.visualstudio.com/items?itemName=everettjf.pubspec-dependency-search>

Source code:

<https://github.com/everettjf/vscode-pubspec-dependency-search>


Principle:

1. Principle is simple, vscode extension parses dependencies in pubspec.yaml, then through CodeLensProvider tells vscode where to add links.
2. Link is constructed URL: https://pub.dartlang.org/packages?q=flutter open with browser.




---




Added some Flutter learning materials recently organized:



1. Quickly familiarize Dart language https://www.dartlang.org/guides/language/language-tour 
2. Quickly go through documentation https://flutter.dev/docs/development/ui/widgets-intro
3. Cookbook examples go through once https://flutter.dev/docs/cookbook
4. Flutter Practice https://book.flutterchina.club/



Then start implementing your ideas～ Don't forget to install vscode extension Pubspec Dependency Search oh.



---




Hmm, interesting :)

Welcome to follow subscription account "Client Technology Review":
![](/images/fun.png)




