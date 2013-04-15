CWD := $(shell pwd)
LIB := $(CWD)/lib

test:
	mocha --reporter spec $(CWD)/test/*.test.js

.PHONY: test
