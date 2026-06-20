---
layout: post
title: "Inferring the Source Directory Layout of WeChat iOS from __FILE__ Logs"
title_zh: "从 __FILE__ 日志推测微信 iOS 客户端的源码目录组织"
lang_original: zh
categories: Skill
comments: true
---


The bigger a project gets, the more it needs a sensible organization of its file directory hierarchy.

While reverse engineering WeChat, I often saw calls to some "logging" methods, and they carried complete paths. For example:

<!-- more -->

```
/Users/ioscmechine/Desktop/hudson/workspace/release_appstore_6.3.29/WeApp/Core/LocalCache/WAPackageSweeperLogic.mm
```

Looks like this was caused by using the __FILE__ macro.

Use strings to dump all the strings of WeChat (after decryption) into a file:

```
$ strings WeChat > strings_wechat.txt
```

As shown in the figure:

![](/media/14798364851450.jpg){:width="1016" height="302"}

Write a little script to extract all strings starting with `/Users/`, then split them and assemble them into a tree.

Then you can see part of WeChat's file structure.

![](/media/14798366527896.jpg){:width="1500" height="826"}


[Script address](https://github.com/everettjf/Yolo/tree/master/ListWeChatDirTree)

[The generated WeChat file hierarchy](https://github.com/everettjf/Yolo/tree/master/ListWeChatDirTree/wechat_tree.txt)

<!--ZH-->

项目越大，就越需要合理的组织文件目录层次。

逆向微信的过程中，经常看到一些“输出日志”的方法调用，而且带有完整的路径。例如：

<!-- more -->

```
/Users/ioscmechine/Desktop/hudson/workspace/release_appstore_6.3.29/WeApp/Core/LocalCache/WAPackageSweeperLogic.mm
```

看来是用了__FILE__宏导致。

用strings把微信（砸壳后）的字符串都存储到一个文件中，

```
$ strings WeChat > strings_wechat.txt
```

也如图：

![](/media/14798364851450.jpg){:width="1016" height="302"}

写个小脚本把所有`/Users/`开头的字符串提出来，然后分隔，组装成一棵树。

就可以看到微信的一部分文件结构啦。

![](/media/14798366527896.jpg){:width="1500" height="826"}


[脚本地址](https://github.com/everettjf/Yolo/tree/master/ListWeChatDirTree)

[输出的微信文件层次](https://github.com/everettjf/Yolo/tree/master/ListWeChatDirTree/wechat_tree.txt)
