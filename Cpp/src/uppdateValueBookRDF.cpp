#include <sstream>
#include <variant>
#include <print>
#include <functional>
#include "xmlParser/xmlparser.hpp"

int main()
{
    const auto xml = xmlParser::readXML("bookRdf.rdf");
   
    xmlParser::nodeFilter f1{"ex:hasTitle", [](std::string_view name){
        return name == "Dune";
    }};
    
    auto node = xml->findNode("Dune", f1);

    if(node)
    {
        std::cout << "NOde = " << node->tagName;
        node->tagName = "NEWWWW DEWWWN";
    }else
    {
        std::cout << "NULLPTR";
    }


    xmlParser::writeXML("bookRdf.rdf", xml);
}