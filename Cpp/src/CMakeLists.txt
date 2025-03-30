cmake_minimum_required(VERSION 3.10)

project(ParsingXml)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wformat-nonliteral -Wcast-align -Wpointer-arith -Wmissing-declarations -Winline -Wundef -Wcast-qual -Wshadow -Wwrite-strings -Wno-unused-parameter -Wfloat-equal -pedantic -ansi -fsanitize=undefined -fsanitize=address -fsanitize=leak")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ../bin)

add_library(xmlparser SHARED xmlParser/xmlparser.cpp)
add_library(utils SHARED utils.cpp)

add_executable(getAllEntriesBook getAllEntriesBook.cpp)
target_link_libraries(getAllEntriesBook xmlparser utils)

add_executable(addEntryInBook addEntryInBook.cpp)
target_link_libraries(addEntryInBook xmlparser utils)

add_executable(addEntryInUser addEntryInUser.cpp)
target_link_libraries(addEntryInUser xmlparser utils)

add_executable(getAllEntriesUser getAllEntriesUser.cpp)
target_link_libraries(getAllEntriesUser xmlparser utils)

add_executable(getBooksBasedOnCriteria getBooksBasedOnCriteria.cpp)
target_link_libraries(getBooksBasedOnCriteria xmlparser utils)

add_executable(getBookField getBookField.cpp)
target_link_libraries(getBookField xmlparser utils)
