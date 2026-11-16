# Website Repository Guidelines

## Purpose

This Jekyll site is Everett’s personal website at https://asp.run. Its homepage is a personal entry page linking to `/blog/` and AtomSprout. The article list lives at `/blog/`; dated article URLs and feeds stay unchanged. Personal projects are listed at `/projects/` using `_data/personal-projects.json`. The homepage’s The works card is the only Company entry on this personal site. Do not publish old Company product redirects or add Company links to navigation, project lists or automatic article notices; keep historical article URLs and the RSS feed stable. Project names, availability, GitHub URLs, App Store URLs, privacy statements, and feature claims must match the current repositories and shipped products.

## Domain and Project Ownership

- `https://atomsprout.com` owns formal products intended for long-term operation, including paid products and explicitly selected free products. Their product information, downloads, support, documentation and privacy pages belong in the sibling `website-company` repository.
- `https://asp.run` owns the personal entry page, blog, experimental projects, temporary tools and short-term projects. Individual personal repositories normally publish their own Pages under `asp.run/<repository>/`; do not copy their sites into this blog repository or Company.
- Give each project one primary website owner. Avoid duplicate product sites and redirect-only project routes between the two domains. Keep **The works** on the personal homepage and the Company Founder link to the personal blog; other cross-domain links should serve a real product function.
- ScriptWidget is the explicit functional example: Company owns its official product page, app downloads, support, documentation and privacy pages at `https://atomsprout.com/scriptwidget/`. Only `everettjf/scriptwidget` maintains and deploys Web Studio at `https://asp.run/scriptwidget/studio/` and the two-option entry page at `https://asp.run/scriptwidget/`. Keep useful links between the official website and Studio; never copy the compiled Studio into either website repository.
- Apply this policy when adding a project or carrying out an explicitly requested migration. Do not automatically move existing projects or change independently maintained domains.

## Source of Truth

- `_data/xnu.json`: legacy product metadata retained for older templates; do not add a new public catalog here.
- `_includes/xnu/writing_archive.html`: shared article list, title search, topic filters, and WeChat follow section for `/` and `/archive`.
- `projects/index.html`: personal project directory using `_data/personal-projects.json`.
- `_includes/xnu/`: reusable product and navigation components.
- `<product>/index.html`: product landing-page front matter and data binding.
- `<product>/privacy.html`: product privacy routes where present.
- `_posts/`: historical writing. Do not rewrite old article links merely because a repository was later archived or renamed unless the link is actually broken and a canonical replacement is known.

Public repository entries should use the canonical GitHub owner and repository spelling returned by GitHub. Maintain the public personal project list only in `_data/personal-projects.json`.

## Development

```bash
bundle exec jekyll build
```

Generated output under `_site/` and caches under `.jekyll-cache/` are build artifacts and should not be edited by hand.

## Content Rules

- Do not advertise features that are only planned or removed.
- Distinguish an App Store product name from its open-source repository name when they differ.
- Keep privacy claims precise about local storage, third-party APIs, analytics, and developer-operated servers.
- External links must use HTTPS and include safe external-link attributes through the shared include.
- Keep descriptions concise and outcome-focused; avoid unsupported superlatives.

## Verification

After changing structured data, parse `_data/xnu.json`, build Jekyll, inspect `/projects/`, and check every newly added external URL. Preserve historical posts unless they are directly in scope.
