#include "xmlParser/xmlparser.hpp"
#include "utils.hpp"
#include <sstream>

static std::string getSearchedField(const std::string &str, char delimiter)
{
    size_t pos = str.find(delimiter);

    if (pos != std::string::npos)
    {

        ++pos;
        if (pos < str.size())
        {
            ++pos;
        }

        return str.substr(pos);
    }

    return "";
}

int main(int argc, const char **argv)
{

    if (argc < 2)
    {
        std::cerr << "Not enough args\n";
        return -1;
    }

    const std::string xPath = argv[1];

    const auto xml = xmlParser::readXML("public/xml/books.xml");

    const std::string field = getSearchedField(xPath, ']');

    
    const auto &[a, b] = convertXPathStatement(xPath);

    xmlParser::nodeFilter filter{a, [&](std::string_view name)
                                 {
                                     return b == name;
                                 }};

    const std::string toFind = "book";

    const auto &elems = xml->findAllNodes(toFind, filter);

    for (const auto &elem : elems)
    {
        if (elem->tagName == field)
        {
            std::cout << elem->nodes[0]->tagName << ' ';
            return 0;
        }
    }

    return 1;
}