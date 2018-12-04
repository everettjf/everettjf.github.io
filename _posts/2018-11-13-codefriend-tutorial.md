---
layout: post
title: "Code Friend:使用JavaScript开发Xcode Extensions"
categories:
  - 工具
tags:
  - XcodeExtension
  - CodeFriend
comments: true
---


Code Friend 是一款Xcode Extension，提供了JavaScript的接口，用户可基于这个App简单快捷开发出Xcode插件工具。

官方地址：<https://qvcodefriend.github.io/>
Mac App Store 地址：<https://itunes.apple.com/cn/app/code-friend/id1441249580>

<!-- more -->

# 背景

从Xcode 8开始，苹果提供了XcodeKit用于开发Xcode Extensions。但因为各种bug和接口太简单，一直不受开发者的喜爱。直到现在Xcode 10，XcodeKit提供的功能仍然有限。

即便如此，仍然有很多爱好者，开发出各种各样的小功能，例如：Awesome native Xcode extensions
 <https://github.com/theswiftdev/awesome-xcode-extensions>

近期加入了新公司，对代码规范有了新的要求，于是想通过脚本来查找不符合规范的代码，最终想到了开发一个Xcode Extension来检查代码规范。开发中又觉得如果使用纯Native开发，每次如果要调整或增加规范，都要重新编译，甚至重新提交审核，太过麻烦。

于是就有了现在Code Friend的想法。通过JavaScriptCore把XcodeKit的提供的功能封装起来。功能逻辑使用JavaScript开发。

下面就正式开始介绍Code Friend。


# 基本信息

Code Friend 是一个macOS App，内置了Xcode Source Editor 这个Extension。可以在 Mac App Store搜索 `Code Friend` 安装。

![](/media/15421232259243.jpg)


# 使用方法


## 启用

由于系统对Extensions的权限控制，需要在 `System Preferences -> Extensions -> Xcode Source Editor -> Code Friend Extension` 中启用 Code Friend。

![](/media/15421233842897.jpg)
![](/media/15421233931819.jpg)


## 内置功能使用

Code Friend 启用后，使用Xcode 打开任意工程，打开菜单 Editor ，最下方就可看到 Code Friend。

![](/media/15421237614957.jpg)

例如选中 everettjf ，点击 Convert to ASCII text (style1)，即可看到everettjf所在行的下一行出现了对应的ASCII Text。

![](/media/15421238735777.jpg)

其他菜单类似啦。Sort lines 是可以对选中的多行排序。About就是打开官方网站。

至此，这些都是一个普通的Xcode Extension可以做的。

但是，这里每个菜单的功能都是使用JavaScript实现的，有意思咯。代码可以见 <https://github.com/qvcodefriend/qvcodefriend.github.io/tree/master/packages/builtin>


## DLC Pack 1 安装和使用

单纯实现一个菜单简单，就像给H5提供一些JSAPI一样，但如果实现一个小程序平台，就麻烦点了。这一点上，Code Friend 可以说是个很简单的小平台咯。

DLC Pack 1 是个功能扩展包（我随意起的名字，类似zelda的dlc哈）。

打开Code Friend 的macOS App。
![](/media/15421245151297.jpg)

![](/media/15421245028819.jpg)

点击左上角 `AddPack` ，再点击右上角的`Try DLC Pack1`，这时DLC Pack1的安装地址 (https://qvcodefriend.github.io/packages/dlc/) 就填入了。

![](/media/15421246133012.jpg)

点击`Add`，则会开始下载扩展包，顺利的话，会告知`All Succeed :)`。

![](/media/15421247253435.jpg)

点击`Close`。

此时可以看到主界面多出一个条目`Code Friend DLC Pack 1`，点击后，右侧可显示一些配置信息。目前为了简单，直接显示了这个扩展包的json配置文件。从中可以看到有哪几个菜单。

![](/media/15421248124141.jpg)

Code Friend 的桌面App可以关闭了。

Xcode 也需要彻底退出，重新打开。
![](/media/15421250191664.jpg)


再次打开一个工程，就能看到菜单中新增的DLC Pack1的菜单。

![](/media/15421251021711.jpg)


至此，使用方法就是这些啦。

# 市场

类似DLC Pack1这样的扩展包，任何人都可以开发（开发方法见下文），只需要告诉一个安装地址，就能安装到Code Friend中。

那么就有必要整理一个官方的扩展包市场，网址是：<https://qvcodefriend.github.io/marketplace/> 。目前只是个网址，使用其中的Url可以安装。

桌面App右上角点击即可访问。

![](/media/15421252843232.jpg)

目前只有`Code Friend DLC Pack 1`这一个扩展包哈。

# 开发新的功能

## 简单说

是时候开发自己的扩展包了。简单说有两个步骤：

1. 按照 <https://qvcodefriend.github.io/develop/> 这里的格式调用API开发。
2. 发布到一个Code Friend可访问的网站（例如GitHub Pages）。

下面就使用GitHub Pages快速创建一个扩展包。GitHub Pages介绍地址 <https://pages.github.com/>。

## 三个步骤

### 1）第一步，创建一个组织

点击下图菜单，或者直接访问 <https://github.com/organizations/new>

![](/media/15421258051352.jpg)

![](/media/15421258620115.jpg)

例如我这里叫`MyCodeFriendPackage`，你如果创建需要用个别的名字啦。

### 2）第二步，创建GitHub Pages

访问 <https://github.com/qvcodefriend/helloworld> 点击Fork，并选择刚才创建的组织。如下图（Emmmm...我的创建的组织有点多...）

![](/media/15421261491607.jpg)

Fork完成后，修改fork过来的仓库的名称为：mycodefriendpackage.github.io 。（注意这里必须是组织名称的小写）

![](/media/15421267537385.jpg)

重命名完成后，继续在Settings页面下方，选择 `Choose a theme`。
![](/media/15421268178718.jpg)

![](/media/15421268398919.jpg)

随便一个都可以，点击 `Select theme`，此时就可以看到GitHub Pages栏目下提示 <https://mycodefriendpackage.github.io/> 可以访问了。

![](/media/15421269121160.jpg)



### 第三步，实现功能

此时就可以clone下仓库 <https://github.com/MyCodeFriendPackage/mycodefriendpackage.github.io>

```
git clone git@github.com:MyCodeFriendPackage/mycodefriendpackage.github.io.git
```

打开文件夹，可以看到helloworld文件夹

![](/media/15421276137672.jpg)

其中helloworld/manifest.json 格式如下：

![](/media/15421275002360.jpg)

- name 扩展包名称，显示在Code Friend桌面客户端列表中的名称
- version 版本
- author 作者
- website 官方网站
- description 功能描述
- menu 支持的菜单项

都很简单，一看就知道怎么修改。其中menu的id是文件夹（例如上图的menu id是hello对应一个hello文件夹）。

hello文件夹中必须有一个 entry.js，内部entry变量的数组，定义了当前菜单功能实现所需的所有JavaScript文件，Code Friend在加载时会按顺序执行。

```
var entry = [
    'main.js'
];
```

main.js 必须有一个onMenuClicked的function，返回值必须是一个包含result的字典。

```
var onMenuClicked = function(identifier){

    invocation.appendLines(['Hello World']);

    return {
        'result':true
    };
};

```

到了最重要的一步啦。调用API实现功能。

API提供了 `invocation` 和 `system` 两个全局变量，简单罗列如下。详细见文档 <https://qvcodefriend.github.io/develop/>

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

例如上面helloworld中的```invocation.appendLines(['Hello World']);``` 就是在当前文档的最后增加新的一行，内容是`Hello World`。


### 第四步，完成

上面完成后，helloworld扩展包的地址就是 <https://mycodefriendpackage.github.io/helloworld/>，在桌面客户端就可以添加啦。
![](/media/15421282993106.jpg)

菜单名称`Hello world`也出现了，点击后可以追加`Hello World`行啦。

![](/media/15421283452058.jpg)



# 参考扩展包源码

Code Friend 内置的 ASCII Text、Sort lines，以及 DLC Pack 1 都是使用JavaScript实现的。
代码地址如下：
<https://github.com/qvcodefriend/qvcodefriend.github.io/tree/master/packages>


# 未来

Code Friend 目前只是一个MVP版本，未来会随着使用不断完善。另外，目前XcodeKit提供的功能还很有限，只能操作当前文件的内容。相信苹果未来会开放更多功能，届时Code Friend的灵活性就能体现出来。

# 总结

从想法到实现，真是一个不容易的过程。

Code Friend 自发布到11月13号最高一次到了Mac App Store 的Developer Tools 类别的Top 12 Free。貌似这个榜的竞争不是那么激烈。

建了一个Code Friend Feedback群，如果使用中有问题，欢迎加入，欢迎随时交流想法。二维码就不放这里了哈，你肯定能找到啦 :)


欢迎关注订阅号《this很有趣》：
![](/images/fun.jpg)


