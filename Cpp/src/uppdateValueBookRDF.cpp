#include <sstream>
#include <variant>
#include <print>
#include <functional>
#include "xmlParser/xmlparser.hpp"

//What/ where / what canges
int main(int argc, const char** argv)
{
    if(argc < 4)
    {
        std::cerr << "Not enough args\n";
        return 1;
    }

    const auto xml = xmlParser::readXML("scenarioBooks.rdf");
   
    xmlParser::nodeFilter f1{argv[1], [&](std::string_view name){
        return name == argv[2];
    }};
    
    auto node = xml->findNode(argv[2], f1);

    if(node)
    {
        node->tagName = argv[3];
        xmlParser::writeXML("scenarioBooks.rdf", xml);
    }
    else
    {
        std::cerr << "Cannot find specified field\n";
        return 1;
    }

}