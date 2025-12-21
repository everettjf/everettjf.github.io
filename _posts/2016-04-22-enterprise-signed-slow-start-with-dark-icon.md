---
layout: post
title: Enterprise Certificate Signed App Slow Startup (Stuck on Dark Icon for N Seconds)
categories: Skill
comments: true
---



# Problem

In the past month or so, QA found that the App frequently has slow startup. And it's relatively easy to reproduce.

Reproduction system version: iOS 9.3, and install enterprise certificate signed App.

App startup process is generally like this: App icon color will first darken, after darkening the icon appears with zoom effect entering LaunchScreen.

The problem is: First launch of App won't have lag, when switching to other Apps for a while, then clicking App icon again, stuck at dark icon for 3 to 10 seconds, time varies each time.

See the `51VV` icon in the top right, the image below is the `dark` icon (i.e., stuck at this interface for 3 to 10 seconds):
<!-- more -->


![](https://everettjf.github.io/stuff/image/darkicon.PNG)

The image below is the `normal` icon:

![](https://everettjf.github.io/stuff/image/darkicon0.PNG)



# Attempted Methods

This problem was mainly solved by my colleague, I tracked the whole process and provided some signing support.

- Initially thought it was too much code in AppDelegate startup, did a lot of optimization.
- Later found the code here wasn't even executed.
- Later thought it was a project configuration issue, created a new project, signed with enterprise certificate, didn't have this issue.
- Then directly signed with enterprise certificate on development machine, didn't have this issue. (At this point basically suspected the build machine)
- (Build machine, that is configured Jenkins continuous integration, automatic packaging, automatic enterprise signing, automatic upload to fir. Previous blog wrote similar articles), also due to busy work (lazy) never upgraded the build machine.
- Finally, upgraded build machine to latest OS X system (OS X 10.10), Xcode also upgraded to latest (7.3), packaged and enterprise signed again.
- No longer has this issue.

# Reproduction Environment

- Build machine Xcode 7.1 + OS X 10.10
- Development machine Xcode 7.3 + OS X 10.11

# Impact Scope

- Only enterprise certificate signed Apps. (AppStore certificate signed Apps won't have this issue)

# Problem Cause

- Possible cause 1: Old version Xcode signing enterprise certificates on old version system, in the code verifying App signature certificate at App startup, didn't achieve perfect compatibility with iOS 9.3 system. Or rather, should be Apple's bug.
- Possible cause 2: Old version Xcode compiling new version Xcode project caused it.

Of course, I think cause 1 is more likely.


# Solution

- Keep build machine and development machine environments consistent.
- Try to keep latest version of system and development environment.

# Related Materials

stackoverflow has similar questions, but the cause is different.

<http://stackoverflow.com/questions/29589285/why-ios-apps-signed-with-development-or-enterprise-certificates-launch-slower>
