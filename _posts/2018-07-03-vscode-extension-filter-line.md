---
layout: post
title: "VSCode Extension Filter Line"
categories:
  - Tool
tags:
  - vscode
  - filterline
  - log
comments: true
---




For English article , please visit [here](https://medium.com/@everettjf/vscode-extension-filter-line-ec4250c49a92)



# Background

Daily work troubleshooting problems inevitably involves looking at client logs. After logs are collected, need to carefully look at key information in logs with wide eyes, some problems can't be determined by a single log line, need to find clues from multiple log lines.


<!-- more -->


# Scripts

In this situation gradually wrote some scripts to filter logs, for example convert logs below:


![](/media/15307124731455.jpg)


Through regex matching, translate to below:


![](/media/15307124830202.jpg)

This way is easy to understand, after filtering can see problem time at a glance. Relieved eye strain, life improved a lot.

# Why vscode

These two years looking at logs, from initial TextWrangler to sublime to emacs to vim to atom, used all of them, until later found vscode opens large files very smoothly, been using vscode since.

# vscode Extension

Recently generalized daily translation scripts, wrote a vscode extension `Filter Line`, share for everyone to use.

Extension supports filtering and translating logs line by line based on single string, single regex, and more flexible configuration files.

Reference animation:

![byconfigfile.gif](https://github.com/everettjf/vscode-filter-line/raw/master/img/byconfigfile.gif)


## Install Extension

1. Download vscode, https://code.visualstudio.com/
2. Search extension, click Install

![](/media/15307125087674.jpg)



3. After installation completes, click Reload.

##  Usage

Open a folder, for example ~/log2eoml folder, put log log.txt into this folder. Can directly reference this [demo](https://github.com/everettjf/vscode-filter-line/raw/master/demo.zip), after extracting drag demo/log2eoml folder into vscode.

1. Open log2eoml folder, and open foo.log
![](/media/15307125928088.jpg)
![](/media/15306872946057.jpg)


2. Run command+shift+p, input filter line by config file (or filter config), select `Filter Line By Config File`, as below.
![](/media/15307126136726.jpg)


3. Press Enter, generates new file foo.log.filterline.log, and automatically opens. This is filtered, translated logs.

![](/media/15307126242712.jpg)


# Principle

Open log2eoml/.vscode/filterline.eoml file,



![](/media/15307126453529.jpg)

Configuration file format is simple:

1. type is general, refers to general type.
2. prefix is regex expression matching prefix. Here is to match each line's time, thread and other information.
![](/media/15307126797868.jpg)


3. rules are filtering, translation (replacement) rules.
4. src is matching regex. dest is string to replace with.
5. tag is prefix added to output when matched. Certain special lines, for example crash, can obviously add an emoji icon.
6. flag is global marker. For example app enters background, then add marker to all lines, when returns to foreground cancel this marker.
7. until is when matching a line, following several lines continuously output original content, until a line matches regex expression.

# More Formats

filterline.eoml is one format, can also use filterline.json. For example [this file](https://github.com/everettjf/vscode-filter-line/blob/master/demo/log2json/.vscode/filterline.json) .

eoml is a simple format I created, mainly to solve problem of regex expressions in json needing escaping.

More log filtering demos, can reference <https://github.com/everettjf/vscode-filter-line/tree/master/demo>

More information can reference <https://github.com/everettjf/vscode-filter-line>

# Conclusion

Log translation (replacement) saved a lot of troubleshooting time, past time let me locate problems faster. Believe can also speed up everyone's problem location time.

Can also relieve eye fatigue～～
