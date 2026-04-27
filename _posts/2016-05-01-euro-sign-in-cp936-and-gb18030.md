---
layout: post
title:  € euro sign 在编码 cp936 和 gb18030 下的坑
categories: Skill
comments: true
---






产品第一次AppStore审核通过，过年时遇到一个“神奇”的bug，在显示某些特殊字符时App会崩溃。后来经过各种尝试找到原因。


## 第一层原因

一个函数返回的NSString为nil，使用者没有判断nil，导致崩溃。

## 第二层原因

- 部分业务数据库中的信息不是utf-8，而是PC客户端存入的cp936（数据库是SQL Server）
- 部分信息iOS拿到的是cp936编码的文字。
- 文字中包含欧元符号 € 。（<https://en.wikipedia.org/wiki/Euro）>
- iOS把cp936当做gb18030解码（主要是受gbk转utf-8影响，网上一把这类文章）
- cp936中如果有欧元符号，则会返回nil。
<!-- more -->

## 第三层原因

Windows的CP936并符合标准的GBK定义。

> Windows中CP936代码页使用0x80来表示欧元符号，而在GB18030编码中没有使用0x80编码位


> Code page 936 is not identical to GBK because a code page encodes characters while the GBK only defines code points. In addition, the Euro sign (€), encoded as 0x80 in CP936, is not defined in GBK.


> Windows CP936 code page 0x80 to represent the euro symbol in the GB18030 encoding 0x80 encoding, with other locations to represent the euro symbol. This can be understood to be a little problem on the GB18030 backward compatibility; also be understood as 0x80 CP936 expansion of GBK, GB18030 is only compatible and GBK.


search 0x80 in <https://en.wikipedia.org/wiki/Code_page_936>

<http://www.databasesql.info/article/8106207727/>


> Microsoft later added the euro sign to Codepage 936 and assigned the code 0x80 to it. This is not a valid code point in GBK 1.0.

<https://en.wikipedia.org/wiki/GBK>

<https://msdn.microsoft.com/zh-cn/goglobal/cc305153>

<https://msdn.microsoft.com/zh-cn/goglobal/bb688113.aspx>

## 解决办法

并没有找到一个靠谱的编码转换工具（iconv貌似可以，但据同事说比较麻烦、且坑较多，使用的话未知风险太多）

手动替换0x80。

关键代码如下：

``` c
@implementation NSString(EncodingUtil)

+(NSString *)stringFromGBK:(const char *)srcString{
    // fix Windows CP936 0x80 extension for standard GBK
    
    const int x80 = 0x80;
    const char * toBeConvert = srcString;
    
    size_t x80count = 0;
    const size_t length = strlen(srcString);
    for(size_t idx = 0; idx < length; ++idx){
        int code = (int)(unsigned char)srcString[idx];
        if(code == x80){
            ++x80count;
        }
    }
    
    char *newString = NULL;
    if(x80count > 0){
        size_t newLength = length + x80count * sizeof(char);
        newString = (char*)malloc(newLength + 1);
        memset(newString,0,newLength + 1);
        
        BOOL ignoreNext = NO;
        size_t newPos = 0;
        for(size_t idx = 0; idx < length; ++idx){
            int code = (int)(unsigned char)srcString[idx];
            if(ignoreNext){
                ignoreNext = NO;
                newString[newPos++] = srcString[idx];
                continue;
            }
            
            if(code > x80)
                ignoreNext = YES;
            
            if(code == x80){
                newString[newPos++] = 0xa2;
                newString[newPos++] = 0xe3;
            }else{
                newString[newPos++] = srcString[idx];
            }
        }
        toBeConvert = newString;
    }
    
    NSStringEncoding enc = CFStringConvertEncodingToNSStringEncoding(kCFStringEncodingGB_18030_2000);
    NSString *retString = [[NSString alloc]initWithCString:toBeConvert encoding:enc];
    
    if(newString){
        free(newString);
    }
    
    return retString;
}
@end

```


测试代码： 


``` c
char szBadName[101];
        memset(szBadName, 0, sizeof(szBadName));
        int pos = 0;
        szBadName[pos++] = '\xa8';
        szBadName[pos++] = 't';
        szBadName[pos++] = '\xa1';
        szBadName[pos++] = '\xfa';
        szBadName[pos++] = '\x8c';
        szBadName[pos++] = '\xa9';
        szBadName[pos++] = '\x92';
        szBadName[pos++] = '\xf6';
        szBadName[pos++] = '\xa2';
        szBadName[pos++] = '\xd9';
        szBadName[pos++] = '\x8b';
        szBadName[pos++] = '^';
        szBadName[pos++] = '\xc6';
        szBadName[pos++] = 'S';
        szBadName[pos++] = '\xbe';
        szBadName[pos++] = '\x80';
        szBadName[pos++] = '\xa8';
        szBadName[pos++] = '\xcb';
        
        szBadName[pos++] = '\x80';
        szBadName[pos++] = '\x80';
        szBadName[pos++] = '\xbe';
        szBadName[pos++] = '\x80';
        
        
        szBadName[pos++] = '7';
        szBadName[pos++] = '\xa8';
        szBadName[pos++] = '\x80';
        szBadName[pos++] = '\xa8';
        szBadName[pos++] = '\x80';
        szBadName[pos++] = '\xa8';
        szBadName[pos++] = '\x80';
        szBadName[pos++] = '6';
        szBadName[pos++] = '1';
        
        NSLog(@"bad = %@",[NSString stringFromGBK:szBadName]);

```



# 总结

这个问题不是普遍问题，应该99.99%的App不会遇到。可是我遇到了……

That's all.



