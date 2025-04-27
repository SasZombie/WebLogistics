#include "xmlParser/xmlparser.hpp"
#include "utils.hpp"
#include <sstream>
int main()
{
    const auto xml = xmlParser::readXML("server/content/xml/scenarioUsers.rdf");
    const std::string toFind = "ex:User";
    const auto &elems = xml->findAllNodes(toFind);
    toJson(elems, toFind);
}