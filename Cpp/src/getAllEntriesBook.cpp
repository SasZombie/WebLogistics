#include "xmlParser/xmlparser.hpp"
#include <sstream>
int main()
{
    const auto xml = xmlParser::readXML("xml/books.xml");
    const std::string toFind = "book";
    const auto &elems = xml->findAllNodes(toFind);
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

    std::cout << output.str();
}