#!/usr/bin/env bash
set -euo pipefail

data_file="_data/growth.json"
snapshot_date="${SNAPSHOT_DATE:-$(date -u +%F)}"
work_file="$(mktemp)"
trap 'rm -f "$work_file"' EXIT

repositories_json="$(jq -c '.repositories' "$data_file")"
updated='[]'

while IFS= read -r repository; do
  full_name="$(jq -r '.repo' <<<"$repository")"
  stars="$(gh api "repos/$full_name" --jq '.stargazers_count')"
  updated="$(jq -c --argjson repository "$repository" --argjson stars "$stars" '. + [$repository + {stars: $stars}]' <<<"$updated")"
done < <(jq -c '.[]' <<<"$repositories_json")

total_stars="$(jq '[.[].stars] | add // 0' <<<"$updated")"
jq --arg date "$snapshot_date" --argjson repositories "$updated" --argjson total "$total_stars" '
  .updated_at = $date
  | .repositories = $repositories
  | .snapshots = ((.snapshots | map(select(.date != $date))) + [{date: $date, total_stars: $total}] | sort_by(.date))
' "$data_file" > "$work_file"
mv "$work_file" "$data_file"
