.PHONY: dependencies lint test build sec

dependencies:
	npm ci

lint: dependencies
	npx prettier --check "src/**/*.ts"
	npx eslint src/

test: dependencies
	npx vitest run

build: dependencies
	npx vite build
	test -f dist/fbsim-ui.js
	test -f dist/fbsim-ui.cjs
	test -f dist/register.js
	test -f dist/register.cjs

sec: dependencies
	npm audit --audit-level=high
