import glob
import os
import hashlib
import subprocess

os.system("pwd")

# date: 2017-12-20T00:07:54+08:00

for f in glob.glob("_posts/*.md"):
    print(f)

    # filename = f.split('/')[1]
    # dateparts = filename.split('-')
    # if len(dateparts) < 4:
    #     continue
    # datestr = dateparts[0] + "-" + dateparts[1] + "-" + dateparts[2]+"T00:00:01+08:00"
    # print(datestr)

    d = open(f, 'r').read()
    lines = d.split('\n')

    # print lines[0]
    # print "layout: post"
    # print "\n".join(lines[1:])

    if lines[1].startswith('layout'):
        continue

    with open(f, 'w') as g:
        g.write("---\n")
        g.write("layout: post\n")
        g.write("\n".join(lines[1:]))


print("Done")
    
