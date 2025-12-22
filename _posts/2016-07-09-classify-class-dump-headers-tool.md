---
layout: post
title: Header File Classification Tool
tags:
  - tutorial
  - learning
  - guide
  - development
  - tools

comments: true
---



class-dump outputs so many header files, supotato can form a simple classification report based on header files' `first 2 characters`. Can also guess which third-party libraries (CocoaPods) are used.

[Source code](https://github.com/everettjf/supotato)

<!-- more -->


## Usage

```sh
pip install supotato

cd <header files directory>

supotato
```



## Example

For example class-dump outputs the following header files:

[Here](https://github.com/everettjf/supotato/tree/master/example/headers)

Run supotato:

```sh
$ supotato -i headers -o .
```

Get this simple classification:

[Here](https://github.com/everettjf/supotato/blob/master/example/result.txt)


Below is a real example:

[Here](https://github.com/everettjf/supotato/blob/master/example/lots.txt).


## Parameters

```
[everettjf@e supotato (master)]$ supotato --help
usage: supotato [-h] [-i INPUT] [-o OUTPUT] [-s SORTBY] [-d ORDER]
                [-p PREFIXLENGTH] [-u UPDATEDB]

Generate a simple report for header files in your directory

optional arguments:
  -h, --help            show this help message and exit
  -i INPUT, --input INPUT
                        directory that header(.h) files in.
  -o OUTPUT, --output OUTPUT
                        file (or directory) path to put txt report in.
  -s SORTBY, --sortby SORTBY
                        prefix or count . Means sort by prefix or count.
  -d ORDER, --order ORDER
                        desc or asc.
  -p PREFIXLENGTH, --prefixlength PREFIXLENGTH
                        prefix length for classify , default to 2.
  -u UPDATEDB, --updatedb UPDATEDB
                        force update cocoapods database.

```

1. -i specifies directory where header files are located.
2. -o specifies directory to output result.txt file, can also be file path.
3. -s specifies classification sort basis. prefix sorts by first N characters of filename (N can be specified, default 2), count sorts by number of files in each category.
4. -d sort type. desc descending, asc ascending.
5. -p classification basis first few characters. Default 2.
6. -u update local database (used to determine which third-party library file belongs to)


## Principle


1. Based on <https://github.com/CocoaPods/Specs> can get all repos, after all downloaded, based on spec.json files, get header files (.h) in libraries.
2. Record header file to Pod name relationship in local database.
3. Compare one by one.

Related code <https://github.com/everettjf/supotato/tree/master/podtool>


## Summary


1. Simple small tool, can speed up overall understanding of class-dump header files.
2. Could also do:
	- Parse .h files, construct class diagrams.
	- Further classify .h files. (Based on parent class, or last few characters)

	
	

