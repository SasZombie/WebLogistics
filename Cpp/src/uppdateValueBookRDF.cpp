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

    std::cout << argv[1] << argv[2] << argv[3] << '\n';

    const auto xml = xmlParser::readXML("public/xml/scenarioBooks.rdf");
   
    xmlParser::nodeFilter f1{argv[1], [&](std::string_view name){
        return name == argv[2];
    }};
    
    auto node = xml->findNode(argv[1], f1);

    if(node)
    {
        node->nodes[0]->tagName = argv[3];
        xmlParser::writeXML("public/xml/scenarioBooks.rdf", xml);
    }
    else
    {
        std::cerr << "Cannot find specified field\n";
        return 1;
    }

}