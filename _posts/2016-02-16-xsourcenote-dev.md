---
layout: post
title: XSourceNote Xcode Source Code Notes Plugin
categories: Skill
comments: true
---

PS: This idea is not very meaningful, no longer developing and maintaining.




# Background

This year planned to learn more source code, promised source code learning. In January mainly learned SDWebImage and YYCache source code, read line by line, found many good things. Initially wanted to record while learning, share it, but always felt troublesome.

Last year made XBookmark, an Xcode bookmark plugin. Thought, could make a plugin for taking notes on source code. Features as follows:

1. Take notes on projects.
2. Take notes on files.
3. Take notes on one or more lines of a file.
4. Can export as markdown format.
<!-- more -->

Exporting as markdown format can directly put it in a blog as an article.
(Brainstorming, if everyone shares to a website, can discuss a specific line of code...)
(Step by step, too many ideas, good and bad. To learn source code, still need to make a plugin... good and bad)

Notes on learning SDWebImage and YYCache or other source code, will share together later...


*---Added below on March 21, 2016--*

# Source Code

[https://github.com/everettjf/XSourceNote](https://github.com/everettjf/XSourceNote)

# Effect

After a month of intermittent development and continuous use and modification, finally can release the first version.



Effect as follows:

![XSourceNote](https://everettjf.github.io/stuff/xsourcenote/project_whole.png)




# Installation

Search for "XSourceNote" in [Alcatraz](http://alcatraz.io) and install.



# Usage

## 0. Menu

`Xcode->Edit->XSourceNote`

Or press the corresponding shortcut keys. (Shortcut keys can be modified in Tools)

## 1. Configuration
For example:

 - Open the project file located at /Users/everettjf/GitHub/XSourceNote using Xcode.
 - Press shortcut Shift+F4 to open "Notes List Window", as shown below:

 ![XSourceNote](https://everettjf.github.io/stuff/xsourcenote/project_basic.png)

 - Root Path (Required): Select the local folder where the project file is located. (To convert full file paths to relative paths when adding notes. This can be optimized to automatically find .git directory for configuration)
 - Project Name : Project name
 - Official Site : Official website name
 - Repo : Code repository address
 - Revision : Current revision version (This is to uniquely represent the version of source code currently being studied)
 - Description : Brief introduction.

## 2. Project Notes

Just make overall notes


## 3. Summary

Summary will be placed at the end when exporting Markdown notes.

## 4. Tools

Can configure the prefix for Markdown note content. Many Markdown-based blog systems (such as Jekyll, Hexo) require some metadata configuration.

**Bottom left button** can export Markdown notes.

## 5. Code Line Notes

### 1) Add Notes
Press shortcut Command+F4 in the code editor to add notes. XSourceNote will automatically record **the line where the cursor is (single line note), or the lines of the currently selected area (multi-line note)**.
Can input notes in this window. (Auto-saves after closing). After adding, will add a green marker in the left sidebar of the corresponding line in the editor.

 ![XSourceNote](https://everettjf.github.io/stuff/xsourcenote/quick_note.png)


 ![XSourceNote](https://everettjf.github.io/stuff/xsourcenote/sidebar.png)



### 2) View Notes

Still the window opened with Shift+F4, notes for code lines will be appended to the list below.

 ![XSourceNote](https://everettjf.github.io/stuff/xsourcenote/line_note.png)

Top right is the file's relative path (if cannot find RootPath, will be full path). Below that is the code where the note is located.

Bottom can edit notes. (Notes save every 10s, or when clicking left list, or when closing window)



### 3) Export Notes

Click "Tool" in the left list, buttons in the bottom row on the right. Can export to selected file.

Format reference: [Format Reference](https://everettjf.github.io/2016/03/17/yycache-learn)


# Summary

Functionality is relatively simple, but basically meets my needs for taking notes when learning source code.

Some areas that can be optimized:

- Note sorting.
- Code area syntax highlighting.
- Markdown format preview in note area.
- Auto-find RootPath.

Will slowly optimize during future use.



