CC = gcc
CFLAGS = -std=c11 -wall -g

LIB = shareLib.so

SRC = ./src/
BIN = ./bin/
INC = ./include/

all: $(BIN)LinkedListAPI.o $(BIN)GEDCOMparser.o $(BIN)GEDCOMutilities.o
	$(CC) -shared -o $(BIN)libparser.so $(BIN)LinkedListAPI.o $(BIN)GEDCOMparser.o $(BIN)GEDCOMutilities.o

parser: $(BIN)GEDCOMparser.o $(BIN)GEDCOMutilities.o
	ar rcs $(BIN)libparser.a $(BIN)GEDCOMparser.o $(BIN)GEDCOMutilities.o

list: $(BIN)LinkedListAPI.o
	ar rcs $(BIN)libparser.a $(BIN)LinkedListAPI.o

clean: 
	rm -f $(BIN)*

$(BIN)LinkedListAPI.o: $(SRC)LinkedListAPI.c
	$(CC) $(CLFLAGS) -c $(SRC)LinkedListAPI.c -fpic -Iinclude -o $(BIN)LinkedListAPI.o

$(BIN)GEDCOMparser.o: $(SRC)GEDCOMparser.c
	$(CC) $(CLFLAGS) -c $(SRC)GEDCOMparser.c -fpic -Iinclude -o $(BIN)GEDCOMparser.o

$(BIN)GEDCOMutilities.o: $(SRC)GEDCOMutilities.c
	$(CC) $(CLFLAGS) -c $(SRC)GEDCOMutilities.c -fpic -Iinclude -o $(BIN)GEDCOMutilities.o  