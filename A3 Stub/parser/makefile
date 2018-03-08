CC = gcc
CFLAGS = -Wall -g -Iinclude

UNAME := $(shell uname)

ifeq ($(UNAME), Linux)
	CCFLAGS += -std=gnu11 
endif
ifeq ($(UNAME), Darwin)
	CCFLAGS += -std=c11
endif

all: myProgram testProgram

myProgram:  
	$(CC)  $(CFLAGS) src/*.c  tests/myTest.c -o bin/run

testProgram:
	$(CC)  $(CFLAGS) src/*.c  tests/testSuite.c -o bin/runTest

test:
	./bin/run ./assets/test.ged

simple:
	./bin/run ./assets/simpleGEDCOM.ged

shakespeare:
	./bin/run ./assets/shakespeare.ged

valgrind:
	valgrind -v --leak-check=full ./bin/run ./assets/shakespeare.ged
