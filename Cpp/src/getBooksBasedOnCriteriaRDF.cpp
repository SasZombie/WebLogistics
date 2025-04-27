#include "xmlParser/xmlparser.hpp"
#include "utils.hpp"
#include <sstream>

int main(int argc, const char **argv)
{

    if (argc < 2)
    {
        std::cerr << "Not enough args\n";
        return -1;
    }

    const auto xml = xmlParser::readXML("server/content/xml/scenarioBooks.rdf");

    const auto &[a, b] = convertXPathStatement(argv[1]);

    xmlParser::nodeFilter filter{a, [&](std::string_view name)
                                 {
                                     return b == name;
                                 }};

    const std::string toFind = "ex:Book";

    const auto &elems = xml->findAllNodes(toFind, filter);
    toJson(elems, toFind);    
}