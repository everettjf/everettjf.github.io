---
layout: post
title: Python2.7下subprocess调用perl脚本增加timeout
categories: Skill
comments: true
---






# 背景
去年（2015年）年底开发了个自动分析崩溃的工具，分两个功能模块。

1. 解析模块：一个python脚本，获取客户端上传上来的崩溃日志，并在Jenkins上找到对应的版本，下载对应的app文件和dSYM文件，调用Apple提供的symbolicatecrash对崩溃日志中的堆栈地址符号化，找到崩溃的符号存储到本地数据库中。
2. 展示模块：flask开发的web应用，按照崩溃地址的符号分类展示所有崩溃。

在实际运行中发现一个“找了好多资料”都没解决的问题，symoblicatecrash（这是个perl脚本）在符号化某些日志的时候会“阻塞”（perl进程cpu占用99%）。

一时间找不到直接解决办法，只能采用“躲避”方案。
<!-- more -->

# 问题

之前在运行symbolicatecrash命令时，使用 `os.system(cmdline)` 的方式，此命令会一直阻塞等待 `cmdline` 命令结束。

于是找 `timeout` 方法，（以前做Windows开发，一个WaitForSingleObject 就可以等待进程句柄了）找到了subprocess模块，但发现subprocess的方法Popen 在Python2.7下没有 timeout 参数。（Python3.x下有timeout参数）。

搜到一个替代方案，配合threading，

``` python

import subprocess, threading

class Command(object):
    def __init__(self, cmd):
        self.cmd = cmd
        self.process = None

    def run(self, timeout):
        def target():
            print 'Thread started'
            self.process = subprocess.Popen(self.cmd, shell=True)
            self.process.communicate()
            print 'Thread finished'

        thread = threading.Thread(target=target)
        thread.start()

        thread.join(timeout)
        if thread.is_alive():
            print 'Terminating process'
            self.process.terminate()
            thread.join()
        print self.process.returncode

command = Command("echo 'Process started'; sleep 2; echo 'Process finished'")
command.run(timeout=3)
command.run(timeout=1)

```

进程超时解决了，但，symbolicatecrash是个perl脚本，运行后popen返回的是shell执行者 `sh` 的句柄，而不是 `perl` 进程的句柄，因此仍然无法强制结束 `perl` 进程。

这时，找到了 `exec` 。

通过 `exec` 可以将popen返回的句柄替换为真实执行的perl进程的句柄。

> 系统调用exec是以新的进程去代替原来的进程，但进程的PID保持不变。因此，可以这样认为，exec系统调用并没有创建新的进程，只是替换了原来进程上下文的内容。原进程的代码段，数据段，堆栈段被新的进程所代替。
这里使用subprocess调用起perl脚本后，如果不使用exec间接调用，则subprocess拥有的句柄会是shell脚本的执行者sh的句柄，而不是perl的句柄。

因此可以，

``` python
command = Command("exec symbolicatecrash ...")
command.run(timeout=15)
```

# 参考资料：

- <http://stackoverflow.com/questions/1191374/using-module-subprocess-with-timeout>
- <http://stackoverflow.com/questions/4789837/how-to-terminate-a-python-subprocess-launched-with-shell-true>
- <http://www.cnblogs.com/zhaoyl/archive/2012/07/07/2580749.html>



