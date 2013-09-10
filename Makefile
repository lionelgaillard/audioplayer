
build:
	uglifyjs -nc ./audioplayer.js > ./audioplayer.min.js

.PHONY: build
