help: ## List tasks with documentation
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' "$(firstword $(MAKEFILE_LIST))" | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
	@for file in $(DARKLY_EXE); do printf "\033[36m%-30s\033[0m %s\n" $${file} "Single Darkly executable"; done

serve: ## Run locally with future and drafts visible
	hugo  --buildFuture --buildDrafts serve
