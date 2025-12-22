---
layout: post
title: "Emacs Beginner Notes"
categories:
  - Skill
tags:
  - emacs
  - editor
  - tools
  - productivity
  - tutorial

comments: true
---



As a Windows programmer and a beginner with vim and markdown, I suddenly entered another "world" with OS X, Emacs, and org-mode, and encountered some pitfalls that I'm recording here.

## Installation
- macOS

~~~
    brew install emacs --with-cocoa
    brew linkapps emacs

    Then reopen iTerm2, type emacs to run emacs in the terminal.
    Emacs will also appear in Applications.
~~~
<!-- more -->

## Pitfalls

- On Windows 8.1, emacs 24.4 displays some Chinese characters as "squares".
    Add the following line to the .emacs file (or prelude's init.el file):

~~~
(set-fontset-font "fontset-default" 'gb18030 '("Microsoft YaHei" . "unicode-bmp"))
~~~

- When both .emacs file and init.el in .emacs.d folder exist, only the .emacs file takes effect.
~~~
When using prelude, you need to delete the .emacs file (How to make both effective?)
~~~

- On OS X 10.10.1 (English interface), using brew to install emacs in terminal, Chinese characters display as question marks.

~~~
Switch system to Chinese to fix. (How to fix without switching? Not interested in researching for now)
~~~

- Meta key issue in terminal or iterm on OS X

  - In terminal

~~~
Terminal -> Preferences -> Profiles -> Keyboard
At the bottom, select "Use Option key as Meta key"
~~~

  - In iterm

~~~
Preferences -> Profiles then select current profile -> Keys
At the bottom, select +Esc for both
Left option key acts as : +Esc
Right option key acts as : +Esc
~~~

- How to find the location of the .emacs file (especially on Windows)

~~~
    C-X C-F ~/
~~~

## Notes

- Prelude recommendation

  - GitHub: [https://github.com/bbatsov/prelude](https://github.com/bbatsov/prelude)
  - Haven't tried others, as a beginner, prelude gave me energy.
  - Installing prelude

~~~
git clone git://github.com/bbatsov/prelude.git path/to/local/repo
ln -s path/to/local/repo ~/.emacs.d
cd ~/.emacs.d
~~~

Copy prelude_modules.el from samples and start emacs.

- About evil and Chinese input method

  - Switching Chinese input method and vim's various mode switches is too awkward (this is also one reason I wanted to try emacs)
  - You can still enable evil when writing code

~~~
Enable or disable evil-mode
M-x evil-mode
~~~

- Swap capslock and ctrl on OS X

  - System Preferences -> Keyboard -> Keyboard -> Modifier Keys (bottom right)

- Key repeat speed

  - System Preferences -> Keyboard -> Keyboard -> Adjust key repeat (to fastest)

- Installing monokai theme
I really like the monokai theme

~~~
M-x package-install
monokai-theme

M-x customize-theme
Select monokai, then save settings, and you're done.
~~~
