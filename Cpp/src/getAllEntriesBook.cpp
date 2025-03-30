#include "xmlParser/xmlparser.hpp"
#include "utils.hpp"

#include <sstream>
int main()
{
    const auto xml = xmlParser::readXML("public/xml/books.xml");
    const std::string toFind = "book";
    const auto &elems = xml->findAllNodes(toFind);

    toJson(elems, toFind);
}