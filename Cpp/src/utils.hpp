#pragma once
#include <tuple>
#include <memory>
#include <string>
#include "xmlParser/xmlparser.hpp"

void toJson(const std::vector<std::shared_ptr<xmlParser::xmlNode>> &elems, const std::string &toFind) noexcept;
std::tuple<std::string, std::string> convertXPathStatement(std::string_view xPath) noexcept;