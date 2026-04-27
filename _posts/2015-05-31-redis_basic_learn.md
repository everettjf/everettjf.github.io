---
layout: post
title: "redis使用方式总结"
categories: Skill
comments: true
---






《redis入门指南》笔记。
*注意：使用何种类型取决于具体情境，以下仅是某一种方式。*

# 数据类型
1. string
  字符串类型（就是最简单的key-value）

~~~
  SET bar 1
  GET bar
~~~
<!-- more -->

2. hash
  散列类型(key-field1-value1-field2-value2...)

~~~
  HSET car price 500
  HSET car name BMW
  HGET car name
~~~

3. list
  列表类型(key-value1-value2...)

~~~
  链表实现，靠近两端数据获取速度快，而元素增多后，访问中间数据速度较慢。
  更适合“新鲜事”、“日志”这种访问中间元素较少的情况。

  LPUSH numbers 1 2 3
  RPUSH numbers 6 5 4
  LPOP numbers
  RPOP numbers
  LRANGE numbers 0 -1
~~~

4. set
  集合类型(key-member1-member2...)

~~~
  SADD letters a b c
  SREM letters c d
  SMEMBERS letters
  SISMEMBER letters a
  SDIFF lettersA lettersB
  SINTER lettersA lettersB
  SUNION lettersA lettersB
~~~

5. zset
  有序集合类型(key-score1-member1-score2-memeber2...)

~~~
  ZADD scoreboard 89 Tom 68 Peter 100 David
  ZSCORE scoreboard Tom
  ZRANGE scoreboard 0 -1
  ZRANGE scoreboard 60 90 WITHSCORES
~~~

# 博客系统实现
1. 博客名称存储

~~~
  key = blog.name
  type = string
  e.g.
  SET blog.name
  GET blog.name
~~~

2. 文章自增ID

~~~
  key = posts:count
  type = string
  e.g.
  $postID = INCR posts:count
~~~

3. 文章访问量统计

~~~
  key = post:$postID:page.view
  type = string
  e.g.
  $pageViewCount = INCR post:10:page.view
~~~

4. 文章数据（方式一:数据存储为json）

~~~
  key = post:$postID:data
  type = string
  e.g.
  $jsonData = jsonSerialize($title,$content,$author,$time)
  SET post:10:data $jsonData
  GET post:10:data $jsonData
~~~

5. 文章数据（方式二：哈希）

~~~
  key = post:$postID
  type = hash
  e.g.
  HSET post:10 title hello
  HSET post:10 content helloworld
  HSET post:10 author everettjf
  HSET post:10 time Now()
~~~

6. 文章缩略名

~~~
  key = slug.to.id
  type = hash
  e.g.
  $isSlugAvaliable = HSETNX slug.to.id $newSlug 10
~~~

7. 存储文章ID（方式一：列表）

~~~
  key = posts:list
  type = list
  e.g.
  列表可方便分页及删除文章
  LPUSH posts:list 10
  $postsIDs = LRANGE posts:list,$start,$end
  for each $id in $postsIDs
    $post = HGETALL post:$id
    $title = $post.title
~~~

8. 存储文章ID，按时间排序（方式二：有序集合）

~~~
  key = posts:createtime
  type = zset
  e.g.
  有序集合存储文章id与创建时间（unix时间）
  ZREVRANGEBYSCORE 还可或许时间段内的文章
~~~

9. 存储评论列表

~~~
  key = post:$postID:comments
  type = list
  e.g.
  $serializedComment = jsonSerialize($author,$email,$time,$content)
  LPUSH post:10:comments,$serializedComment
~~~

10. 存储日志

~~~
  key = logs
  type = list
  e.g.
  LPUSH logs $serializedLog
~~~

11. 存储标签

~~~
  一个文章的所有标签都不同，且没有排列顺序要求。
  key = post:$postID:tags
  type = set
  e.g.
  SADD post:10:tags cpp redis wechat php
  $tags = SMEMBERS post:10:tags
~~~

12. 列出指定一个或多个标签下所有文章

~~~
  key = tag:$tagName:posts
  type = set
  e.g.
  post:1:tags -> java
  post:2:tags -> java , mysql
  tag:java:posts -> 1 , 2
  tag:mysql:posts -> 2

  $postsIDsBothWithTagJavaMysql = SINTER tag:java:posts tag:mysql:posts
~~~

13. 按照点击量排序

~~~
  key = posts:view
  type = zset
  e.g.
  ZINCRBY posts:page.view 1 $postID

  $postsIDs = ZREVRANGE posts:page.view $start $end
  for each $id in $postsIDs
    $postData = HGETALL post:$id
~~~

