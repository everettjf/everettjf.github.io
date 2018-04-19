import glob
import os
import hashlib
import subprocess
import re

os.system("pwd")



def process(content):
    a = content
    a = re.sub(r'([^((<[])(http(s?)://[^ \r\n]+)',r'\1<\2>',a)
    return a


def test():
    #
    # " http://www.baidu.com"   ->   " <http://www.baidu.com>"
    # " https://www.baidu.com"   ->   " <https://www.baidu.com>"
    # except "(http://www.baidu.com"
    # except "<http://www.baidu.com"
    #
    #
    content = 'hello' \
              + 'hello  http://www.baidu.com world https://www.baidu.com haha http \n' \
              + 'hello  https://www.baidu.com world https://www.baidu.com haha http\n'\
              + 'hello https://www.baidu.com\n'\
              + 'hello https://www.baidu.com\r\n'\
              + 'hello [https://www.baidu.com](https://www.baidu.com)\r\n'\
              + 'should not change  httpwww.baidu.com world httpswww.baidu.com haha http\n'\
              + 'should not change  [hello](https://www.baidu.com) world (https://www.baidu.com) haha http\n'\
              + 'should not change  <https://www.baidu.com> world <https://www.baidu.com> haha http\n'\
              + 'change  https://www.baidu.com/iOS%20Hacking%20Guide.pdf world https://www.baidu.com/iOS%20Hacking%20Guide.pdf\r\n'


    print content
    print "------------------------"

    print process(content)



def main():
    for f in glob.glob("_posts/*.md"):
        print(f)

        d = open(f, 'r').read()
        print d

        print '--------------------'
        y = process(d)
        print y


        with open(f, 'w') as g:
            g.write(y)

    print("Done")

if __name__ == '__main__':
    main()
    # test()
