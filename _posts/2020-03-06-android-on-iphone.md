---
layout: post
title: "Running Android on iPhone"
categories:
  - iOS Development
tags:
  - iOS
  - development
  - mobile

comments: true
---

First time in history to make Android system run on iPhone. Currently (March 6, 2020) version only supports iPhone7/7 Plus. (iOS system version no requirement)

Project Sandcastle: Android for the iPhone 
Project address: https://projectsandcastle.org/

Happened to have an iPhone7, experienced it. Steps simply summarized, share with everyone. Ideal steps below, but due to macOS security mechanisms, steps 2 and 3 not so smooth and pleasant.

1. Use checkra1n to jailbreak
2. Run start_mac.sh
3. Run setup_mac.sh

<!-- more -->

## Jailbreak

Download https://checkra.in/ follow steps to jailbreak. (iPhone connect to Mac using USB.)

![-w480](/media/15834927122755.jpg)


![-w480](/media/15834927589010.jpg)
![-w246](/media/15834927957183.jpg)

![-w480](/media/15834928119092.jpg)

After jailbreak, enter iOS.

## Download Android Build

Download Android Build at https://projectsandcastle.org/status.

![](/media/15835109011989.jpg)

Extract downloaded file.
![-w234](/media/15835110829022.jpg)

## setup_mac.sh

iPhone connect to Mac using USB. Ideally, execute `./setup_mac.sh` on macOS. But my execution not smooth. Built-in iproxy and two dynamic libraries' signatures first execution still need trust. But actually functionality is iproxy's functionality, so below manually execute steps in setup_mac.sh.

Can first ssh connect to iOS, ensure manual connection succeeds. Then reference steps below.

(1)

```
iproxy 2222 44
```

(2)
Copy isetup to iOS's /tmp/setup.sh

```
scp -P2222 -o StrictHostKeyChecking=no isetup root@localhost:/tmp/setup.sh
```

(3)
Two methods:

One, FQ.
Or, modify network connection test address in setup.sh, for example specifically test if internet works baidu (looks like foreigners also correspondingly use google to test ha)


![-w627](/media/15835114471189.jpg)


Recommend using FQ method, because this script will download 470MB file, my home Wi-Fi without FQ, downloading this file very slow, after FQ seems few minutes done.

![](/media/15835117141314.jpg)



(4) Execute /tmp/setup.sh

![-w462](/media/15835063026640.jpg)



## Enter DFU Mode

1. iPhone power off.
2. Simultaneously press volume down + power button, 10 seconds (strictly 10 seconds).
3. Release power button, continue holding volume down.
4. At this time phone screen will stay black, indicates entered DFU mode.

Then in DFU mode, execute `./start_mac.sh`.

Ideally, after execution completes done. But reality cruel, I saw popup below (ten thousand alpacas running in heart, afraid phone broken...), of course click Cancel.

![-w420](/media/15835119951796.jpg)


Enter System Preferences -> Security & Privacy -> General, click Allow Anyway.

![-w608](/media/15835120714520.jpg)

At this time still not OK, to prevent just in case, first command then execute once

```
./load-linux.mac
```

Then can click Open.

![-w469](/media/15835077352704.jpg)

But at this time re-executing `start_mac.sh` seems can't "resume continue", heart X#@%$$. "Smart" me looked at start_mac.sh's code, looks can execute this step.

```
./load-linux.mac Android.lzma dtbpack
```

Finally succeeded, Android system started on iPhone.

## Screenshots

![](/media/15835124510615.jpg)

![](/media/15835124757092.jpg)




## Summary


1. Runs quite laggy.
2. Restart returns to iOS.

Still quite interesting, video can search everettjf on Douyin to view.

---

If everyone likes, follow subscription account to encourage:

![](/images/fun.png)



