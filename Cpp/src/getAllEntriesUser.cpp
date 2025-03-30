#include "xmlParser/xmlparser.hpp"
#include "utils.hpp"
#include <sstream>
int main()
{
    const auto xml = xmlParser::readXML("public/xml/users.xml");
    const std::string toFind = "user";
    const auto &elems = xml->findAllNodes(toFind);
    toJson(elems, toFind);
}