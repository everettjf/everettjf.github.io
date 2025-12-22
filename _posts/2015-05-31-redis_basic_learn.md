---
layout: post
title: "Redis Usage"
tags:
  - redis
  - database
  - cache
  - backend
  - tutorial

comments: true
---



Notes from "Redis Getting Started Guide."
*Note: Which type to use depends on the specific situation. The following is just one approach.*

# Data Types
1. string
  String type (simplest key-value)

~~~
  SET bar 1
  GET bar
~~~
<!-- more -->

2. hash
  Hash type (key-field1-value1-field2-value2...)

~~~
  HSET car price 500
  HSET car name BMW
  HGET car name
~~~

3. list
  List type (key-value1-value2...)

~~~
  Linked list implementation. Fast access to data near both ends, but slower access to middle elements as the list grows.
  More suitable for "news feed" or "logs" where middle elements are rarely accessed.

  LPUSH numbers 1 2 3
  RPUSH numbers 6 5 4
  LPOP numbers
  RPOP numbers
  LRANGE numbers 0 -1
~~~

4. set
  Set type (key-member1-member2...)

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
  Sorted set type (key-score1-member1-score2-member2...)

~~~
  ZADD scoreboard 89 Tom 68 Peter 100 David
  ZSCORE scoreboard Tom
  ZRANGE scoreboard 0 -1
  ZRANGE scoreboard 60 90 WITHSCORES
~~~

# Blog System Implementation
1. Blog name storage

~~~
  key = blog.name
  type = string
  e.g.
  SET blog.name
  GET blog.name
~~~

2. Post auto-increment ID

~~~
  key = posts:count
  type = string
  e.g.
  $postID = INCR posts:count
~~~

3. Post view count statistics

~~~
  key = post:$postID:page.view
  type = string
  e.g.
  $pageViewCount = INCR post:10:page.view
~~~

4. Post data (Method 1: Store data as JSON)

~~~
  key = post:$postID:data
  type = string
  e.g.
  $jsonData = jsonSerialize($title,$content,$author,$time)
  SET post:10:data $jsonData
  GET post:10:data $jsonData
~~~

5. Post data (Method 2: Hash)

~~~
  key = post:$postID
  type = hash
  e.g.
  HSET post:10 title hello
  HSET post:10 content helloworld
  HSET post:10 author everettjf
  HSET post:10 time Now()
~~~

6. Post slug

~~~
  key = slug.to.id
  type = hash
  e.g.
  $isSlugAvailable = HSETNX slug.to.id $newSlug 10
~~~

7. Store post IDs (Method 1: List)

~~~
  key = posts:list
  type = list
  e.g.
  Lists make pagination and post deletion convenient
  LPUSH posts:list 10
  $postsIDs = LRANGE posts:list,$start,$end
  for each $id in $postsIDs
    $post = HGETALL post:$id
    $title = $post.title
~~~

8. Store post IDs, sorted by time (Method 2: Sorted set)

~~~
  key = posts:createtime
  type = zset
  e.g.
  Sorted set stores post id and creation time (Unix time)
  ZREVRANGEBYSCORE can also get posts within a time range
~~~

9. Store comment list

~~~
  key = post:$postID:comments
  type = list
  e.g.
  $serializedComment = jsonSerialize($author,$email,$time,$content)
  LPUSH post:10:comments,$serializedComment
~~~

10. Store logs

~~~
  key = logs
  type = list
  e.g.
  LPUSH logs $serializedLog
~~~

11. Store tags

~~~
  All tags for a post are different, and there's no ordering requirement.
  key = post:$postID:tags
  type = set
  e.g.
  SADD post:10:tags cpp redis wechat php
  $tags = SMEMBERS post:10:tags
~~~

12. List all posts under one or more specified tags

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

13. Sort by view count

~~~
  key = posts:view
  type = zset
  e.g.
  ZINCRBY posts:page.view 1 $postID

  $postsIDs = ZREVRANGE posts:page.view $start $end
  for each $id in $postsIDs
    $postData = HGETALL post:$id
~~~
