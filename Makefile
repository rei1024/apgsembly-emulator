up:
	file_server . -p 1123
t:
	deno test --no-check src/ test/ apgdsl/ turmites/ tm_to_apg/ transpiler/
w:
	deno test --watch --no-check src/ test/ apgdsl/ turmites/ tm_to_apg/ transpiler/
cy:
	npm run cypress:open
lint:
	./node_modules/.bin/eslint .
chore:
	deno upgrade
	npm audit
	git gc
bundle:
	deno bundle frontend/index.js bundle.js