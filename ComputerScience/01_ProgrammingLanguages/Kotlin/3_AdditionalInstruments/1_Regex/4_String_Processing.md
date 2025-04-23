# String processing with Regexps

## Regexps and split()

The definition looks as follows:

```kotlin
fun CharSequence.split(
    regex: Regex,
    limit: Int = 0
): List
```

-  The `regex` argument is responsible for the regular expression which defines the delimiter
- and `limit` sets the maximum number of substrings to return. **Zero by default means no limit is set**

Example We split an American phone number into its country code, area code, central office code, and other remaining digits:

```kotlin
val number = "+1-213-345-6789"
val parts = number.split("-") // {"+1", "213", "345", "6789"}
```

Now let's make the previously considered problem more complex. There may be parentheses in the number. Or there may be none. We need to cover both of these cases.

**This is where regular expressions help us**! Let's compose a regular expression that will match either the separator `"-"`, or `"-("`, or `")-"`. We will use `toRegex()` to create a regular expression from a string.

```kotlin
val regex = "(-\\(|\\)-|-)".toRegex()
val number = "+1-213-345-6789"
val brackets = "+1-(213)-345-6789"
// splitting all substrings in number with brackets
val splitBrackets = brackets.split(regex) // {"+1", "213", "345", "6789"}
// splitting only two substring
val splitFirstBrackets = number.split(regex, 2) // {"+1", "213-345-6789"}
// splitting all substrings in number without brackets
val splitNumber = number.split(regex) // {"+1", "213", "345", "6789"}
```

## Regexps and replace()

Let's look at the overload of `replace()` for regular expressions:

```kotlin
fun CharSequence.replace(
    regex: Regex,
    replacement: String
): String
```

As arguments, it accepts `regex`, which searches for replaceable parts in the text, and the `string` with which they will be replaced.

example :

```kotlin
val withDigits = "The first test flight of Falcon 9 was on June 4, 2010, " +
        "from Cape Canaveral, Florida, and the first resupply mission " +
        "to the ISS was made on October 7, 2012."
val processedString = withDigits.replace("\\d+".toRegex(), "[digits]")
println(processedString)
```
result:
```bash
The first test flight of Falcon [digits] was on June [digits], [digits], from Cape Canaveral, Florida, and the first resupply mission to the ISS was made on October [digits], [digits].
```
## find() and findAll()

The `find()` function is used to find the **first match** of a regular expression in the input. It searches from the start index of the input string.

```kotlin
val regex = """[+]?[(]?[0-9]{1,4}[)]?[-0-9]*""".toRegex() // phone number template
val matchResult = regex.find("Her phone number is +1-234-567-89-01. You can also call the second one: +1-111-568-01-01")!!
print(matchResult.value) // +1-234-567-89-01
```

> [!WARNING]
> Note that we care about null safety. The text may not contain matches at all and the result of find() is String? so you should use the `!!` operator or the Elvis operator.

The `findAll()` function is required if you want to find **all matches**. It returns all suitable substrings at once:

```kotlin
val regex = """\d{4}-\d{2}-\d{2}""".toRegex() // date template in format YYYY-MM-DD 
val matchResult =
    regex.findAll("Harry was born 1980-07-31 in the Godric's Hollow."
                  + "In 1997-12-24, on Christmas Eve, he returned there" 
                  + "for the legendary Gryffindor sword")
for (matches in matchResult) println(matches.value)
//1980-07-31
//1997-12-24
```
