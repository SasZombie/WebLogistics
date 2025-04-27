<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:output method="html" indent="yes" />

    <xsl:param name="userReadingLevel" select="'Intermediate'" />
    <xsl:param name="selection" select="'book'" />

    <xsl:template match="/">
        <html>
            <head>
                <style>
                    .match { background-color: green; padding: 5px; }
                    .nomatch { background-color: yellow; padding: 5px; }
                </style>
            </head>
            <body>
                <center>
                    <strong>
                        <h1 style="font-size: 50px">Book List</h1>
                    </strong>
                    <ul>
                        <xsl:apply-templates select="books/book" />
                    </ul>
                </center>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="book">
        <xsl:variable name="bookLevel" select="normalize-space(./readingLvl)" />

        <li>
            <xsl:attribute name="class">
                <xsl:choose>
                    <xsl:when test="$bookLevel = $userReadingLevel">match</xsl:when>
                    <xsl:otherwise>nomatch</xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>

            <strong>
                <xsl:value-of select="normalize-space(title)" />
            </strong> ( <xsl:value-of
                select="normalize-space(theme1)" /> - <xsl:value-of select="normalize-space(theme2)" />
        ) [ <xsl:value-of select="$bookLevel" /> ] </li>
    </xsl:template>

</xsl:stylesheet>