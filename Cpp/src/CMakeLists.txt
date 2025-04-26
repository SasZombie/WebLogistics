cmake_minimum_required(VERSION 3.10)

project(ParsingXml)
set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)


set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -Wformat-nonliteral -Wcast-align -Wpointer-arith -Wmissing-declarations -Winline -Wundef -Wcast-qual -Wshadow -Wwrite-strings -Wno-unused-parameter -Wfloat-equal -pedantic -ansi -fsanitize=undefined -fsanitize=address -fsanitize=leak")
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ../bin)

add_library(xmlparser SHARED xmlParser/xmlparser.cpp)
add_library(utils SHARED utils.cpp)

file(GLOB ALL_CPP_FILES *.cpp)

set(EXCLUDED_FILES
    utils.cpp
    xmlparser.cpp
)

foreach(excluded ${EXCLUDED_FILES})
    list(REMOVE_ITEM ALL_CPP_FILES "${CMAKE_CURRENT_SOURCE_DIR}/${excluded}")
endforeach()

foreach(source_file ${ALL_CPP_FILES})
    get_filename_component(exe_name ${source_file} NAME_WE)
    add_executable(${exe_name} ${source_file})
    target_link_libraries(${exe_name} xmlparser utils)
endforeach()
