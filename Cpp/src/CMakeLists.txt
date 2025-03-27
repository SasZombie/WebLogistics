cmake_minimum_required(VERSION 3.10)

project(ParsingXml)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wformat-nonliteral -Wcast-align -Wpointer-arith -Wmissing-declarations -Winline -Wundef -Wcast-qual -Wshadow -Wwrite-strings -Wno-unused-parameter -Wfloat-equal -pedantic -ansi -fsanitize=undefined -fsanitize=address -fsanitize=leak")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ../bin)

add_executable(getAllEntriesBook getAllEntriesBook.cpp xmlParser/xmlparser.cpp)
add_executable(addEntryInBook addEntryInBook.cpp xmlParser/xmlparser.cpp)
