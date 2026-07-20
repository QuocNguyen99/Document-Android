# MatchResult and capturing groups

## The MatchResult class

This class gives you detailed information about the outcome of a match operation. For instance, if you find a match in a string with the `find()`, `matchAt()`, `matchEntire()`and `findAll()` function, it gives you a `MatchResult` object, or `null` if there is no match.


```kotlin
val regex: Regex = """a(\d+)b""".toRegex()
val input = "a123b a4bc"

val firstMatch: MatchResult? = regex.find(input)
```

The `MatchResult` class has these properties and method:

- **value**: This property holds the sequence the regular expression matched. It's a `String` that shows the whole match.

```kotlin
println(firstMatch?.value) // prints: a123b
```

- **range**: This property tells you the range of indices where the match happened. It's an `IntRange` instance, which is a range of integers.

```kotlin
println(firstMatch?.range) // prints: 0..4
```
- **groups**: This property gives you a `MatchGroupCollection`, which is like a map and lets you get to the captured groups. The first element in the collection is the whole match, and the ones after show the captured groups one by one. Each group is a MatchGroup with a `value` for the matched sequence and a `range` for the indices range.

```kotlin
println(firstMatch?.groups)
// prints: [MatchGroup(value=a123b, range=0..4), MatchGroup(value=123, range=1..3)]
```

- **groupValues**: This property gets you a list of strings. **The first one is the whole match, and the others are the captured groups**. If a group captured nothing (for example, if it's optional and didn't appear in the input), its value in the list is an empty string.

```kotlin
println(firstMatch?.groupValues) // prints: [a123b, 123]
```

- **destructured**: This property lets you unpack the group values. It returns a `Destructured` object, which has component functions corresponding to group values. You can use these when you work with group values.

> [!CAUTION]
> The number of variables on the left-hand side of the assignment must match the number of capturing groups in the regex pattern.

Example:
```kotlin
val regex = """(\d{4})-(\d{2})-(\d{2})""".toRegex()
val input = "2024-01-01"

val secondMatch = regex.find(input)!!

val (year, month, day) = secondMatch.destructured

println("Year: $year")   // Year: 2024
println("Month: $month") // Month: 01
println("Day: $day")     // Day: 01
```

- **next()**: Use this to find the next match after the current one in the input. If there are no more matches, it returns `null`.

the difference between `findAll()` with the Regex class and `next()` with the `MatchResult` class?. While `findAll()` gives you all matches to look at, the `next()` method lets you control the process better, which might save memory and computational effort.

```kotlin
println(firstMatch?.next()?.groupValues) // prints: [a4b, 4]
```

## Practical example

We will write a program that finds all the numbers in a string and raises them by 10%, rounding the result to two decimal places:

```kotlin
fun main() {
    // Create a regular expression to match numbers with optional decimal point
    val regex = Regex("""\d+(\.\d+)?""")

    // Define a string with number information
    val input = "The price is $12.99 for the first item, and $9.99 for each additional item."

    // Create a string builder to store the modified string
    val output = StringBuilder()

    // Find the first match in the input string
    var match = regex.find(input)

    // Keep track of the last index of the previous match
    var lastIndex = 0

    // Loop until there are no more matches
    while (match != null) {
        // Append the substring from the input string before the current match
        output.append(input.substring(lastIndex, match.range.first))

        // Convert the matched value to a double and multiply it by 1.1
        val number = match.value.toDouble()
        val increasedNumber = number * 1.1

        // Round the increased number to two decimal places and append it to the output
        output.append("%.2f".format(increasedNumber))

        // Update the last index to the end of the current match
        lastIndex = match.range.last + 1

        // Find the next match using the next() method
        match = match.next()
    }

    // Append the remaining substring from the input string after the last match
    output.append(input.substring(lastIndex))

    // Print the output string
    println(output)
}
```

## Non-capturing groups

Usually, every group in a regular expression is a **capturing group**, meaning you can access each group separately after a match, using methods like `groups` and `groupValues`. 

But regular expressions also let you decide which groups to capture using the optional `?` quantifier. To skip capturing this group, use the syntax `(?:pattern)`, which tells the regex engine to group without capturing.

**Non-capturing** groups are handy when you need to structure your patterns with groups but don't want to capture their contents.


let's look at the regex from our earlier practice:

```kotlin
val regex = Regex("""\d+(\.\d+)?""")
// Groups: [12.99, .99]
// Groups: [9.99, .99]
```
By changing our regex pattern to:
```kotlin
val regex = Regex("""\d+(?:\.\d+)?""")
//Groups: [12.99]
// Groups: [9.99]
```

This output only includes the full match and leaves out the unnecessary captured group.

## Named capturing groups

**Named capturing groups** make your regex patterns easier to read and manage, making it simpler to refer to parts of the pattern.

To make a named capturing group, you use the syntax `(?<name>pattern)`, where `name` is the label for the group and `pattern` is the sequence of characters to match.

Example:

```kotlin
val regex = """(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})""".toRegex()
val input = "2023-12-31"

val matchResult = regex.find(input)!!

println(matchResult.groups["year"]?.value)   // prints: 2023
println(matchResult.groups["month"]?.value)  // prints: 12
println(matchResult.groups["day"]?.value)    // prints: 31
```



