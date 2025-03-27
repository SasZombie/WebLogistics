#include <iostream>
#include "xmlParser/xmlparser.hpp"
#include <fstream>

int main()
{   
    const auto xml = xmlParser::readXML("xml/books.xml");
    const auto& elems = xml->findAllNodes("books");
    for(const auto& node : elems)
    {
        if(node->tagType == xmlParser::TokenType::TEXT)
        {
            std::cout << node->tagName << ' ';
        }
    }

    return 0;
}