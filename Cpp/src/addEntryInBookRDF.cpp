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

    std::fstream file("public/xml/scenarioBooks.rdf", std::ios::in | std::ios::out | std::ios::binary);
    if (!file.is_open())
    {
        std::cerr << "Error opening file!" << '\n';
        return 1;
    }

    file.seekg(0, std::ios::end); 
    const long fileSize = file.tellg();

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

    file << "\n    <ex:Book rdf:about=\"http://example.org/books/" << removeSpaces(argv[1]) <<"\">\n"
         << "        <ex:hasTitle>" << argv[1] << "</ex:hasTitle>\n"
         << "        <ex:hasTheme1>" << argv[2] << "</ex:hasTheme1>\n"
         << "        <ex:hasTheme2>" << argv[3] << "</ex:hasTheme2>\n"
         << "        <ex:hasReadingLvl>" << argv[4] << "</ex:hasReadingLvl>\n"
         << "    </ex:Book>\n"
         << "</rdf:RDF>";

    file.close();
}
