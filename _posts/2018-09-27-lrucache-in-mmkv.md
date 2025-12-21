---
layout: post
title: "Simple LRU Cache (LRUCache) in MMKV"
categories:
  - Performance Optimization
tags:
  - Basics
comments: true
---

LRU (Least recently used) is a cache update strategy, that is when cache count reaches maximum capacity, or some condition, remove least recently used elements. WeChat recently open-sourced a client Key-Value storage library MMKV <https://github.com/Tencent/MMKV> , which implements such a very streamlined LRU cache (LRUCache class).

<!-- more -->

# LRUCache Implementation Principle Introduction

1. Use linked list to record all elements (key and value).
2. Use hash table to record key and linked list position, for quickly determining if element already contains.
3. Add new element, add at linked list head.
4. Access an element, then move to linked list head.
5. If count exceeds maximum capacity, then delete linked list end.

Below is code and comments.

# MMKV's Implementation

Code posted here, believe reading once is easy to understand

```
// Linked list
#import <list>
// Unordered map
#import <unordered_map>

// key and value types
template <typename Key_t, typename Value_t>
class LRUCache {
    // Maximum element count
    size_t m_capacity;
    // Linked list stores pairs
    std::list<std::pair<Key_t, Value_t>> m_list;
    // Record key and iterator pointing to linked list (iterator, similar to pointer)
    std::unordered_map<Key_t, typename decltype(m_list)::iterator> m_map;

public:
    LRUCache(size_t capacity) : m_capacity(capacity) {}

    // Current occupied size
    size_t size() const { return m_map.size(); }

    // Maximum space
    size_t capacity() const { return m_capacity; }

    // Whether contains a key
    bool contains(const Key_t &key) const { return m_map.find(key) != m_map.end(); }

    // Clear
    void clear() {
        m_list.clear();
        m_map.clear();
    }

    // Add
    void insert(const Key_t &key, const Value_t &value) {
        // Whether key already added
        auto itr = m_map.find(key);
        if (itr != m_map.end()) {
            // Added
            // Then move this element to linked list start (iter->second move to begin)
            m_list.splice(m_list.begin(), m_list, itr->second);
            // Overwrite key's new value
            itr->second->second = value;
        } else {
            // Whether full
            if (m_map.size() == m_capacity) {
                // Full (exceeded set maximum space)
                // Remove linked list's last item
                // Follow last key remove map's item
                m_map.erase(m_list.back().first);
                // Remove linked list's last item
                m_list.pop_back();
            }
            
            // Not full
            // Add at linked list start
            m_list.push_front(std::make_pair(key, value));
            // Add to map
            m_map.insert(std::make_pair(key, m_list.begin()));
        }
    }

    // Get
    Value_t *get(const Key_t &key) {
        // Search
        auto itr = m_map.find(key);
        if (itr != m_map.end()) {
            // Found
            // Move found item to linked list start (iter->second stores iterator pointing to current item in linked list)
            m_list.splice(m_list.begin(), m_list, itr->second);
            return &itr->second->second;
        }
        return nullptr;
    }
    
    // Iterate each item
    void forEach(std::function<void(Key_t&,Value_t&)> callback){
        for(auto & item : m_list){
            callback(item.first,item.second);
        }
    }
};
```

# Add Print Method

Above added a helper method forEach to print all elements

```
    void forEach(std::function<void(Key_t&,Value_t&)> callback){
        for(auto & item : m_list){
            callback(item.first,item.second);
        }
    }
```

Pass in a lambda expression can print.


# Test Example


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

Output:

![](/media/15380654341081.jpg)




# Code

- LRUCache code with some comments <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/LRUCacheSample/LRUCacheSample/LRUCache.hpp> 
- MMKV's LRUCache implementation <https://github.com/Tencent/MMKV/blob/master/iOS/MMKV/MMKV/LRUCache.hpp>
- Test code here <https://github.com/everettjf/Yolo/tree/master/BukuzaoArchive/sample/LRUCacheSample/LRUCacheSample/main.mm>

# Other Cache Strategies

<https://en.wikipedia.org/wiki/Cache_replacement_policies>

# References

<https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)>

# LeetCode

LeetCode has a similar problem <https://leetcode.com/problems/lru-cache/description/> can practice.


Welcome to follow subscription account "Client Technology Review":
![happyhackingstudio](/images/fun.png)
