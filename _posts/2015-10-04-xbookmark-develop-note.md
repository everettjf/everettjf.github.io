---
layout: post
title: Xcode Bookmark Plugin XBookmark Notes
categories: Skill
comments: true
---



Code: [https://github.com/everettjf/XBookmark](https://github.com/everettjf/XBookmark)

# Effect

![menu](https://everettjf.github.io/images/extern/xbookmark0.3.0.png)
<!-- more -->

# Usage
First, install the plugin manager `Alcatraz`, search for `XBookmark` and install it. After restarting Xcode, you can find the following features in the `Edit` menu.

    - For the corresponding code line, press F3 to add/remove bookmark
    - Shift+F3, show bookmark list
    - Command+F3, next bookmark
    - Shift+Ctrl+F3, previous bookmark

# Background
As a beginner in iOS development, I found that the bookmark feature I commonly used in Visual Studio doesn't exist in Xcode. After searching online, there are roughly the following alternatives:
    
    - Use breakpoints (Disabled Breakpoint)
    - Use plugin XToDo, add tag BOOKMARK, and add comment BOOKMARK on the code line where you want to add a bookmark
    - Use plugin XcodeBookmark (not the XBookmark mentioned in this article), but this plugin doesn't seem to support Xcode 7, and the principle is still to assist in adding breakpoints.

I found these 3 methods, but none of them felt ideal. You can't quickly switch to previous/next bookmark, and you can't add bookmark comments.
So, I wanted to develop one myself, let's call it `XBookmark`.


# Reference Articles
During development, I roughly read the following articles.

Xcode plugin articles:

<http://studentdeng.github.io/blog/2014/02/21/xcode-plugin-fun/>
<http://www.poboke.com/study/write-a-xcode-plugin-to-auto-select-all-targets.html>
<http://www.onevcat.com/2013/02/xcode-plugin/>

Mac development articles:

<http://www.raywenderlich.com/17811/how-to-make-a-simple-mac-app-on-os-x-10-7-tutorial-part-13>

I also looked at several plugin source codes.

# Brief Summary of Development Steps

## Install Template, Create Project
    Search for Xcode Plugin in Templates in Alcatraz. After installation, create project from this template.

![XcodePluginTemplate](https://everettjf.github.io/images/extern/xbookmarkdev1.png)
![XcodePluginCreate](https://everettjf.github.io/images/extern/xbookmarkdev2.png)

## Add Menu

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

## Get Bookmark Position

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

## Add Bookmark List

![XBookmarkList](https://everettjf.github.io/images/extern/xbookmarkdev3.png)

## Publish to Alcatraz
Pretty simple, modify the configuration file and create a Pull Request.
See README at <https://github.com/supermarin/alcatraz-packages>.

# Conclusion
Currently only basic functionality is completed, there are still several areas that need optimization and improvement.

- Locate code line. (Code from XToDo, but in some cases positioning is slow. Need to find the cause and fix it)
- Bookmark indicator. Display bookmark symbol in front of code line, like a checkmark.
- Comment functionality. (Add bookmark comment feature)
- Mnemonic bookmarks. (Imitate IntelliJ series)

---

# Update October 31, 2015
Thanks to a netizen who provided the JumpMarks plugin (if I had known about this plugin, I might not have developed XBookmark), this plugin implements quick code line positioning and adding markers in front of code lines. But it doesn't provide a bookmark list (fortunately XBookmark has some differences).

After learning from JumpMarks' code, XBookmark recently released two versions (0.2 and 0.3), thanks to JumpMarks author.
- Version 0.2, implemented quick code line positioning.
- Version 0.3, added shortcut key customization and indicators in front of code lines.

The process of developing XBookmark was very enjoyable, first time merging a Pull Request (thanks to <https://github.com/langyapojun> for solving the Xcode 7 support issue), never developed public tools before (head-down development, 5 years passed in a blink), this year trying to change, contributing some code to open source.

Regarding the Xcode 7 support issue, I'm quite puzzled. I've been developing with Xcode 7 all along (upgraded from Xcode 6 to Xcode 7), why can it work normally without that id? I need to research this...


---

# Update January 24, 2017

Now supports Xcode 8. Imitates XVim's installation method (resign Xcode, then make).



