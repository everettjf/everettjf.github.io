---
layout: post
title: "Dia: A Technical Deep Dive into The Browser Company's macOS Browser"
tags:
  - browser
  - dia
  - arc
  - chromium
  - macos
  - appkit
  - reverse-engineering
  - technical-analysis
comments: true
---

If you've been following Arc, you've probably heard of **Dia**.
It's another browser product from The Browser Company, currently targeting macOS.

From a user experience perspective, Dia continues some of Arc's design philosophy; but if you dig into the Dia.app bundle contents, you'll find that its engineering structure and system integration are quite "traditional" and interesting.

<!-- more -->

This article doesn't discuss whether the experience is good or bad, nor does it predict future directions. It does one thing:

> **Examine how Dia is actually built from a technical perspective.**

---

## The Company Behind Dia: The Browser Company

Let me provide some brief background.

The Browser Company was founded in **2019**, headquartered in New York, and first gained attention with the **Arc browser**. The company's public mission has been clear: explore new interaction patterns and usage models around the "browser" as a platform.

Regarding funding, based on publicly available information:

* The company has raised approximately **$128 million** in total
* This includes a **$50 million round in 2024**
* Investors include both venture capital firms and individual investors with backgrounds in internet products

As of now, **The Browser Company has not been acquired** and continues to operate independently, with Dia being part of its in-house product line.

---

## What Kind of Application is Dia?

Open `Contents/MacOS/Dia` in Dia.app, and you'll see something familiar:

* **arm64 Mach-O**
* Built with **Xcode 16.4**
* Minimum system version: **macOS 14**
* Entry point is **AppKit's MainMenu.nib**

This pretty much tells you everything:

> Dia is a standard native macOS application.

It's not Electron, and it's not a "wrapped web page."
This is also evident from its use of system capabilities, such as:

* AppleScript (`Dia.sdef`)
* Dock Tile plugins
* `NSUserActivityTypeBrowsingWeb`
* Native registration of `http / https` schemes
* Declarations for camera, microphone, Bluetooth, location, desktop, downloads, and other permissions

These are all **standard operations in the AppKit world**, but they're typically cumbersome in cross-platform frameworks.

---

## Browser Engine: Not WebKit, but ArcCore

At the rendering layer, Dia doesn't follow Safari's WebKit path.

It relies on a private framework called **ArcCore.framework**.
From the Info metadata, you can see:

* Version: **143.0.7499.170**
* Corresponding Chromium: `branch-heads/7499@{#3400}`

In other words, Dia embeds **a Chromium branch maintained by the Arc team**.

If you look at dependencies with `otool -L`, you'll find a typical combination:

* UI / System layer: AppKit, SwiftUI, Combine
* Rendering / Scripting: Chromium (via ArcCore), JavaScriptCore
* Performance: Metal, Accelerate

The overall architecture can be understood as:

> **Native macOS application + Chromium as web rendering component**

Browser windows, animations, and interactions are handled at the native layer, while Chromium primarily handles web content itself.

---

## A Notable Design: Extensive Use of Bundles

The truly "engineering-focused" part is in `Contents/Resources`.

This isn't just a simple resource directory—it's packed with bundles, such as:

* `BoostBrowser_TabUI.bundle`
* Download panel-related bundles
* Personalization modules
* Supertab-related components
* A series of `ARC_*` bundles

What these bundles have in common:

* Each has its own `Info.plist`
* Built separately by Xcode
* Each declares its minimum macOS version

This indicates that Dia uses a **modular architecture** at the functional level:
Features like tab UI, downloads, and personalization aren't all compiled into one large binary.

From an engineering perspective, this approach makes it easier to:

* Develop and debug independently
* Control feature loading
* Manage complex UI components

---

## Data, Updates, and Stability: Conventional Choices

For infrastructure, Dia uses mature solutions:

* **GRDB.framework (SQLite ORM)**
  For local data storage
* **Sparkle.framework**
  For automatic application updates
  Update source is explicitly declared in Info.plist
* **Sentry.framework**
  For crash and performance monitoring

You can also see dependencies like Datadog, ZIPFoundation, and SDWebImage, all focused on logging, resource handling, and stability.

Overall, this layer doesn't have much "experimental design"—it leans toward stable, proven implementations.

---

## Local AI: Infrastructure Already in Place

In the resources directory, there's another notable group of bundles:

* `swift-transformers_Hub.bundle`
* `mlx-swift_Cmlx.bundle`
* `AIInfra_LocalClassification.bundle`
* `OnDeviceLoRAadaptors.bundle`

Based on their names and Info metadata, these components involve:

* Swift Transformers
* Apple MLX
* Local model inference
* LoRA adapters

They're also built with Xcode, with minimum support for macOS 13.
This shows that Dia has **already prepared the engineering foundation for local ML inference** in its architecture; what specific features use it depends on product-level implementation.

---

## Closing Thoughts

If we only look at the application bundle and dependency structure, Dia's architecture is quite clear:

* It's a **native macOS application**
* Uses a **custom Chromium branch** as its web rendering engine
* Employs a **bundle-based modular organization** for features
* Infrastructure choices lean toward mature and stable solutions
* Has already prepared the engineering foundation for local ML capabilities

Not radical, not conservative—more like a serious approach to **"building a browser" within the macOS ecosystem**.
