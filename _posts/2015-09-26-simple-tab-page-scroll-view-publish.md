---
layout: post
title: TabPageScrollView Notes
categories: Skill
comments: true
---



# Background
Seeing so many good things on CocoaPods, as a beginner in iOS development, I wanted to familiarize myself with this process.
I thought about a simple Tab page I recently developed, tried to improve it, make it more general, and put it on CocoaPods.

# Final Result
Usage and code: <https://github.com/everettjf/Yolo/tree/master/EVTTabPageScrollView>

![demo](https://everettjf.github.io/images/extern/EVTTabPageScrollView.gif)
<!-- more -->


# Steps

1. Create template project
    Reference: <https://guides.cocoapods.org/making/using-pod-lib-create.html>
    ```
    pod lib create MyLibrary
    ```
2. Modify description, write library code
3. Test
    ```
    pod lib lint
    pod spec lint
    ```
4. Upload
    ```
    $ pod trunk register orta@cocoapods.org 'Orta Therox' --description='macbook air'
    $ pod trunk push EVTTabPageScrollView.podspec
    ```
    Reference: <https://guides.cocoapods.org/making/getting-setup-with-trunk>

# Other
This is still very simple, just as an example for me to try CocoaPods.
