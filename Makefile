test:
	@go test

build:
	@npm update
	@npm audit fix
	@mkdir src
	@npx browserify chrono.js --standalone chrono > src/chrono.out.js
	@npx tsc src/chrono.out.js --esModuleInterop true --allowJs true --target es5 --outfile chrono.out.js
	@rm -rf src
	@echo 'Reminder to up version in package.json!'
