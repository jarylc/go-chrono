dev:
	@go run _examples/chrono.go

build:
	@./node_modules/.bin/browserify chrono.js --standalone chrono > chrono.out.js
	@go-bindata -pkg chrono chrono.out.js
	@rm chrono.out.js
