---
layout: post
title: "Emacs Beginner Notes and Pitfall Records"
title_zh: "Emacs 新手入门笔记与踩坑记录"
lang_original: zh
categories: Skill
comments: true
---





As a Windows programmer and a newbie to vim and markdown, I suddenly entered another "world", encountering osx, emacs, and org, and ran into some pitfalls. Recording them here.

## Installation
- MacOS

~~~
    brew install emacs --with-cocoa
    brew linkapps emacs

    然后重新打开iTerm2，输入emacs就可以在终端运行emacs了。
    也在Applications里有了emacs项。
~~~
<!-- more -->

## Pitfalls

- Under Windows 8.1, some Chinese characters in emacs 24.4 display as "blocks".
    Add the following line in the .emacs file (or in prelude's init.el file):

~~~
(set-fontset-font "fontset-default" 'gb18030 '("Microsoft YaHei" . "unicode-bmp"))
~~~

- When both the .emacs file and init.el in the .emacs.d folder exist, only the .emacs file takes effect.
~~~
当使用prelude时，需要删除.emacs文件(如何使两者都有效？)
~~~

- On osx 10.10.1 (English interface), installing emacs via brew in the terminal causes Chinese to display as question marks.

~~~
系统切换为中文，解决。（不切换如何解决，暂不想研究了）
~~~

- Under osx, the meta key issue in terminal or iterm

  - In terminal

~~~
终端->偏好设置->描述文件->键盘
最下方选择“使用Option键作为Meta键”
~~~

  - iterm

~~~
Preferences -> Profiles 然后选择当前的profile -> Keys
最下面都选择+Esc
Left option key acts as : +Esc
Rigth option key acts as : +Esc
~~~

- How to find where the .emacs file is stored (especially under Windows)

~~~
    C-X C-F ~/
~~~

## Notes

- prelude recommended

  - GitHub URL: [https://github.com/bbatsov/prelude](https://github.com/bbatsov/prelude)
  - I haven't tried others; as a beginner, prelude gave me energy.
  - Install prelude

~~~
git clone git://github.com/bbatsov/prelude.git path/to/local/repo
ln -s path/to/local/repo ~/.emacs.d
cd ~/.emacs.d
~~~

Copy prelude_modules.el out of samples, and start emacs.

- About evil and Chinese input methods

  - Switching between the Chinese input method and vim's own various mode switches is too awkward (this is also one of the reasons I wanted to try emacs)
  - If you're writing programs, you can still enable evil

~~~
启用或关闭evil-mode
M-x evil-mode
~~~

- Swapping capslock and ctrl under osx

  - System Preferences -> Keyboard -> Keyboard -> Modifier Keys (bottom-right corner)

- Key repeat speed

  - System Preferences -> Keyboard -> Keyboard -> Adjust key repeat (to the fastest)

- Install the monokai theme
I really like the monokai theme

~~~
M-x package-install
monokai-theme

M-x customize-theme
选择monokai后，save settings，就ok啦。
~~~

<!--ZH-->





作为一名windows程序猿、vim、markdown新手。忽然进入另一个“世界，遇到osx、emac、org，遇到了一些坑，记录下来。

## 安装
- MacOS

~~~
    brew install emacs --with-cocoa
    brew linkapps emacs

    然后重新打开iTerm2，输入emacs就可以在终端运行emacs了。
    也在Applications里有了emacs项。
~~~
<!-- more -->

## 坑

- windows8.1下emacs24.4部分中文显示为“方块”。
    在.emacs文件中（或者prelude的init.el文件中）加入下面一行：

~~~
(set-fontset-font "fontset-default" 'gb18030 '("Microsoft YaHei" . "unicode-bmp"))
~~~

- .emacs文件和.emacs.d文件夹中的init.el同时存在，只有.emacs文件生效。
~~~
当使用prelude时，需要删除.emacs文件(如何使两者都有效？)
~~~

- osx10.10.1（界面英文）terminal下使用brew安装emacs，中文显示问号。

~~~
系统切换为中文，解决。（不切换如何解决，暂不想研究了）
~~~

- osx下，terminal或iterm下meta按键问题

  - terminal下

~~~
终端->偏好设置->描述文件->键盘
最下方选择“使用Option键作为Meta键”
~~~

  - iterm

~~~
Preferences -> Profiles 然后选择当前的profile -> Keys
最下面都选择+Esc
Left option key acts as : +Esc
Rigth option key acts as : +Esc
~~~

- 如何找到.emacs文件的存放位置（尤其是windows下）

~~~
    C-X C-F ~/
~~~

## 笔记

- prelude推荐

  - Github地址：[https://github.com/bbatsov/prelude](https://github.com/bbatsov/prelude)
  - 其他没有试过，作为新手，prelude给了我能量。
  - 安装prelude

~~~
git clone git://github.com/bbatsov/prelude.git path/to/local/repo
ln -s path/to/local/repo ~/.emacs.d
cd ~/.emacs.d
~~~

samples中复制出prelude_modules.el，并启动emacs。

- 关于evil与中文输入法

  - 中文输入法切换与vim本身的各种模式切换太别扭了（这也是想体验下emacs的原因之一吧）
  - 如果编写程序还是可以启用evil

~~~
启用或关闭evil-mode
M-x evil-mode
~~~

- osx下交换capslock与ctrl

  - 系统偏好设置->键盘->键盘->修饰键（右下角）

- 按键重复速度

  - 系统偏好设置->键盘->键盘->调整按键重复（到最快）

- 安装主题monokai
很喜欢monokai这个主题

~~~
M-x package-install
monokai-theme

M-x customize-theme
选择monokai后，save settings，就ok啦。
~~~
