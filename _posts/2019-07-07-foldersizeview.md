---
layout: post
title: "FolderSizeView - TreeMap Tool for Displaying Folder Contents"
categories:
  - Tool
tags:
  - Tool
comments: true
---

FolderSizeView can use TreeMap method to display file size proportion situation within a folder.

![](/media/15624354225784.jpg)


## Background

Often have need to analyze file size occupation within a folder (for example analyze mobile App's installation package size), all along [GrandPerspective](http://grandperspectiv.sourceforge.net/) basically met this need, but when using often hope to see `folder's parent-child relationships`, FolderSizeView solved this small need.


<!-- more -->

## System Support

macOS and Windows

## Download Address


[GitHub Download Address](https://github.com/foldersizeview/foldersizeview.github.io/releases)


## Usage

Step one open software

![](/media/15624354676264.jpg)


Step two drag folder to analyze in

For example I drag Wechat.app in, then displays as below.

![](/media/15624355630220.jpg)

## Options

Through menu `Action->Group by file extension` can enable grouping by file type. As below:

![](/media/15626040281694.jpg)

Through menu `Action->Sunburst Mode`, can use sunburst chart display (normally TreeMap chart is sufficient, sunburst chart when files many display effect not good). As below:

![](/media/15626040706222.jpg)



## Source Code

~~None, hehe.~~

Has <https://github.com/foldersizeview/foldersizeview>

## Addition

Current version is quickly developed, `traversing folders all recursively implemented on main thread, if folder content too much, generally will crash`. But daily analyzing App installation packages, etc., all no problem.


## Summary

Too simple, article also finished.


---

Welcome to subscribe :)

![](/images/fun.png)





