---
layout: post
title: "A Comparison of Common Vim and Emacs Shortcuts"
title_zh: "Vim 与 Emacs 常用快捷键对比"
lang_original: zh
categories: Skill
comments: true
---



Having gotten used to vim shortcuts, I also took a look at emacs.
I use spf for vim and prelude for emacs — experienced both "masters". (After writing a lot, this article doesn't have a direct relationship with those two; it was written as notes.)

I personally often use vim's dd or yy and then p, and emacs's feels more troublesome (C-a C-k C-y).
Mainly I use emacs very little.

Having gotten used to vim, you can enable evil-mode in emacs.
emacs's M-x is very powerful.
<!-- more -->

Here's a simple summary comparing common shortcuts, as notes.

|------+----------------+------------------+-----------------------------------------------------------|
| star | vim            | emacs            | comment                                                   |
|------+----------------+------------------+-----------------------------------------------------------|
| *    | i              | ---              | Insert mode                                               |
| *    | :              | ---              | Command mode                                              |
| *    | ESC            | ---              | Normal mode                                               |
|      | h              | C-b              | Left                                                      |
|      | l              | C-f              | Right                                                     |
|      | j              | C-n              | Down                                                      |
|      | k              | C-p              | Up                                                        |
|      | :q             | C-x C-c          | Quit                                                      |
|      | :q!            | C-x c-c n        | Force quit                                                |
|      | x              | C-d              | Delete current character                                  |
|      | w              | M-f              | Next word                                                 |
|      | b              | M-b              | Previous word                                             |
|      | o              |                  | Add a line below the cursor and start editing             |
|      | O              |                  | Add a line above the cursor and start editing            |
|      | ^              | C-a              | Move cursor to the first character of the current line    |
|      | $              | C-e              | End of line                                               |
|      | 0              |                  | Beginning of line                                         |
|      | :o             | C-x C-f          | Open file                                                 |
|      | :w             | C-x C-s          | Save file                                                 |
|      | :wq            |                  | Save and quit                                             |
|      | a              | ---              | Start editing after the cursor                            |
|      | A              |                  | Start editing at the end of the line                      |
|      | I              |                  | Start editing at the beginning of the line               |
|      | C-v            |                  | Vertical visual selection                                 |
|      | C-V            |                  | Vertical line visual selection                            |
|      | p              |                  | Paste                                                     |
|      | y              |                  | Copy                                                      |
|      | dd             |                  | Delete current line                                       |
|      | dw             |                  | Delete current word                                       |
|      | 2dd            |                  | Delete two lines                                          |
|      | u              |                  | Undo                                                      |
|      | C-r            |                  | Redo                                                      |
|      | d$             |                  | Delete from cursor to end of file                         |
|      | r              |                  | Replace current character                                 |
|      | cw             |                  | Delete the word starting at cursor, and start editing     |
|      | c$             |                  | Delete to end of file, and start editing                  |
|      | G              | M->              | Last line                                                 |
|      | gg             | M-<              | First line                                                |
| *    | ''             |                  | Go back to the line you were just on                      |
|      | :400           |                  | Go to line 400                                            |
|      | 400G           |                  | Go to line 400                                            |
|      | %              |                  | Jump to the matching bracket                              |
|      | :s/old/new/g   | M-x repl s ...   | Text replacement                                          |
|      | :%s/old/new/g  | M-x repl s ...   | Text replacement                                          |
|      | :%s/old/new/gc | M-x repl s ...   | Text replacement                                          |
| *    |                | C-v              | Next screen                                               |
| *    |                | M-v              | Previous screen                                           |
| *    |                | C-l              | Center the cursor line on the screen                      |
| *    |                | M-a              | Beginning of sentence                                     |
| *    |                | M-e              | End of sentence                                           |
|      |                | C-u num command  | Repeat the command (or input) N times                    |
|      |                | C-g              | Abort the current command input                           |
| *    |                | Esc              | Assist in pressing the M key                              |
|      |                | C-d              | Delete the character after the cursor                     |
|      | db             | M-<DEL>          | Remove the word before the cursor                         |
|      | dw             | M-d              | Remove the word after the cursor                          |
|      | d$             | C-k              | Remove from cursor to end of line                         |
|      | dG             | M-k              | Remove from cursor to end of sentence                     |
|      |                | C-@ then C-w     | Remove selected text (C-<SPACE>)                          |
|      |                | C-y              | Recall the most recent "removed" content (e.g. C-k C-k C-y)|
|      |                | M-y              | Continuously recall the previous "removed" content        |
|      |                | C-/              | Undo the effect of the last command (same as C-x u or C-_)|
|      |                | C-x s            | Save multiple buffers                                     |
|      |                | C-x C-b          | Buffer list                                               |
|      |                | C-x b bufferName | Switch to a buffer                                        |
|      |                | C-z              | Temporarily leave emacs (type fg or %emacs in the shell to come back)|
|      |                | C-x C-c          | Quit directly                                             |
|      |                | C-s              | Search forward (C-g returns cursor to start position, <Return> places cursor on the result)|
|      |                | C-r              | Search backward                                           |
|      |                | C-x 1            | Keep only the current window                              |
|      |                | C-x 2            | Split window vertically                                   |
|      |                | C-x 3            | Split window horizontally                                 |
|      |                | C-x o            | Move cursor to another window (other)                     |
|      |                | C-M-v            | Scroll the other window down                              |
|      |                | C-M-<Shift>-v    | Scroll the other window up                                |
|      |                | C-h c command    | Show brief help for a command                             |
|      |                | C-h k command    | Show detailed help for a command                          |
|      |                | C-h i            | Manual                                                    |
| *    |                | C-h b            | Show all key bindings (describe bindings)                 |
|      |                |                  |                                                           |


<!--ZH-->



习惯了vim快捷键，又了解下emacs。
vim使用spf，emacs使用prelude，体验了两位“大神”。（写多了，这篇文章与这两个没有直接关系，写出了作为笔记）

个人经常使用vim的dd或者yy然后p，感觉emacs的就麻烦了（C-a C-k C-y）
主要是emacs用的很少。

习惯了vim，可以emacs启用evil-mode。
emacs的M-x很强大。
<!-- more -->

简单整理下常用快捷键的对比，作为笔记。

|------+----------------+------------------+-----------------------------------------------------------|
| star | vim            | emacs            | comment                                                   |
|------+----------------+------------------+-----------------------------------------------------------|
| *    | i              | ---              | 插入模式                                                  |
| *    | :              | ---              | 命令模式                                                  |
| *    | ESC            | ---              | 普通模式                                                  |
|      | h              | C-b              | 左                                                        |
|      | l              | C-f              | 右                                                        |
|      | j              | C-n              | 下                                                        |
|      | k              | C-p              | 上                                                        |
|      | :q             | C-x C-c          | 退出                                                      |
|      | :q!            | C-x c-c n        | 强制退出                                                  |
|      | x              | C-d              | 删除当前单词                                              |
|      | w              | M-f              | 右单词                                                    |
|      | b              | M-b              | 左单词                                                    |
|      | o              |                  | 在光标下一行添加，并开始编辑                              |
|      | O              |                  | 在光标上一行添加，并开始编辑                              |
|      | ^              | C-a              | 移动光标到当前行第一个字符首                              |
|      | $              | C-e              | 行尾                                                      |
|      | 0              |                  | 行首                                                      |
|      | :o             | C-x C-f          | 打开文件                                                  |
|      | :w             | C-x C-s          | 保存文件                                                  |
|      | :wq            |                  | 保存并退出                                                |
|      | a              | ---              | 在光标后开始编辑                                          |
|      | A              |                  | 在行最后开始编辑                                          |
|      | I              |                  | 在行首开始编辑                                            |
|      | C-v            |                  | 垂直选择视图                                              |
|      | C-V            |                  | 垂直选择行视图                                            |
|      | p              |                  | 粘贴                                                      |
|      | y              |                  | 复制                                                      |
|      | dd             |                  | 删除当前行                                                |
|      | dw             |                  | 删除当前单词                                              |
|      | 2dd            |                  | 删除两行                                                  |
|      | u              |                  | 撤销                                                      |
|      | C-r            |                  | 重复                                                      |
|      | d$             |                  | 删除光标到文件最后                                        |
|      | r              |                  | 替换当前字符                                              |
|      | cw             |                  | 删除光标开始的单词，并开始编辑                            |
|      | c$             |                  | 删除到文件最后，并开始编辑                                |
|      | G              | M->              | 最后一行                                                  |
|      | gg             | M-<              | 第一行                                                    |
| *    | ''             |                  | 回到刚才的行                                              |
|      | :400           |                  | 转到400行                                                 |
|      | 400G           |                  | 转到400行                                                 |
|      | %              |                  | 转到匹配的括号                                            |
|      | :s/old/new/g   | M-x repl s ...   | 文本替换                                                  |
|      | :%s/old/new/g  | M-x repl s ...   | 文本替换                                                  |
|      | :%s/old/new/gc | M-x repl s ...   | 文本替换                                                  |
| *    |                | C-v              | 下一屏幕                                                  |
| *    |                | M-v              | 上一屏幕                                                  |
| *    |                | C-l              | 光标行置于屏幕中央                                        |
| *    |                | M-a              | 句首                                                      |
| *    |                | M-e              | 句尾                                                      |
|      |                | C-u 数字 命令    | 重复N次命令（或输入）                                     |
|      |                | C-g              | 终止当前命令输入                                          |
| *    |                | Esc              | 辅助按下M键                                               |
|      |                | C-d              | 删除光标后字符                                            |
|      | db             | M-<DEL>          | 移除光标前单词                                            |
|      | dw             | M-d              | 移除光标后单词                                            |
|      | d$             | C-k              | 移除光标到行尾                                            |
|      | dG             | M-k              | 移除光标到句尾                                            |
|      |                | C-@ 之后 C-w     | 移除选定文字（C-<SPACE>）                                 |
|      |                | C-y              | 召回最近一次“移除”的内容（例如 C-k C-k C-y）              |
|      |                | M-y              | 不断召回上一次“移除”的内容                                |
|      |                | C-/              | 撤销上次命令的影响（与 C-x u 或 C-_ 相同）                |
|      |                | C-x s            | 保存多个缓冲区                                            |
|      |                | C-x C-b          | 缓冲区列表                                                |
|      |                | C-x b 缓冲区名称 | 切换到缓冲区                                              |
|      |                | C-z              | 暂时离开emacs（shell中输入fg或者%emacs再次回来）          |
|      |                | C-x C-c          | 直接退出                                                  |
|      |                | C-s              | 向前搜索（C-g光标回到开始位置，<Return>光标定位到结果上） |
|      |                | C-r              | 向后搜索                                                  |
|      |                | C-x 1            | 保留当前窗口                                              |
|      |                | C-x 2            | 垂直分割窗口                                              |
|      |                | C-x 3            | 水平分割窗口                                              |
|      |                | C-x o            | 移动光标到其他窗口（other）                               |
|      |                | C-M-v            | 向下滚动其他窗口                                          |
|      |                | C-M-<Shift>-v    | 向上滚动其他窗口                                          |
|      |                | C-h c 命令       | 显示命令的简易帮助                                        |
|      |                | C-h k 命令       | 显示命令的详细帮助                                        |
|      |                | C-h i            | 手册                                                      |
| *    |                | C-h b            | 显示所有函数绑定(describe bindings)                       |
|      |                |                  |                                                           |
