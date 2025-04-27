#include <iostream>
#include <fstream>
#include <string>

static std::string removeSpaces(const std::string& str) noexcept
{
    std::string newStr;

    for(char c : str)
    {
        if(c != ' ')
        {
            newStr += c;
        }
    }

    return newStr;
}


int main(const int argc, const char **argv)
{
    if (argc < 5)
    {
        std::cerr << "Not enough Args\n";
        return 1;
    }

    std::fstream file("public/xml/scenarioUsers.rdf", std::ios::in | std::ios::out | std::ios::binary);
    if (!file.is_open())
    {
        std::cerr << "Error opening file!" << std::endl;
        return 1;
    }

    file.seekg(0, std::ios::end); 
    long fileSize = file.tellg();

    long pos = fileSize - 1;
    char ch;

    while (pos > 0)
    {
        file.seekg(pos, std::ios::beg);
        file.get(ch);
        if (ch == '\n')
            break;
        --pos;
    }

    file.seekp(pos, std::ios::beg);

    file << "\n    <ex:User rdf:about=\"http://example.org/users/" << removeSpaces(argv[1]) <<"\">\n"
         << "        <ex:hasName>" << argv[1] << "</ex:hasName>\n"
         << "        <ex:hasSurrname>" << argv[2] << "</ex:hasSurrname>\n"
         << "        <ex:hasPreferedTheme>" << argv[3] << "</ex:hasPreferedTheme>\n"
         << "        <ex:hasReadingLvl>" << argv[4] << "</ex:hasReadingLvl>\n"
         << "    </ex:User>\n"
         << "</rdf:RDF>";

    file.close();
}