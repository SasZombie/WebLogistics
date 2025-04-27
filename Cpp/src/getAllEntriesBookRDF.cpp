#include "xmlParser/xmlparser.hpp"
#include "utils.hpp"

#include <sstream>
int main()
{
    const auto xml = xmlParser::readXML("server/content/xml/scenarioBooks.rdf");
    const std::string toFind = "ex:Book";
    const auto &elems = xml->findAllNodes(toFind);

    toJson(elems, toFind);
}