---
layout: post
title: SegmentFault Hackathon 2015 Beijing
categories:
  - Essay
tags:
  - essay
  - reflection
  - experience
  - career

comments: true
---



# Start
On October 24, 2015, I participated in the [SegmentFault Hackathon 2015 Beijing](http://segmentfault.com/e/1160000003736572) event.

First, a picture:
![hackathon](http://d.pr/i/1c2on+)

<!-- more -->

This was my second time participating in a hackathon event.

# Recalling the Past

The last time I participated was around 2013, when Microsoft Windows 8 had just come out. As a member of the Microsoft camp, although I was in Jinan (hadn't seen much of the world), I still traveled thousands of miles at my own expense to Beijing, just to experience Microsoft Research Asia firsthand, just to feel Beijing's development atmosphere.

A brief summary of a few things that impressed me from this previous Windows 8 development hackathon:
	
- There was a sixty-year-old programmer sitting at the same table, already retired, but also stayed up all night coding (though he went back to rest the next morning, didn't wait until the end of the competition, which was already impressive). I think my purpose of coming to Beijing was achieved, which was to feel this passion for programming.
- I used to be a language purist, obsessed with C++, looking down on other languages. So I was particularly fond of Microsoft's C++/CX, practiced hard, but rarely saw anyone using C++/CX at the development site. (Most were C#, a few JavaScript. Met a guy doing game development using C++/CX, exchanged QQ.)
- This Windows 8 hackathon allowed development in advance and didn't require submitting the App before the two-day event ended. The App I made didn't persist to submission (persistence issue, messing around issue). Deeply understood that App development from idea to implementation is not a simple process.

# This Competition

I learned about this competition a month in advance from my friend circle, and Jinan also had a venue. I thought since I came to Beijing, I'd participate in Beijing's. I mentioned it to friend M (also a colleague and former classmate), and friend M thought, if we're going to do it, let's do it for real. So, our team had 5 people.

We came to AngelCrunch on Zhongguancun Entrepreneurship Street. Several big shots explained the spirit of hackathons and the content of this event, then the competition began.

## Skills

- M, team leader, Android
- G, audio/video processing, NDK
- J, Android
- X, UI
- Me, Windows, iOS, Flask

The competition required submitting the work before 12 noon the next day. After discussion, we initially determined two points:

- Make a mobile product, only develop Android version (I could only do the server side)
- Must decide what to do before 1 PM. (The event explanation ended around 10 AM)

## What to Do
Mainly thought of the following Apps:

- Photo wall, tool, convenient for making photo walls
- Voice tasks, team voice tasks
- Multi-person travel AA payment, convenient for calculating who paid more, who paid less
- Social mini-game, two virtual characters, add various animation effects
- Children's mini-game (specific details forgotten)

After discussion, we decided on a travel App with the following features:

- Create travel groups.
- Use voice instead of typing.
- Each person can use voice to record expenses (User A spent 100 yuan). After the trip ends, calculate who should pay whom based on average spending.
- Create voice reminders (remind everyone to meet at 9 AM at a location)
- Create voice diary (each person one sentence, finally export and merge into one audio file)

## Division of Labor

- M, implement voice recording and recognition to text.
- G, implement multiple voice merging.
- J, implement various interfaces.
- X, several interface effects and image cutting.
- Me, server side (login, group management, voice message management, voice upload/download, voice merging calls, etc.)

## Getting Started

### Interface Layout Determined Together
We simply sketched the basic layout of several interfaces on draft paper, then each started working.

### Source Code Management
Multi-person collaboration requires source code management. Except for UI, the four of us used a repository at [http://git.oschina.net/](http://git.oschina.net/).

### Each Started Working
- M, found iFlytek voice recognition SDK, encountered various pitfalls, finally got it working.
- G, started with the most familiar ffmpeg development, wrote a so file, also got the Python calling example working.
- J, whipped up interfaces so fast.
- X, also quite skilled.
- Me, got started with Flask and MongoDB. (Same as developing mostlike.link)

## Lessons

- M and J encountered some problems setting up the environment, one Android Studio one Eclipse, compilation kept failing due to missing some submitted files.
- M found many pitfalls in iFlytek SDK, parameters not following the pattern, easily causing crashes.
- Server side, I had long heard of Celery but never really used it. This time I considered using it when merging voice files. But it kept showing an error message (haven't had time to research), gave up after spending a lot of time. (Worked from 3 AM to 6 AM, still didn't understand, so gave up) (For live demo, voice wasn't long, blocking merge was acceptable)


## Demo

The next morning around 9 AM, all features finally passed (voice reminder was abandoned due to time constraints). Slept a bit on the table.
Demo started in the afternoon.

A few memorable things:

- The first demo shocked the whole venue, virtual reality, real-time camera video that step-by-step teaches you how to replace a MacBook fan. The MacBook expansion effect was very cool.
- Many demos in between, many about social products. According to the judges' summary later, the judges weren't very interested in this type of product.
- Demo presentation also needs control. Some started by explaining a lot about their feelings, etc., nearly 2 minutes passed (principle is 3 minutes total per team), some even explained their background, their connection with programming, some had poor time control and were too verbose. Some didn't know how to engage the audience, etc. (Of course, just my feeling, I'm not very good at engaging the audience either).
- I felt our team's presentation time control was very good, the final voice synthesis effect was good, showed the main features just right, simply inserted some jokes to engage the audience.

## Unexpected Award

First place went to the work that used virtual reality to repair computers (later learned it used Qualcomm's Vuforia SDK with Unity3D).

Second place, voice control computer, assisting disabled people to operate computers. Very caring, very practical. (Voice recognition, plus various Windows window message sending)

Several judges took turns explaining works that impressed them, none mentioned us. But when the final scores came out, third place! Everyone was very happy (Classmate X went home to sleep, didn't wait for the final awards).

# Summary

Let me research this [http://developer.vuforia.com/](http://developer.vuforia.com/), very cool effects.

