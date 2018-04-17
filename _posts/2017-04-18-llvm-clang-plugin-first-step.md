---
layout: post
title: LLVM Clang 插件开发第一步
categories: Skill
comments: true
---


This article almost copy part of [the official article](https://clang.llvm.org/docs/LibASTMatchersTutorial.html), but fix many `bugs` that may impede `newbees` on the way to develop a clang plugin.

Environment : macOS

# Step 0 : Obtain Clang

```
mkdir ~/clang-llvm && cd ~/clang-llvm
git clone http://llvm.org/git/llvm.git
cd llvm/tools
git clone http://llvm.org/git/clang.git
cd clang/tools
git clone http://llvm.org/git/clang-tools-extra.git extra
```

<!-- more -->

# Step 1 : Obtain ninja and build

```
cd ~/clang-llvm
git clone https://github.com/martine/ninja.git
cd ninja
git checkout release
./bootstrap.py
sudo cp ninja /usr/local/bin/
```

# Step 2 : Obtain cmake and build

Your default cmake may not contain `ninja support`, so build cmake ourself.

```
cd ~/clang-llvm
git clone https://gitlab.kitware.com/cmake/cmake.git
cd cmake
./bootstrap
make
sudo make install
```

# Step 3 : Build clang


```
cd ~/clang-llvm
mkdir build && cd build
cmake -G Ninja ../llvm -DLLVM_BUILD_TESTS=ON  # Enable tests; default is off.
ninja
sudo ninja install
```

Of course , you should run the unittests before `ninja install`, but normally I run the unittest , always encounters some `not pass`. But just ignore these 'errors'.

```
ninja check       # Test LLVM only.
ninja clang-test  # Test Clang only.
```


# Step 4 : Clang tool

Just goto [Create a ClangTool](https://clang.llvm.org/docs/LibASTMatchersTutorial.html#step-1-create-a-clangtool)



# End

will continue...

# Ref

- [Introduction to the Clang AST](https://www.youtube.com/watch?v=VqCkCDFLSsc) (youtube video)
- https://clang.llvm.org/docs/LibASTMatchersTutorial.html
- https://clang.llvm.org/docs/ClangPlugins.html
- https://clang.llvm.org/docs/RAVFrontendAction.html
- http://clang.llvm.org/docs/ExternalClangExamples.html

All came from :
- https://clang.llvm.org/docs/index.html
- http://llvm.org/docs/index.html

# 吐槽

官方文档各种坑...

应该是我太菜...的原因...


