<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    
    <!-- Output HTML -->
    <xsl:output method="html" indent="yes" />

    <!-- User's reading level (This should be passed dynamically) -->
    <xsl:param name="userReadingLevel" select="'Intermediate'" />
    <xsl:param name="selection" select="book" />

    <!-- Template for the root -->
    <xsl:template match="/">
        <html>
            <head>
                <style>
                    .match { background-color: green; padding: 5px; }
                    .nomatch { background-color: yellow; padding: 5px; }
                </style>
            </head>
            <body>
                <h2>Book List</h2>
                <ul>
                    <!-- Loop through books -->
                    <xsl:apply-templates select="books/$selection" />
                </ul>
            </body>
        </html>
    </xsl:template>

    <!-- Template for each book -->
    <xsl:template match="book">
        <xsl:variable name="bookLevel" select="normalize-space(readingLvl)" />

        <li>
            <!-- Apply background color based on the comparison of book's level and user's level -->
            <xsl:attribute name="class">
                <xsl:choose>
                    <xsl:when test="$bookLevel = $userReadingLevel">match</xsl:when>
                    <xsl:otherwise>nomatch</xsl:otherwise>
                </xsl:choose>
            </xsl:attribute>
            
            <strong><xsl:value-of select="normalize-space(title)" /></strong> 
            (<xsl:value-of select="normalize-space(theme1)" /> - 
            <xsl:value-of select="normalize-space(theme2)" />)
            [<xsl:value-of select="$bookLevel" />]
        </li>
    </xsl:template>

</xsl:stylesheet>
