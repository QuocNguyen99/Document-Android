# Regular expression

Manipulating text data is quite a popular task in programming as well as in real life. For example, we often may need to analyze a text, find all specific strings in a file, and so on. Processing text data can be quite a challenging problem. That's why there is a special tool called regular expressions that makes it easier and faster.

## Definition

A **regular expression** (regex or regexp for short) is a sequence of characters that describes a common pattern for a set of strings. Such patterns can be used to **search, edit, and manipulate texts**. They can either check if a whole string or its substring matches the given pattern or replace the substring with another one.


**Regexps** may be regarded as a kind of sublanguage that most programming languages support, but there are some differences in syntax called "**flavors**". In this topic, we will consider **regexps** in isolation from programming languages to understand the general idea.


you can visit the [regexp site](https://regex101.com/) to play around with regular expressions from our examples. Choose **PCRE** as the flavor. It means **P**erl **C**ompatible **R**egular **E**xpressions which are the most common standard in practice.

The real power of regular expressions comes when you start using special metacharacters called **wildcards**. They allow you to define a pattern, so you can match strings that do not necessarily contain an identical sequence of characters. You can skip some characters in a string or match different characters in the same positions, or even repeat a character several times.

## wildcards

### The dot character

The dot character `.` matches any single character including letters, digits, and so on, except for the newline character, unless it is specified.

### The question mark

The question mark `?` is a special character that means “the preceding character or nothing". The question mark `?` signals that the character before it can occur once or zero times in a string to match the pattern. When can we use it?


