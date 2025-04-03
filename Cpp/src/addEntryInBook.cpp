#include <iostream>
#include <fstream>
#include <string>


int main(const int argc, const char **argv)
{
    if (argc < 5)
    {
        std::cerr << "Not enough Args\n";
        return 1;
    }

    std::fstream file("public/xml/books.xml", std::ios::in | std::ios::out | std::ios::binary);
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

    file << "\n    <book>\n"
         << "        <title>" << argv[1] << "</title>\n"
         << "        <theme1>" << argv[2] << "</theme1>\n"
         << "        <theme2>" << argv[3] << "</theme2>\n"
         << "        <readingLvl>" << argv[4] << "</readingLvl>\n"
         << "    </book>\n"
         << "</books>";

    file.close();
}