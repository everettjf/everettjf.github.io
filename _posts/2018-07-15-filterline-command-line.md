---
layout: post
title: "filterline Command Line"
tags:
  - tools
  - product
  - iOS

comments: true
---

After developing VSCode Extension <https://github.com/everettjf/vscode-filter-line> , saved a lot of time I always need to look at logs to troubleshoot problems, also want to share for everyone to use. But everyone has their own habits and favorite editors. So, should I develop a SublimeText extension? Vim extension? Atom extension? Thought and thought, simply make it command line version.

<!-- more -->

# Code

https://github.com/everettjf/filterline


# Installation

```
npm install -g filterline
```

# Usage

```
filterline <filepath>
```

# Configuration File Search Order

For example execute this command

```
filterline /Users/everettjf/log/demo/log0eoml/foo.log
```

Will search configuration files in following order

```
  '/Users/everettjf/log/demo/log0eoml/filterline.eoml',
  '/Users/everettjf/log/demo/log0eoml/filterline.json',
  '/Users/everettjf/log/demo/log0eoml/.vscode/filterline.eoml',
  '/Users/everettjf/log/demo/log0eoml/.vscode/filterline.json',

  '/Users/everettjf/log/demo/filterline.eoml',
  '/Users/everettjf/log/demo/filterline.json',
  '/Users/everettjf/log/demo/.vscode/filterline.eoml',
  '/Users/everettjf/log/demo/.vscode/filterline.json',

  '/Users/everettjf/log/filterline.eoml',
  '/Users/everettjf/log/filterline.json',
  '/Users/everettjf/log/.vscode/filterline.eoml',
  '/Users/everettjf/log/.vscode/filterline.json' 
```

Configuration file format see <https://github.com/everettjf/vscode-filter-line>


# Done

Everyone can use it～




