test:
	@go test

build:
	@npm ci
	@mkdir src
	@npx browserify chrono.js --standalone chrono > src/chrono.out.js
	@npx tsc src/chrono.out.js --esModuleInterop true --allowJs true --target es5 --outfile chrono.out.js
	@go-bindata -pkg chrono chrono.out.js
	@rm -rf src chrono.out.js
	@echo 'Reminder to up version in package.json!'
