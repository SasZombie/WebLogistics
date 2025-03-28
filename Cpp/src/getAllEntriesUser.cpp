#include <iostream>
#include "xmlParser/xmlparser.hpp"
#include <fstream>

int main()
{   
    const auto xml = xmlParser::readXML("xml/users.xml");
    const auto& elems = xml->findAllNodes("users");
    for(const auto& node : elems)
    {
        if(node->tagType == xmlParser::TokenType::TEXT)
        {
            std::cout << node->tagName << ' ';
        }
    }
}