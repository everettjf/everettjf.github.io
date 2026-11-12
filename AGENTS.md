# Website Repository Guidelines

## Purpose

This Jekyll site is Everett’s personal blog. Its homepage is the chronological article list; keep project catalogs and product showcases out of the blog navigation and homepage. Released commercial apps and games live in the sibling `website-company` repository at https://atomsprout.com. Legacy product routes redirect there; keep historical article URLs and the RSS feed stable. Project names, availability, GitHub URLs, App Store URLs, privacy statements, and feature claims must match the current repositories and shipped products.

## Source of Truth

- `_data/xnu.json`: legacy product metadata retained for older templates; do not add a new public catalog here.
- `_includes/xnu/writing_archive.html`: shared article list, title search, topic filters, and WeChat follow section for `/` and `/archive`.
- `projects/index.html`: legacy works entry; redirects to the company homepage.
- `_includes/xnu/`: reusable product and navigation components.
- `<product>/index.html`: product landing-page front matter and data binding.
- `<product>/privacy.html`: product privacy routes where present.
- `_posts/`: historical writing. Do not rewrite old article links merely because a repository was later archived or renamed unless the link is actually broken and a canonical replacement is known.

Public repository entries should use the canonical GitHub owner and repository spelling returned by GitHub. Avoid maintaining a second handwritten project list outside `_data/xnu.json`.

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
