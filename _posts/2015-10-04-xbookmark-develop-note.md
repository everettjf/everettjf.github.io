---
layout: post
title: Xcode书签插件XBookmark开发笔记
categories: Skill
comments: true
---






代码：[https://github.com/everettjf/XBookmark](https://github.com/everettjf/XBookmark)

# 效果

![menu](https://everettjf.github.io/images/extern/xbookmark0.3.0.png)
<!-- more -->

# 使用方法
首先要安装插件管理器 `Alcatraz` ，搜索`XBookmark`并安装，重启Xcode后就可以在`Edit`菜单中找到以下功能啦。

    - 对应代码行，按F3可增加、删除书签
    - Shift+F3，可显示书签列表
    - Command+F3，下一个书签
    - Shift+Ctrl+F3，上一个书签

# 背景
初入iOS开发，发现自己以前在Visual Studio中常用的书签功能，Xcode中竟然没有。网上找了一阵子，大概有以下替代方法：
    
    - 使用断点（Disabled Breakpoint)
    - 使用插件XToDo，增加标签BOOKMARK，并在想加书签的代码行增加注释 BOOKMARK
    - 使用插件XcodeBookmark（不是本文说的XBookmark），但此插件貌似不支持Xcode7，而且原理仍然是辅助增加断点。

目前找到了这3种方法，但感觉都不理想。没法快速进行上一个书签、下一个书签切换，没法增加书签注释。
于是，想自己开发一个，就叫做 `XBookmark` 吧。


# 预习文章
开发中大概看了以下几篇文章。

Xcode插件的文章：

<http://studentdeng.github.io/blog/2014/02/21/xcode-plugin-fun/>
<http://www.poboke.com/study/write-a-xcode-plugin-to-auto-select-all-targets.html>
<http://www.onevcat.com/2013/02/xcode-plugin/>

Mac开发的文章：

<http://www.raywenderlich.com/17811/how-to-make-a-simple-mac-app-on-os-x-10-7-tutorial-part-13>

还看了几个插件的源码。

# 开发步骤简要总结

## 安装模板、创建工程
    在 Alcatraz 中的 Templates 中搜索 Xcode Plugin。安装后从此模板创建工程。

![XcodePluginTemplate](https://everettjf.github.io/images/extern/xbookmarkdev1.png)
![XcodePluginCreate](https://everettjf.github.io/images/extern/xbookmarkdev2.png)

## 增加菜单

~~~
NSMenuItem *menuItem = [[NSApp mainMenu] itemWithTitle:@"Edit"];
if (menuItem) {
    [[menuItem submenu] addItem:[NSMenuItem separatorItem]];
    
    {
        NSMenuItem *actionMenuItem = [[NSMenuItem alloc] initWithTitle:@"Toggle Bookmark" action:@selector(toggleBookmark) keyEquivalent:f3];
        [actionMenuItem setKeyEquivalentModifierMask:0];
        [actionMenuItem setTarget:self];
        [[menuItem submenu] addItem:actionMenuItem];
    }
    //...
~~~

## 获取书签位置

~~~
IDESourceCodeEditor* editor = [XcodeUtil currentEditor];
NSTextView* textView = editor.textView;
if (nil == textView)
    return;

NSRange range = [textView.selectedRanges[0] rangeValue];
NSUInteger lineNumber = [[[textView string]substringToIndex:range.location]componentsSeparatedByString:@"\n"].count;

// length of "file://" is 7
NSString *sourcePath = [[editor.sourceCodeDocument.fileURL absoluteString] substringFromIndex:7];

XBookmarkEntity *bookmark = [[XBookmarkEntity alloc]initWithSourcePath:sourcePath withLineNumber:lineNumber];
[[XBookmarkModel sharedModel]toggleBookmark:bookmark];

//...
~~~

## 增加书签列表

![XBookmarkList](https://everettjf.github.io/images/extern/xbookmarkdev3.png)

## 发布到 Alcatraz
挺简单，修改配置文件，创建一个 Pull Request 就可以。
见 <https://github.com/supermarin/alcatraz-packages> 的README。

# 结语
目前仅是完成了基本功能，还有几个需要优化和完善的地方。

- 定位代码行。（代码来自XToDo的代码，但有些情况下定位速度慢。需要查找原因解决）
- 书签标识。代码行前面显示书签符号，对号之类的。
- 注释功能。（增加书签注释功能）
- Mnemonic 书签。（模仿 IntelliJ 系列）

---

# 2015年10月31日更新
感谢网友提供了JumpMarks这个插件（当时如果知道了这个插件，或许就不会开发这个XBookmark了），这个插件实现了快速定位代码行，以及在代码行签名增加标记。但没有提供一个标签列表（还好XBookmark有点区别）。

经过学习JumpMarks的代码，XBookmark近期发布了两个版本（0.2与0.3），感谢JumpMarks作者。
- 0.2版，实现了快速定位代码行。
- 0.3版，增加了快捷键自定义，以及代码行前面的标识。

开发XBookmark的过程很开心，第一次Merge PullRequest（感谢<https://github.com/langyapojun> 解决了Xcode7支持问题），以前没有开发过公开的工具（闷头开发，5年眨眼过去），今年尝试改变，为开源贡献点代码。

关于Xcode7支持的问题，我还挺纳闷，自己开发一直都是Xcode7（Xcode6升级到的Xcode7），为什么没有那个id也可以正常用呢。我得研究研究去……


---

# 2017年1月24日更新

现在已经支持Xcode8了。模仿的XVim的安装方式（重签名Xcode后，make）。




