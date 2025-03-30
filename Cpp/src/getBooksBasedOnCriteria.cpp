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

    const auto xml = xmlParser::readXML("public/xml/books.xml");

    const auto &[a, b] = convertXPathStatement(argv[1]);

    xmlParser::nodeFilter filter{a, [&](std::string_view name)
                                 {
                                     return b == name;
                                 }};

    const std::string toFind = "book";

    const auto &elems = xml->findAllNodes(toFind, filter);
    std::ostringstream output;
    output << "[\n";
    output << "{\n";

    for (const auto &node : elems | std::ranges::views::drop(1))
    {

        switch (node->tagType)
        {

        case xmlParser::TokenType::TAG_OPEN:
        {
            if (node->tagName == toFind)
            {
                output << ",\n{\n";
            }
            else
            {

                output << "\"" << node->tagName << "\": ";
            }

            break;
        }
        case xmlParser::TokenType::META:
        case xmlParser::TokenType::TEXT:
        {
            output << "\"" << node->tagName << "\",\n";
            break;
        }

        case xmlParser::TokenType::TAG_CLOSE:
        {
            if (node->tagName == '/' + toFind)
            {
                output.seekp(-2, std::ios_base::end);
                output << "\n}";
            }
            break;
        }
        }
    }

    output << ']';
    if (output.str().size() == 5)
    {
        std::cout << "[]";
    }
    else
    {
        std::cout << output.str();
    }
}