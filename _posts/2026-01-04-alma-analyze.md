---
layout: post
title: "Alma: Reverse Engineering an AI Provider Orchestration Desktop App"
tags:
  - alma
  - electron
  - ai
  - desktop
  - reverse-engineering
  - playwright
  - mcp
  - typescript
comments: true
---

### What is Alma?

**Alma** is a desktop **AI Provider orchestration and management application**. It has recently received widespread praise on X, and the author is very active. The development pace is extremely fast, with releases coming like rain. I've been playing around with this software recently and deeply appreciate the author's solid technical foundation.

<!-- more -->

On its official website ([https://alma.now/](https://alma.now/)), it positions itself very directly:

> **Elegant AI Provider Orchestration**

In other words, Alma doesn't aim to be just a "chat window"—it wants to become a **desktop workbench that uniformly schedules, combines, and runs multiple AI capabilities**.

Based on the official website and actual code structure, Alma focuses on these areas:

* Unified management of multiple AI Providers (OpenAI, Anthropic, Google Gemini, DeepSeek, and custom APIs)
* Conversation-centric UI with Markdown support, code highlighting, and streaming output
* Memory and context management, visualized in the UI
* Browser-based capabilities like WebFetch / WebSearch
* Composable extensions through Prompt Apps and Skills
* **Extensive direct integration of local capabilities, rather than "cloud-only"**

Overall, it feels more like an **"AI capability orchestration layer + desktop IDE-like experience"**:
It handles models, credentials, and protocols, while also actually running tools locally.

---

### Author and Project Source

Alma is developed and maintained by **yetone**. The project is closed-source, though the source code appears to be hosted on GitHub (inferred from configuration files):
[https://github.com/yetone/alma.git](https://github.com/yetone/alma.git) The author's GitHub is https://github.com/yetone, with multiple high-starred projects, showing strong technical passion and worth learning from for developers.

Back to Alma. Based on code scale, engineering organization, and continuous version evolution, this isn't a one-off demo—it's a **long-term evolving desktop AI project**.
The author demonstrates solid engineering practices in the following areas:

* Electron / macOS desktop application architecture
* Node.js / TypeScript engineering
* Unified abstraction of multiple AI Providers
* Local tool integration (PTY, Playwright, Whisper)
* Emerging model protocols like MCP / ACP
* Complete OAuth / PKCE authorization lifecycle

---

## 1. Shell and Release Information

* `Info.plist` shows Bundle ID as `com.yetone.alma`, version **0.0.170**, minimum system **macOS 12.0**, main class `AtomApplication`, clearly belonging to the **Electron / Atom shell family**.
* `NSAllowsArbitraryLoads` is enabled along with local network access exemptions, indicating the app needs to freely communicate with various model services, proxies, or local services.
* Auto-update configuration is located at `Resources/app-update.yml`, with update source pointing to a self-hosted feed: `https://updates.alma.now/`, meaning the official team maintains a complete update publishing backend.
* Core logic is packaged in `app.asar`, which unpacks to a typical Electron structure: `out/`, `node_modules/`, `package.json`.

---

## 2. Project Structure and Dependencies

`package.json` defines Alma as an **"AI Provider Management Desktop App"**, using **pnpm** for dependency management, with `onlyBuiltDependencies` enabled for Electron native modules.
It also fixes the `node-abi` version via overrides to match the built-in `node-pty` beta.

Dependencies can be roughly divided into four categories:

### 2.1 AI Provider SDK

* `@ai-sdk/*` (openai / anthropic / azure / google / deepseek / openrouter)
* `@ai-sdk/provider`
* `@mcpc-tech/acp-ai-provider`
* `@aihubmix/ai-sdk-provider`

Used to uniformly abstract generation, streaming output, and tool calling across different models.

### 2.2 Desktop Local Capabilities (Key Focus)

* `better-sqlite3`, `sqlite-vec`
* `node-pty@1.1.0-beta43`
* **`playwright@^1.57.0`**
* `chromium-bidi`
* `@fugood/whisper.node`

This group of dependencies is crucial—it clearly shows:
**Alma isn't "pretending to be desktop"—it actually runs tools locally.**

### 2.3 Document and Content Preview

PDF, Excel, Word, tokenization, image dimensions, Emoji processing capabilities for multi-format content display.

### 2.4 UI and Monitoring

Radix, framer-motion, sonner, PostHog, Sentry, forming a modern React desktop UI and observability system.

---

## 3. Main Process (`out/main/index.js`) Deep Dive

The main process is Alma's "control tower," bringing together system capabilities, local services, databases, and AI Providers.

### 3.1 Environment Setup and Dependency Injection

* Electron core module loading
* Uses `fix-path` to fix CLI environment on macOS
* Starts local Express API + WebSocket server
* Uses `zod` for interface schema validation
* Initializes Sentry and AI Tool middleware

---

### 3.2 Database Layer (Drizzle + SQLite)

* Covers core tables: Prompt, Workspace, Chat, Provider, Skill, MCP, Theme
* Version 0.0.170 adds subscription types (like `claude-subscription`) and configuration fields to the Provider table
* Uses Drizzle relations to explicitly express complex UI relationships

---

### 3.3 AI Provider / Tool System

* Uses `ai` package to unify text and streaming output across different models
* Integrates ACP tool system with UI tool stream support
* Built-in Proxy + Retry + Timeout, supports HTTP / SOCKS5

---

### 3.4 Local API + MCP / OAuth

* Local REST API + WebSocket push
* Complete MCP OAuth lifecycle (authorization, refresh, revocation)
* Claude Subscription authorization flow built into IPC

---

### 3.5 **Playwright: Not an Afterthought, but Explicit Infrastructure**

Playwright in Alma is **explicitly present, explicitly used, and explicitly lifecycle-managed**—not a future placeholder option.

**First, at the dependency level:**

* `package.json` directly declares `"playwright": "^1.57.0"`
* Placed in the same group of "desktop automation dependencies" as `node-pty` and `chromium-bidi`
* This means **Playwright is installed into the app during the build phase** (not via runtime npm install)

**Second, installation and state management logic in the main process:**

* The main process maintains a complete Playwright installation detection flow:

  * Checks `~/Library/Caches/ms-playwright/` (macOS) or `%LOCALAPPDATA%/ms-playwright`
  * Determines if `chromium-*` directories already exist
* If not installed:

  * Pulls browser kernel via `playwright-core/cli.js install chromium`
  * Installation status recorded in `ta = { installed, installing, progress }`
* Exposes complete control surface via IPC:

  * `playwright-get-status`
  * `playwright-install`
  * `playwright-install-status` (real-time progress events)

**The purpose of this mechanism is very clear:**

> To provide Alma's **WebFetch / WebSearch / automated scraping capabilities** with a **controllable, stable, version-fixed Chromium kernel**.

Therefore:

* The app calls `ra()` during startup to attempt **silent installation**
* UI allows users to view installation status or manually trigger again
* Only when the Playwright browser is ready will background web scraping and script execution capabilities actually be enabled

This also explains why Alma **must be a desktop application**:
These capabilities are almost impossible to reliably implement in a pure web environment.

---

### 3.6 System Capabilities and IPC Interfaces

IPC covers almost all desktop capabilities:

* Multi-window management
* Global and dynamic keyboard shortcuts
* Clipboard and file system
* Microphone, Whisper, Playwright status
* Auto-updates
* Copilot / Claude token management
* MCP OAuth
* WebFetch / WebSearch debug windows

---

## 4. Renderer Layer (React + Vite)

* React + Vite + SWR + jotai
* An aggregated Context as the UI logic bus
* Chat, tool management, multi-window control
* Full-format content preview
* Radix UI + animations
* PostHog / Sentry monitoring

All capabilities uniformly call the main process via IPC injected through preload.

---

## 5. Development and Debugging

* Supports Vite DevServer hot reload
* TypeScript + pnpm workspaces
* Official GitHub source code is more suitable for reading and secondary development than the bundle

---

## 6. Security, Privacy, and System Permissions

* Requests microphone, Bluetooth, camera permissions
* Supports proxy configuration
* Telemetry (Sentry / PostHog) should be evaluated based on deployment scenario
* MCP OAuth uses PKCE, supports token revoke / refresh

---

## 7. Summary

**Alma 0.0.170** demonstrates a very "substantial" desktop AI application form:

* Upper layer: Multi-window, conversation-driven UI
* Middle layer: Unified orchestration of Provider, Prompt, Skill, MCP
* Lower layer: **Real local infrastructure**—database, terminal, Playwright Chromium, voice models

Combining the official positioning with actual engineering implementation, Alma is more like an **AI capability scheduling and execution platform**, not just a chat tool.
In the direction of "AI desktop applications," it provides a structurally complete, engineering-solid implementation sample that clearly has room to grow.
