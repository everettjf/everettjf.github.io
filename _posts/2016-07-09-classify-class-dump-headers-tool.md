---
layout: post
title: 头文件分类工具supotato 
categories: Essay
comments: true
---



class-dump 出的头文件这么多，supotato 可以根据头文件的`前2个字符`形成个简单的分类报告。同时可以猜测出使用了哪些第三方库（CocoaPods）。

[源码](https://github.com/everettjf/supotato)

<!-- more -->


## 使用方法

```sh
pip install supotato

cd <header files directory>

supotato
```



## 例子

例如 class-dump 出以下的头文件：

[Here](https://github.com/everettjf/supotato/tree/master/example/headers)

运行supotato：

```sh
$ supotato -i headers -o .
```

得到这个简单的分类：

[Here](https://github.com/everettjf/supotato/blob/master/example/result.txt)


下面是真实的例子：

[Here](https://github.com/everettjf/supotato/blob/master/example/lots.txt).


## 参数

```
[everettjf@e supotato (master)]$ supotato --help
usage: supotato [-h] [-i INPUT] [-o OUTPUT] [-s SORTBY] [-d ORDER]
                [-p PREFIXLENGTH] [-u UPDATEDB]

Generate a simple report for header files in your directory

optional arguments:
  -h, --help            show this help message and exit
  -i INPUT, --input INPUT
                        directory that header(.h) files in.
  -o OUTPUT, --output OUTPUT
                        file (or directory) path to put txt report in.
  -s SORTBY, --sortby SORTBY
                        prefix or count . Means sort by prefix or count.
  -d ORDER, --order ORDER
                        desc or asc.
  -p PREFIXLENGTH, --prefixlength PREFIXLENGTH
                        prefix length for classify , default to 2.
  -u UPDATEDB, --updatedb UPDATEDB
                        force update cocoapods database.

```

1. -i 指定头文件所在的目录。
2. -o 指定 result.txt 文件输出的目录，也可以是文件路径。
3. -s 指定分类的排序依据。prefix 根据文件名前N个字符（N可指定，默认为2）排序，count 根据每个分类的文件数目排序。
4. -d 排序类型。desc 倒序，asc 顺序。
5. -p 分类依据前几个字符。默认2 。
6. -u 更新本地数据库（用于判断文件属于哪个第三方库）


## 原理


1. 根据 https://github.com/CocoaPods/Specs 可或许所有repo，全部下载后，根据 spec.json文件，获取库中的头文件(.h)文件。
2. 记录头文件与Pod名称的关系到本地数据库中。
3. 逐个比较。

相关代码 https://github.com/everettjf/supotato/tree/master/podtool


## 总结


1. 简单的小工具，可以加快对class-dump头文件的整体了解。
2. 或许还能做：
	- 解析.h文件，构造类图。
	- 对.h文件进一步分类。（根据父类，或最后的几个字符）

	
	


