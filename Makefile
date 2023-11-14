help:
	@echo "targets:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
	| sed -n 's/^\(.*\): \(.*\)##\(.*\)/  \1|\3/p' \
	| column -t  -s '|'

deploy: ## send built files to webserver
	rsync -rvhe ssh --progress --delete --exclude=Makefile --exclude=.git* . tomasino.org:/var/www/www.tomasino.org/

serve: ## launch local testing server
	python3 -m http.server

.PHONY: help deploy

#  vim: set shiftwidth=4 tabstop=4 noexpandtab:
