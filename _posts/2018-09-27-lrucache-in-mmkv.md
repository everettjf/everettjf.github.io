---
layout: post
title: "MMKV中的简单LRU缓存(LRUCache)"
categories:
  - 性能优化
tags:
  - 基础知识
comments: true
---

LRU（Least recently used）是一种缓存更新策略，即当缓存数目达到最大容量、或者某个条件时，移除掉最近最少使用的元素。微信前不久开源了一个客户端Key-Value存储库MMKV <https://github.com/Tencent/MMKV> ，其中实现了这样一个十分精简的LRU缓存（LRUCache类）。

<!-- more -->

# LRUCache实现原理介绍

1. 使用链表记录所有元素（key和value）。
2. 使用哈希表记录key和链表的位置，用于快速判断元素是否已经包含。
3. 加入新元素，在链表的头部添加。
4. 访问一个元素，则移动到链表的头部。
5. 若数量超过最大容量，则删除链表的结尾。

下面是代码及注释。

# MMKV的实现

代码就贴这里，相信看一遍就很容易明白

```
// 链表
#import <list>
// 无序map
#import <unordered_map>

// key和value类型
template <typename Key_t, typename Value_t>
class LRUCache {
    // 最大元素个数
    size_t m_capacity;
    // 链表存储pair
    std::list<std::pair<Key_t, Value_t>> m_list;
    // 记录key和指向链表的iterator（迭代器，类似指针）
    std::unordered_map<Key_t, typename decltype(m_list)::iterator> m_map;

public:
    LRUCache(size_t capacity) : m_capacity(capacity) {}

    // 当前占用的大小
    size_t size() const { return m_map.size(); }

    // 空间最大
    size_t capacity() const { return m_capacity; }

    // 是否包含某个key
    bool contains(const Key_t &key) const { return m_map.find(key) != m_map.end(); }

    // 清空
    void clear() {
        m_list.clear();
        m_map.clear();
    }

    // 添加
    void insert(const Key_t &key, const Value_t &value) {
        // 是否已经添加过key
        auto itr = m_map.find(key);
        if (itr != m_map.end()) {
            // 添加过
            // 则把这个元素移动到链表的最开始(iter->second移动到begin)
            m_list.splice(m_list.begin(), m_list, itr->second);
            // 覆盖key的新value
            itr->second->second = value;
        } else {
            // 是否满了
            if (m_map.size() == m_capacity) {
                // 满了（超过了设定的最大空间）
                // 移除掉链表的最后一项
                // 跟进最后一个key移除掉map中的项
                m_map.erase(m_list.back().first);
                // 移除掉链表的最后一项
                m_list.pop_back();
            }
            
            // 没有满
            // 链表最开始添加
            m_list.push_front(std::make_pair(key, value));
            // 加入map
            m_map.insert(std::make_pair(key, m_list.begin()));
        }
    }

    // 获取
    Value_t *get(const Key_t &key) {
        // 查找
        auto itr = m_map.find(key);
        if (itr != m_map.end()) {
            // 找到了
            // 移动找到的项目到链表最开始(iter->second存储了指向当前项目在链表中的迭代器)
            m_list.splice(m_list.begin(), m_list, itr->second);
            return &itr->second->second;
        }
        return nullptr;
    }
    
    // 遍历每一项
    void forEach(std::function<void(Key_t&,Value_t&)> callback){
        for(auto & item : m_list){
            callback(item.first,item.second);
        }
    }
};
```

# 增加打印方法

上面增加了一个打印所有元素的辅助方法forEach

```
    void forEach(std::function<void(Key_t&,Value_t&)> callback){
        for(auto & item : m_list){
            callback(item.first,item.second);
        }
    }
```

传入一个lambda表达式就可以打印了。


# 测试例子


```
        LRUCache<string, int> cache(5);
        cache.insert("a",1);
        cache.insert("b",2);
        cache.insert("c",3);
        cache.insert("d",4);
        cache.insert("e",5);
        
        cache.forEach([](string& key,int& value){
            NSLog(@"%s - %d",key.c_str(),value);
        });
        
        NSLog(@">> after insert 6");
        
        cache.insert("f",6);
        
        cache.forEach([](string& key,int& value){
            NSLog(@"%s - %d",key.c_str(),value);
        });
        
        NSLog(@">> after get d");
        
        cache.get("d");
        
        cache.forEach([](string& key,int& value){
            NSLog(@"%s - %d",key.c_str(),value);
        });
```

输出如下：

![](/media/15380654341081.jpg)




# 代码

- 加了点注释的LRUCache代码 <https://github.com/bukuzao/bukuzao/blob/master/sample/LRUCacheSample/LRUCacheSample/LRUCache.hpp> 
- MMKV中LRUCache的实现 <https://github.com/Tencent/MMKV/blob/master/iOS/MMKV/MMKV/LRUCache.hpp>
- 测试代码在这里 <https://github.com/bukuzao/bukuzao/blob/master/sample/LRUCacheSample/LRUCacheSample/main.mm>

# 其他缓存策略

<https://en.wikipedia.org/wiki/Cache_replacement_policies>

# 参考

<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>

# LeetCode

LeetCode 中就有个类似的题目 <https://leetcode.com/problems/lru-cache/description/> 可以练习一下。


欢迎关注订阅号《优化很有趣》：
![bukuzao](/images/fun.jpg)

