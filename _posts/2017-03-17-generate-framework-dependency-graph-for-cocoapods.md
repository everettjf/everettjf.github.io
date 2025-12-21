---
layout: post
title: "Generate CocoaPods Dependency Graph"
categories:
  - Skill
tags:
  - tool
  - podspec
  - cocoapods
  - graphviz
comments: true
---



# Generate Framework Dependency Graph Based on podspec

Code:

<https://github.com/everettjf/Yolo/tree/master/PodspecDependencyGraph>

<!-- more -->

Steps:

1. sh prepare.sh or brew install graphviz

2. Uses some es6 syntax, may need latest node version (I'm on 7.8.0).

3. Usage

```
sh gen.sh <starting framework name> <podspec directory>
```

4. Example

```
sh gen.sh TomatoRead /Users/everettjf/specsdev
```

Open tred.dot.svg file in directory with chrome to see the entire tree.




