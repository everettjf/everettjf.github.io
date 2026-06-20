REPO := everettjf/everettjf.github.io

.DEFAULT_GOAL := help
.PHONY: help init health new new-bi draft serve serve-drafts build clean redeploy deploy-status

help: ## Show this help
	@echo "xnu.app site — common tasks:"
	@echo
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "Examples:"
	@echo "  make new title=\"My New Post\""
	@echo "  make new-bi title=\"My New Post\""
	@echo "  make serve"

init: ## Install Ruby (via Homebrew) + bundler + project gems
	@command -v brew >/dev/null 2>&1 || { echo "Homebrew not found. Install it first: https://brew.sh"; exit 1; }
	brew install ruby
	@echo "If 'ruby -v' still shows the system Ruby, add Homebrew Ruby to your PATH (brew info ruby)."
	gem install bundler
	bundle install
	@echo "Done. Try: make health"

health: ## Check the Ruby/Jekyll toolchain is healthy
	@echo "ruby:    $$(ruby -v 2>/dev/null || echo 'NOT FOUND')"
	@echo "bundler: $$(bundle -v 2>/dev/null || echo 'NOT FOUND')"
	@echo "gems:    $$(bundle check 2>/dev/null || echo 'run: make init')"
	@echo "jekyll:  $$(bundle exec jekyll -v 2>/dev/null || echo 'NOT FOUND — run: make init')"
	@command -v gh >/dev/null 2>&1 && echo "gh:      $$(gh --version | head -1)" || echo "gh:      not installed (optional, for make redeploy)"

new: ## New English post:  make new title="My Post"
	@test -n "$(title)" || { echo 'Usage: make new title="My Post Title"'; exit 1; }
	bundle exec rake post title="$(title)"

new-bi: ## New bilingual (EN + 中) post:  make new-bi title="My Post"
	@test -n "$(title)" || { echo 'Usage: make new-bi title="My Post Title"'; exit 1; }
	bundle exec rake bipost title="$(title)"

draft: ## New draft (unpublished):  make draft title="My Post"
	@test -n "$(title)" || { echo 'Usage: make draft title="My Post Title"'; exit 1; }
	bundle exec rake draft title="$(title)"

serve: ## Local preview at http://localhost:4000
	bundle exec jekyll serve

serve-drafts: ## Local preview including drafts
	bundle exec jekyll serve --drafts

build: ## Build the site into _site/
	bundle exec jekyll build

clean: ## Remove build output and caches
	rm -rf _site .jekyll-cache .sass-cache

redeploy: ## Force a GitHub Pages rebuild (if a push didn't trigger one)
	@command -v gh >/dev/null 2>&1 || { echo "gh CLI required: https://cli.github.com"; exit 1; }
	gh api -X POST repos/$(REPO)/pages/builds --jq '"requested: \(.status)"'

deploy-status: ## Show the latest GitHub Pages build status
	@command -v gh >/dev/null 2>&1 || { echo "gh CLI required: https://cli.github.com"; exit 1; }
	@gh api repos/$(REPO)/pages/builds/latest --jq '"status: \(.status)  commit: \(.commit[0:7])  error: \(.error.message // "none")"'
