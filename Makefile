.PHONY: publish test

publish:
	npm publish .

test:
	@./node_modules/.bin/mocha --require should --reporter dot --bail