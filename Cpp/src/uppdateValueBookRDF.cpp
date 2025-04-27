#include <sstream>
#include <variant>
#include <print>
#include <functional>
#include "xmlParser/xmlparser.hpp"

// What book/ what field / what it changes to
int main(int argc, const char **argv)
{
    if (argc < 4)
    {
        std::cerr << "Not enough args\n";
        return 1;
    }

    const auto xml = xmlParser::readXML("server/content/xml/scenarioBooks.rdf");

    xmlParser::nodeFilter f1{"ex:hasTitle", [&](std::string_view name)
                             {
                                 return name == argv[1];
                             }};

    auto bookNode = xml->findNode("ex:Book", f1);

    if (bookNode)
    {
        auto fieldNode = bookNode->findNode(argv[2]);
        if (fieldNode)
        {
            fieldNode->nodes[0]->tagName = argv[3];
            xmlParser::writeXML("server/content/xml/scenarioBooks.rdf", xml);
        }
        else
        {
            std::cerr << "The book does not have this field\n";
            return 1;
        }
    }
    else
    {
        std::cerr << "Cannot find specified field\n";
        return 1;
    }
}