---
layout: post
title: How WeChat Source Files Are Organized
categories: Skill
comments: true
---



Larger projects need reasonable file directory hierarchy organization.

During reverse engineering WeChat, often see some "output log" method calls, and with complete paths. For example:

<!-- more -->

```
/Users/ioscmechine/Desktop/hudson/workspace/release_appstore_6.3.29/WeApp/Core/LocalCache/WAPackageSweeperLogic.mm
```

Looks like used __FILE__ macro.

Use strings to store all WeChat (after decrypting) strings to a file,

```
$ strings WeChat > strings_wechat.txt
```

As shown:

![](/media/14798364851450.jpg)

Write a small script to extract all strings starting with `/Users/`, then split, assemble into a tree.

Can see part of WeChat's file structure.

![](/media/14798366527896.jpg)


[Script address](https://github.com/everettjf/Yolo/tree/master/ListWeChatDirTree)

[Output WeChat file hierarchy](https://github.com/everettjf/Yolo/tree/master/ListWeChatDirTree/wechat_tree.txt)
