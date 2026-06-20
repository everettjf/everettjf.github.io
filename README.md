# xnu.app

Personal site & blog of everettjf, built with Jekyll and served at https://xnu.app
(GitHub Pages, built from the `master` branch).

## 最常用流程 (TL;DR)

```sh
make new title="My Post"     # 新建英文博客 (双语用 make new-bi)
make serve                   # 本地预览 http://localhost:4000
git add -A && git commit -m "New post" && git push   # 发布
make deploy-status           # 需要时确认部署 (漏触发用 make redeploy)
```

首次在新机器上：`make init` 装环境，`make health` 自检。

## Quick start

```sh
make init     # install Ruby (Homebrew) + bundler + project gems
make health   # verify the toolchain
make serve    # local preview at http://localhost:4000
```

## Make targets

| Command | What it does |
|---------|--------------|
| `make help` | List all targets |
| `make init` | Install Ruby (via Homebrew) + bundler + project gems |
| `make health` | Check Ruby / bundler / Jekyll / gh are healthy |
| `make new title="..."` | New **English** post |
| `make new-bi title="..."` | New **bilingual** (EN + 中) post |
| `make draft title="..."` | New unpublished draft (in `_drafts/`) |
| `make serve` | Local preview at http://localhost:4000 |
| `make serve-drafts` | Local preview including drafts |
| `make build` | Build into `_site/` |
| `make clean` | Remove `_site` and caches |
| `make redeploy` | Force a GitHub Pages rebuild (if a push didn't trigger one) |
| `make deploy-status` | Show the latest Pages build status |

## Writing a post

English is the default. Most new posts are English-only:

```sh
make new title="My New Post"
# creates _posts/YYYY-MM-DD-my-new-post.md — open it and write.
```

The filename date sets the publish date and URL (`/year/month/day/slug/`).

### Bilingual posts (English + 中)

For a post that should also have a Chinese version:

```sh
make new-bi title="My New Post"
```

This scaffolds the bilingual convention — English first, a `<!--ZH-->`
separator, then Chinese:

```markdown
---
layout: post
title: "My New Post"
title_zh: "中文标题"
lang_original: zh
categories:
tags:
comments: true
---

English content here.

<!-- more -->

<!--ZH-->

中文正文。
```

The post page then shows an **EN / 中** toggle (default English, remembered via
`localStorage`) and a "Translated from Chinese" note. Posts without a
`<!--ZH-->` block render as plain English with no toggle.

### Images

Put images in `media/` and reference them with `![](/media/xxx.jpg)`. To prevent
layout shift (CLS), add intrinsic dimensions via kramdown IAL:

```markdown
![](/media/xxx.jpg){:width="800" height="600"}
```

## Publish

```sh
git add -A && git commit -m "New post: ..." && git push
```

GitHub Pages rebuilds automatically (1–2 min). If a push doesn't trigger a build,
force one with `make redeploy`, and check progress with `make deploy-status`.

## Notes

- SEO (Open Graph, Twitter cards, canonical, JSON-LD), `sitemap.xml`, and the RSS
  feed are generated automatically via `jekyll-seo-tag` / `jekyll-sitemap`.
- Fonts (Inter, Geist Mono) are self-hosted under `assets/fonts` and
  `assets/xnu/fonts` — no external Google Fonts request.
- The `/projects` and product pages use Tailwind via the Play CDN (no build step).
