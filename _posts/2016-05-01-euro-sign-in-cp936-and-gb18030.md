---
layout: post
title: € Euro Sign Pitfall in cp936 and gb18030 Encoding
categories: Skill
comments: true
---



Product's first AppStore review passed, encountered a "magical" bug during New Year, App would crash when displaying certain special characters. Later found the cause after various attempts.


## First Layer Cause

A function returned NSString as nil, user didn't check for nil, causing crash.

## Second Layer Cause

- Some business database information is not utf-8, but cp936 stored by PC client (database is SQL Server)
- Some information iOS gets is cp936 encoded text.
- Text contains euro symbol €. (<https://en.wikipedia.org/wiki/Euro)>
- iOS treats cp936 as gb18030 decoding (mainly influenced by gbk to utf-8 conversion, many such articles online)
- If cp936 has euro symbol, will return nil.
<!-- more -->

## Third Layer Cause

Windows CP936 doesn't conform to standard GBK definition.

> Windows CP936 code page uses 0x80 to represent euro symbol, while GB18030 encoding doesn't use 0x80 encoding position


> Code page 936 is not identical to GBK because a code page encodes characters while the GBK only defines code points. In addition, the Euro sign (€), encoded as 0x80 in CP936, is not defined in GBK.


> Windows CP936 code page 0x80 to represent the euro symbol in the GB18030 encoding 0x80 encoding, with other locations to represent the euro symbol. This can be understood to be a little problem on the GB18030 backward compatibility; also be understood as 0x80 CP936 expansion of GBK, GB18030 is only compatible and GBK.


search 0x80 in <https://en.wikipedia.org/wiki/Code_page_936>

<http://www.databasesql.info/article/8106207727/>


> Microsoft later added the euro sign to Codepage 936 and assigned the code 0x80 to it. This is not a valid code point in GBK 1.0.

<https://en.wikipedia.org/wiki/GBK>

<https://msdn.microsoft.com/zh-cn/goglobal/cc305153>

<https://msdn.microsoft.com/zh-cn/goglobal/bb688113.aspx>

## Solution

Didn't find a reliable encoding conversion tool (iconv seems possible, but colleague said it's troublesome and has many pitfalls, too many unknown risks if used)

Manually replace 0x80.

Key code:

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


Test code: 


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



# Summary

This problem is not common, 99.99% of Apps won't encounter it. But I did...

That's all.



