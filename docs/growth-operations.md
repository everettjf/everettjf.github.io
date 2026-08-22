# Product growth operations

## Funnel definitions

| Step | Event or source | Meaning |
| --- | --- | --- |
| Placement shipped | App Store version | The recommendation is available to users. |
| Landing visit | `landing_view` | A user opened the ScriptWidget landing page. |
| Store handoff | `app_store_click` | A landing-page visitor opened the App Store. |
| First-time download | App Store Connect campaign | Apple attributed a first download to the campaign. |
| Open-source conversion | GitHub stars | Net repository stars at the weekly snapshot. |

Do not treat landing visits as impressions inside the source app. Do not infer downloads from App Store clicks.

## Current campaigns

- Remoboard: `utm_source=remoboard`, content `home_featured_card`.
- BSSIDScan: `utm_source=bssidscan`, content `settings_featured_card`.
- Both use `utm_medium=in_app` and `utm_campaign=cross_promo`.
- Create separate App Store Connect campaigns named `remoboard_cross_promo` and `bssidscan_cross_promo`.

## Weekly review

1. Record each released source-app version and release date.
2. Export landing and App Store click events by source and content.
3. Record App Store campaign product-page views and first-time downloads.
4. Review the automated GitHub star snapshot and use Digstar for any material ScriptWidget spike.
5. Keep a placement for at least 14 days unless it is broken or misleading.
6. Decide: keep, revise copy/placement, or remove. Record the decision beside the experiment.

## Decision rules

- Keep a placement when it produces attributable first-time downloads without harming source-app usability.
- Revise when landing visits exist but App Store handoff is weak; test the landing promise or CTA first.
- Revise the in-app copy or placement when source traffic is weak.
- Do not declare a winner below Apple's privacy threshold or from fewer than 14 days of data.

## Credentials and private data

GitHub star counts are public and may be committed. App Store downloads, conversion rates, analytics credentials, Apple IDs, provider tokens before use, and exported customer-level data must not be committed. Keep App Store metrics in the private operating sheet or dashboard selected by the owner.
