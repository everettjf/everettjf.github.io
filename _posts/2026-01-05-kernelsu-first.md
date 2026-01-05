---
layout: post
title: "Getting Started with KernelSU: Installing a Minimal App Hiding Module on Pixel 6"
tags:
  - KernelSU
  - Android
  - Root
  - LSPosed
  - Zygisk
  - App Hiding
  - Pixel 6
  - Android 15
comments: true
---

Having spent time with iOS jailbreaking, I decided to explore process injection and app hiding on Android. This article walks through building a **minimal working module chain (app hiding)** based on KernelSU from scratch on a Pixel 6 running Android 15.

> Note that this app hiding implementation is fairly basic—it simply hooks Java-level APIs for retrieving the app list. Regardless, this workflow provides a direct way to experience app hiding capabilities.

<!-- more -->


---

## What is KernelSU

KernelSU is a root solution designed for **Android GKI devices**. The official homepage is:

* [https://kernelsu.org/](https://kernelsu.org/)

Unlike traditional root solutions that primarily operate in userspace, KernelSU's core logic runs in **kernel space**, directly granting root privileges to userspace applications from within the kernel.

From an implementation perspective, KernelSU doesn't rely on modifying `init`, `zygote`, or the system partition. Instead, it provides capabilities through the kernel itself. This allows it to access interfaces that userspace solutions have difficulty utilizing stably.

In terms of capabilities, KernelSU provides **kernel-level interfaces**, such as:

* Setting hardware breakpoints for arbitrary processes in kernel space
* Accessing a process's physical memory with lower visibility
* Intercepting system calls (syscalls) in kernel space
* Intervening earlier in the process execution flow

These capabilities don't directly correspond to specific functional modules, but they form the technical foundation of KernelSU.

---

## Metamodule Mechanism

KernelSU also introduces a module system called **Metamodule**. Related documentation can be found in the official docs:

* [https://kernelsu.org/guide/what-is-kernelsu.html](https://kernelsu.org/guide/what-is-kernelsu.html)

KernelSU itself only provides low-level capabilities and interfaces. Specific mounting and systemless modification logic aren't hardcoded into the core, but are instead implemented by Metamodules.

For example:

* `meta-overlayfs` provides systemless modification capabilities for the `/system` partition
* Different types of modification behaviors are split into independent modules
* This prevents core functionality from bloating as module requirements grow

Module lists and available Metamodules can be viewed on the official site:

* [https://modules.kernelsu.org/](https://modules.kernelsu.org/)

---

## Test Environment

The test environment for this experiment:

* Device: Pixel 6 (oriole)
* System: Android 15 (BP1A.250505.005, May 2025)
* Root solution: KernelSU (LKM mode)
* Module chain: KernelSU → Zygisk Next → LSPosed
* Verification target: Hide My Applist

---

## Flashing Official Android 15

No customizations were made to the system. We used Google's official Factory Image, flashed via the Web Flash Tool.

After flashing, the device was in a completely clean Android 15 state, with only the bootloader unlocked for subsequent experiments.

---

## KernelSU (LKM Mode) Installation Notes

KernelSU's LKM mode installation process is similar to Magisk's approach. The overall steps are as follows:

First, extract `boot.img` from the Factory Image and push it to the device:

```bash
adb push boot.img /sdcard/Download/
```

Then use **KernelSU Manager** on the device to patch `boot.img`, generating a patched boot image.

Pull the patched image back to the local machine and flash it:

```bash
adb pull /sdcard/Download/kernelsu_patched.img
adb reboot bootloader
fastboot flash boot kernelsu_patched.img
fastboot reboot
```

After rebooting, KernelSU Manager can properly detect the root status, indicating that the kernel-side changes have taken effect.

---

## Basic Tools Setup

To facilitate subsequent operations, we installed some basic tools:

```bash
adb install MT_File_Manager.apk
adb install F-Droid.apk
adb install Termux.apk
```

These tools are only used to assist with viewing files, installing applications, and executing commands. They don't affect how KernelSU itself works.

---

## Zygisk Next and LSPosed

KernelSU doesn't implement Zygisk itself, so we need to load **Zygisk Next** separately, then use **LSPosed (Zygisk version)** on top of it.

The LSPosed module is pushed and loaded as a zip file:

```bash
adb push LSPosed-zygisk-release.zip /sdcard/Download/
```

After enabling the module in KernelSU Manager and rebooting, LSPosed Manager shows the Framework as Active, indicating that the hook chain has been established.

---

## Verifying Hook Capabilities with Hide My Applist

As the first verification point, we chose **Hide My Applist**:

* Project repository: [https://github.com/Dr-TSNG/Hide-My-Applist](https://github.com/Dr-TSNG/Hide-My-Applist)

The module's behavior is straightforward:
It controls whether target applications can retrieve the complete list of installed applications.

After installing Hide My Applist, enable the module for specific applications in LSPosed and configure hiding rules. After restarting the target application, the app list behavior changes, and the results match expectations.

This result verifies that the following chain is functional in the current environment:

> KernelSU → Zygisk Next → LSPosed → Application behavior changes

---

## Summary


Some straightforward conclusions:

* Using KernelSU on Pixel 6 with Android 15 is feasible
* The LKM mode installation path is clear and the process is stable
* Zygisk Next + LSPosed can serve as a basic hook combination under KernelSU
* Hide My Applist provides a simple, direct verification entry point


