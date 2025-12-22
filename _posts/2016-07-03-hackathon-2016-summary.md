---
layout: post
title: Segmentfault Hackathon 2016
categories:
  - Essay
tags:
  - essay
  - reflection
  - experience
  - career

comments: true
---



# Background

Last weekend two days with friend (two person team) participated in segmentfault and angelhack's hackathon, Beijing station. Theme was "Renaissance".

Saturday after simple opening, and simple API presentation (too simple). Officially started brainstorming at 2pm. Provided SDKs: agoria's video call SDK and wacom's WILL SDK.

Based on this we had an idea:

- Video drawing teaching. agoria provides video functionality, wacom provides drawing tablet functionality. Since both SDKs have demos, should be able to assemble quickly.
- Anonymous video. Randomly connect with another party who opens the App.
- Anonymous interest video. Select interests built into App, can video with all users entering this interest.

However, we always felt these ideas "lack creativity". Video SDK claims 30 minute integration, WILL SDK should also be easy to use. Wouldn't everyone do this video functionality? Simple video calls might not be creative?

<!-- more -->

# Old Idea

However, at this point an "old idea" came again. Recently after watching "Brain" also started learning Rubik's cube. Thought making a Rubik's cube restoration assistant App would be more creative.

Had this App idea before this hackathon, also did some research, of course focus was using AR to assist Rubik's cube restoration. AR naturally thought of Vuforia, but Vuforia can only recognize markers, for Rubik's cube where each face's color composition changes, and need to recognize colors, Vuforia can't do it (or I didn't find a way). So OpenCV appeared. Found this <https://github.com/AndroidSteve/Rubik-Cube-Wizard> , this App mainly used on Google Glass, and author has no plan to port to phone<https://github.com/AndroidSteve/Rubik-Cube-Wizard/tree/master/Rubik%20Solver/docs>

Thought I could do it. But found heavy OpenCV usage. Later invested more time learning OpenCV. Translating Rubik-Cube-Wizard's Java code...

Of course not finished yet, hackathon came.

# Started

Thought this was more unique, almost impossible anyone would do it. (At the time felt this was more distinctive, but later found it wasn't)

Using OpenCV to recognize Rubik's cube, thought these two days would be hard to achieve. So gave up.

So, used UIView with transform to simulate a 3D Rubik's cube. (That day also researched openGL and metal, not familiar with either, so used UIView combination).

Most important is Rubik's cube each face information input, thought of three quick input methods:

- Buttons
- Voice
- Photo
- Video
- AR

---

- Buttons as shown:
![](https://everettjf.github.io/stuff/rubiks/app.jpg)

- Voice, can use iFlytek recognition.
- Photo, that is take photo of each face. Recognize fixed position colors.
- Video, similar to this <https://github.com/bluquar/cubr>
- AR, that is Rubik-Cube-Wizard.


# Restoration Algorithm

<https://github.com/muodov/kociemba>

Finally, made it using buttons and voice methods. Code here.<https://github.com/xfteam/xfrubiks>



---

# Summary

- Finally stayed up all night made this App, but only used buttons and voice, and demo stage coordination wasn't good, causing poor effect.
- Event sponsors provided SDKs, of course best to use them. Using naturally adds points. (Of course this event's purpose can't be purely for winning, doing what you want is most important)
- Demo stage, I still need practice. Found although nearly 30, still get nervous in some small occasions. Expression not natural enough. And demo stage should try to rehearse simply. Coordination with friend wasn't smooth. Originally designed small jokes, due to expression and coordination issues, became useless.
- This year's event venue was at an incubator office space near Bird's Nest, environment very good, many sofas.
- These ideas not implemented, video drawing teaching, etc., if made would actually be quite good. Gave up too hastily.
- Think we have the technology, but there are more other factors. Problem-solving approach, idea's commercial value. Pure toys don't have much meaning. Etc.
- Competition was tiring, but still enjoyed the process. (Especially made this Rubik's cube restoration assistant App. Although some details need attention when using. Ha)








