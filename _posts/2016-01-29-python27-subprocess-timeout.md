---
layout: post
title: Adding Timeout to subprocess Calling Perl Script in Python 2.7
categories: Skill
comments: true
---



# Background
At the end of last year (2015), I developed an automatic crash analysis tool with two functional modules.

1. Parsing module: A Python script that gets crash logs uploaded by clients, finds the corresponding version on Jenkins, downloads the corresponding app file and dSYM file, calls Apple's symbolicatecrash to symbolicate stack addresses in crash logs, finds crash symbols and stores them in a local database.
2. Display module: A web application developed with Flask that displays all crashes categorized by crash address symbols.

During actual operation, I found a problem that "I searched a lot of materials" but couldn't solve. symbolicatecrash (this is a Perl script) would "block" (Perl process CPU usage 99%) when symbolizing certain logs.

Couldn't find a direct solution for a while, had to adopt a "workaround" approach.
<!-- more -->

# Problem

Previously when running the symbolicatecrash command, I used `os.system(cmdline)`, which would block waiting for the `cmdline` command to finish.

So I looked for a `timeout` method (previously doing Windows development, a WaitForSingleObject could wait for a process handle), found the subprocess module, but discovered that subprocess's Popen method doesn't have a timeout parameter in Python 2.7. (Python 3.x has a timeout parameter).

Found an alternative solution, using threading:

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

Process timeout solved, but, symbolicatecrash is a Perl script. After running, popen returns the handle of the shell executor `sh`, not the `perl` process handle, so still can't force terminate the `perl` process.

At this point, found `exec`.

Through `exec`, the handle returned by popen can be replaced with the handle of the actual executing perl process.

> The exec system call replaces the original process with a new process, but the process PID remains unchanged. Therefore, it can be considered that the exec system call does not create a new process, just replaces the original process context content. The original process's code segment, data segment, stack segment are replaced by the new process.
Here, after using subprocess to call the Perl script, if not using exec to indirectly call, the handle owned by subprocess will be the handle of the shell script executor sh, not the perl handle.

Therefore can:

``` python
command = Command("exec symbolicatecrash ...")
command.run(timeout=15)
```

# References:

- <http://stackoverflow.com/questions/1191374/using-module-subprocess-with-timeout>
- <http://stackoverflow.com/questions/4789837/how-to-terminate-a-python-subprocess-launched-with-shell-true>
- <http://www.cnblogs.com/zhaoyl/archive/2012/07/07/2580749.html>


