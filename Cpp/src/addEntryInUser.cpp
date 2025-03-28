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

    std::fstream file("xml/users.xml", std::ios::in | std::ios::out | std::ios::binary);
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

    file << "\n    <user>\n"
         << "        <name>" << argv[1] << "</name>\n"
         << "        <surrname>" << argv[2] << "</surrname>\n"
         << "        <preferedTheme>" << argv[3] << "</preferedTheme>\n"
         << "        <readingLvl>" << argv[4] << "</readingLvl>\n"
         << "    </user>\n"
         << "</users>";

    file.close();
}