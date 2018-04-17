---
layout: post
title: TabPageScrollView开发笔记
categories: Skill
comments: true
---






# 背景
看到CocoaPods上这么多好东西，初入iOS开发，也想熟悉熟悉这个流程。
想到最近自己开发的一个简单的Tab页面，尝试完善一下，做的更通用一些，放到CocoaPods上。

# 最终
使用方法及代码见：https://github.com/everettjf/Yolo/tree/master/EVTTabPageScrollView

![demo](https://everettjf.github.io/images/extern/EVTTabPageScrollView.gif)
<!-- more -->


# 步骤

1. 创建模板工程
    参考链接：https://guides.cocoapods.org/making/using-pod-lib-create.html
    ```
    pod lib create MyLibrary
    ```
2. 修改描述、编写库的代码
3. 测试
    ```
    pod lib lint
    pod spec lint
    ```
4. 上传
    ```
    $ pod trunk register orta@cocoapods.org 'Orta Therox' --description='macbook air'
    $ pod trunk push EVTTabPageScrollView.podspec
    ```
    参考链接：https://guides.cocoapods.org/making/getting-setup-with-trunk

# 其他
这个还很简单，仅作为自己试用CocoaPods的例子。
