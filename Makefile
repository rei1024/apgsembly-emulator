up:
	file_server . -p 1123
t:
	deno test --no-check src/ apgc/ test/ apgdsl/
watch:
	deno test --watch --no-check src/ apgc/ test/ apgdsl/
cy:
	npm run cypress:open
lint:
	eslint .
