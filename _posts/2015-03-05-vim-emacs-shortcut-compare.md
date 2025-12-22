---
layout: post
title: "vim emacs Common Shortcut Comparison"
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



I'm used to vim shortcuts and also learning emacs.
I use spf13 for vim and prelude for emacs, experiencing both "masters." (After writing more, this article isn't directly related to these two, but I'm writing it as notes)

I often use vim's dd or yy then p, and feel emacs is more cumbersome (C-a C-k C-y)
Mainly because I use emacs very little.

If you're used to vim, you can enable evil-mode in emacs.
emacs's M-x is very powerful.
<!-- more -->

A simple comparison of common shortcuts as notes.

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
|      | o              |                  | Add line below cursor and start editing                  |
|      | O              |                  | Add line above cursor and start editing                  |
|      | ^              | C-a              | Move cursor to first character of current line           |
|      | $              | C-e              | End of line                                               |
|      | 0              |                  | Beginning of line                                         |
|      | :o             | C-x C-f          | Open file                                                 |
|      | :w             | C-x C-s          | Save file                                                 |
|      | :wq            |                  | Save and quit                                             |
|      | a              | ---              | Start editing after cursor                                |
|      | A              |                  | Start editing at end of line                              |
|      | I              |                  | Start editing at beginning of line                        |
|      | C-v            |                  | Vertical selection view                                   |
|      | C-V            |                  | Vertical line selection view                              |
|      | p              |                  | Paste                                                     |
|      | y              |                  | Copy                                                      |
|      | dd             |                  | Delete current line                                       |
|      | dw             |                  | Delete current word                                       |
|      | 2dd            |                  | Delete two lines                                          |
|      | u              |                  | Undo                                                      |
|      | C-r            |                  | Redo                                                      |
|      | d$             |                  | Delete from cursor to end of line                        |
|      | r              |                  | Replace current character                                 |
|      | cw             |                  | Delete word starting at cursor and start editing         |
|      | c$             |                  | Delete to end of line and start editing                  |
|      | G              | M->              | Last line                                                |
|      | gg             | M-<              | First line                                               |
| *    | ''             |                  | Return to previous line                                   |
|      | :400           |                  | Go to line 400                                           |
|      | 400G           |                  | Go to line 400                                           |
|      | %              |                  | Go to matching bracket                                    |
|      | :s/old/new/g   | M-x repl s ...   | Text replace                                              |
|      | :%s/old/new/g  | M-x repl s ...   | Text replace                                              |
|      | :%s/old/new/gc | M-x repl s ...   | Text replace                                              |
| *    |                | C-v              | Next screen                                               |
| *    |                | M-v              | Previous screen                                           |
| *    |                | C-l              | Center current line on screen                            |
| *    |                | M-a              | Beginning of sentence                                     |
| *    |                | M-e              | End of sentence                                           |
|      |                | C-u number command | Repeat command N times (or input)                      |
|      |                | C-g              | Cancel current command input                              |
| *    |                | Esc              | Alternative to pressing M key                            |
|      |                | C-d              | Delete character after cursor                            |
|      | db             | M-<DEL>          | Remove word before cursor                                 |
|      | dw             | M-d              | Remove word after cursor                                  |
|      | d$             | C-k              | Remove from cursor to end of line                        |
|      | dG             | M-k              | Remove from cursor to end of sentence                    |
|      |                | C-@ then C-w     | Remove selected text (C-<SPACE>)                         |
|      |                | C-y              | Recall most recent "removed" content (e.g., C-k C-k C-y) |
|      |                | M-y              | Continuously recall previous "removed" content          |
|      |                | C-/              | Undo effect of last command (same as C-x u or C-_)       |
|      |                | C-x s            | Save multiple buffers                                     |
|      |                | C-x C-b          | Buffer list                                              |
|      |                | C-x b buffer name | Switch to buffer                                         |
|      |                | C-z              | Temporarily leave emacs (type fg or %emacs in shell to return) |
|      |                | C-x C-c          | Exit directly                                             |
|      |                | C-s              | Forward search (C-g returns cursor to start, <Return> positions cursor on result) |
|      |                | C-r              | Backward search                                           |
|      |                | C-x 1            | Keep current window                                       |
|      |                | C-x 2            | Split window vertically                                   |
|      |                | C-x 3            | Split window horizontally                                |
|      |                | C-x o            | Move cursor to other window (other)                      |
|      |                | C-M-v            | Scroll other window down                                  |
|      |                | C-M-<Shift>-v    | Scroll other window up                                    |
|      |                | C-h c command    | Show brief help for command                              |
|      |                | C-h k command    | Show detailed help for command                            |
|      |                | C-h i            | Manual                                                    |
| *    |                | C-h b            | Show all function bindings (describe bindings)           |
|      |                |                  |                                                           |

