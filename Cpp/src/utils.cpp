#include "utils.hpp"
#include <sstream>
#include <algorithm>
#include <memory>
#include "xmlParser/xmlparser.hpp"

void toJson(const std::vector<std::shared_ptr<xmlParser::xmlNode>> &elems, const std::string &toFind) noexcept
{
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

std::tuple<std::string, std::string> convertXPathStatement(std::string_view xPath) noexcept
{
    size_t queryLen = xPath.size();
    size_t index = 0;
    std::string fieldName;
    std::string fieldExpectedValue;

    while (index < queryLen)
    {
        while (xPath[index] != '[')
        {
            ++index;
        }

        ++index;

        while (xPath[index] != ' ')
        {
            fieldName += xPath[index];
            ++index;
        }

        while (xPath[index] != '=')
        {
            ++index;
        }
        ++index;

        while (xPath[index] == ' ')
        {
            ++index;
        }

        while (xPath[index] != ']' || xPath[index] == ' ')
        {
            fieldExpectedValue += xPath[index];
            ++index;
        }
        if(xPath[index] == ']')
        {
            break;
        }
        ++index;
    }
    return std::make_tuple(fieldName, fieldExpectedValue);
}