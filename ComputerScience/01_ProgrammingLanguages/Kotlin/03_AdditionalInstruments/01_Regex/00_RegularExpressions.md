# Regexps in kotlin

Look at the [basic definition of Regexps](/General/ComputerScience/00_Fundamentals/00_Essentials/00_ProgrammingConcepts/ProgrammingTechniques/00_RegularExpressions.md) first


The first way is creating a `String` instance and then calling the method `toRegex()`, which will make a regex out of that string:

```kotlin
val string = "cat" // creating the "cat" string
val regex = string.toRegex() // creating the "cat" regex
```

Another way is calling the Regex constructor:

```kotlin
val regex = Regex("cat") // creating a "cat" regex
```
> [!TIP]
> The result will be the same: we’ll get the required regular expression. For now, we can assume that these options are equally good, and choosing one over the other is a matter of personal preference.

## Simple matching

- `Regex.matches(string: CharSequence)`. It is used for finding a **full match**, that is, the whole string has to match the pattern. and returns the boolean result.

```kotlin
val regex = Regex("cat") // creating the "cat" regex
    
val stringCat = "cat"
val stringDog = "dog"
val stringCats = "cats"

println(regex.matches(stringCat))   // true
println(regex.matches(stringDog))   // false
println(regex.matches(stringCats))  // false
```

- `Regex.matchAt(input: CharSequence, index: Int)`. This function returns the match if it's found, or `null` if it isn't. If there is a match, the returned object is of type `MatchResult`, so we can access the matched `String` using the `value` property. Here is an example:

```kotlin
val regex = Regex("cat")
val stringCat = "The cat is eating."
    
println(regex.matchAt(stringCat, 4)?.value) // cat
println(regex.matchAt(stringCat, 5)?.value) // null
```
