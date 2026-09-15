# Karots POS site — the page is fully static; this just serves it for local
# preview. It must be served over HTTP (it fetches data/*.json and loads app.js
# as a module), so opening index.html from file:// won't render the sections.
.PHONY: serve help
PORT ?= 8080

help:
	@echo "make serve [PORT=8080]   start a local preview server (Ctrl+C to stop)"

serve:
	@echo "Karots site -> http://localhost:$(PORT)   (Ctrl+C to stop)"
	@python3 -m http.server $(PORT)
