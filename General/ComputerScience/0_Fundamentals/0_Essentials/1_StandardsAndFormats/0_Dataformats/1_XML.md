# XML

**XML (eXtensible Markup Language)** is a text-based format for storing and exchanging structured data on the Internet. In this format, the data is presented as documents with a clear and flexible structure. An XML document can be stored on the computer with the .xml extension that is often used to keep configuration files of programs.


## Tags and elements

Each XML document consists of tags and elements.

- A **tag** is a string with an assigned meaning like a book, a person or something of the sort. It is interesting that XML does not provide tags at all, but it gives developers an opportunity to invent tags independently.

- An **element** is a building block of an XML structure: it may contain text, tags, other elements and attributes.

Example:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<book>
  <title>The Three-Body Problem</title>
  <author>Liu Cixin</author>
</book>
```


The first line in the XML document is called a **prolog**:


```xml
<?xml version="1.0" encoding="UTF-8"?>
```

> [!NOTE]
> It specifies the version of the XML standard (usually 1.0) and defines the encoding (here it's UTF-8). The prolog is optional, but if it's there, it must come first in the document. Note that a prolog does not have a closing tag!

## Attributes

XML elements can possess attributes that provide additional information about the element.

The value of the attribute is always set in either double or single quotes. For example, the name of a picture can be written as follows:

```xml
<picture name="The Black Square"/>
```

## Pros and cons of XML
XML has won popularity due to its apparent advantages:

- it can be easily understood by machines and people alike;

- the format is based on international standards;

- it has a well-defined structure which facilitates the search and extraction of information;

- modern programming languages have libraries for processing XML documents automatically.

At the same time, XML has an important disadvantage. 

- Its redundant syntax causes higher storage and transportation cost. This is especially important when we need to store or transfer a large amount of data.































