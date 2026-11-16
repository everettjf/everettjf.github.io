# asp.run

Personal website and blog of everettjf, built with Jekyll and served at https://asp.run
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

Write the original in whichever language makes the subject easiest to express. English-only, Chinese-only, and bilingual posts are all supported. For an English post:

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

The **EN / 中文** control appears only inside bilingual articles and switches the article title and content. Articles default to English and remember an explicit reading preference under `article_lang` in `localStorage`. Links with `?lang=zh` or `?lang=en` select the article language. The homepage, archive, About page, navigation, and filters always stay in English, regardless of browser language or article preferences. For a bilingual post set `lang_original` to `zh` or `en` to identify the original.

For a Chinese-only post, omit `title_zh` and `<!--ZH-->`, and add:

```yaml
lang: zh-Hans
lang_original: zh
```

Single-language articles retain their original content and carry a language badge. Use `listing_title_en` for an English archive title when the original title is Chinese. Translations are optional; do not leave placeholder translations in published articles.

### Topics and historical writing

Set `topic` to one of `systems`, `debugging`, `building`, `development`, or `personal`. The bilingual labels live in `_data/writing_topics.yml`; original categories and tags remain intact for historical metadata.

For old version-specific instructions, add `historical_context_en` and `historical_context_zh` with the actual environment; do not invent a version when it was not recorded. Set `release_history: true` on historical release posts, or `personal_case: true` for an individual support case. These notices preserve the original publication date and do not imply current compatibility.

For a translated external article, record `source_url`, `source_title`, `source_author`, and `source_published`. Link to the original English rather than back-translating a Chinese adaptation.

### Subscriptions

`/feed.xml` retains the English feed and its stable article GUIDs. `/feed-zh.xml` serves Chinese versions, falling back to the available original when a translation is absent. Feed links select the corresponding reading language. Both feeds contain the latest ten posts.

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
- The `/projects` and product pages use a precompiled Tailwind stylesheet
  (`assets/xnu/css/tailwind.css`) and a self-hosted lucide icon bundle
  (`assets/xnu/js/lucide-icons.min.js`) — no runtime CDN requests. After adding
  new Tailwind classes or lucide icon names, rebuild both with `make assets`
  (requires Node; sources live in `_build/`).

## Personal domain and product ownership

The two domains have complementary roles:

| Domain | Projects and content |
| --- | --- |
| `atomsprout.com` | Formal products intended for long-term operation, including paid products and explicitly selected free products. Company owns their product information, downloads, support, documentation and privacy pages. |
| `asp.run` | The personal entry page and blog, experimental projects, temporary tools and short-term projects. Individual project sites are normally published by their own repositories using GitHub Pages. |

Give each project one primary website owner. Avoid duplicate product sites and
redirect-only project routes between the two domains. Cross-domain links should
serve the homepage/Founder navigation or a real product function.

Apply this policy to new projects and explicitly requested migrations. Existing
project locations and independently maintained domains remain until the owner
requests a change.

The user-site domain is `asp.run`. `/` is the personal entry page, `/blog/` is the
article index, and `/projects/` lists personal projects. The homepage's **The works**
card is the personal site's single Company entry point at https://atomsprout.com/.
Do not add Company links to the shared navigation, project list or article notices.
Historical articles and RSS paths stay unchanged.

Company product landing, support and privacy routes are not published by this
repository, including old redirect-only URLs. Product content is maintained in the
sibling `website-company` checkout.

Individual personal repositories publish their own Pages under
`asp.run/<repository>/`. ScriptWidget's own repository publishes a two-option entry
page at `/scriptwidget/` and functional Web Studio at `/scriptwidget/studio/`.
Company owns ScriptWidget's official product page, app downloads, support,
documentation and privacy pages at https://atomsprout.com/scriptwidget/. Keep
useful links between that website and Studio; do not copy the compiled Studio
into this blog repository or Company.

Palmino landing, support and original privacy content are maintained here. Rho PDF is a Company product; its pages live at https://atomsprout.com/rhopdf/.

Cloudflare forwards `xnu.app` to `asp.run`, preserving paths and query strings.
