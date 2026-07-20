
# Aggregate operations on collections
 
It is time to learn to obtain values based on the content of a collection, for example, the maximum value, the average value, an object with the maximum value of a property, etc.
 
## Basic aggregate function
 
When we work with collections, we have a series of methods to obtain values based on the collection content and get additional information about the content. These methods are known as "aggregation methods":
 
- `minOrNull()` returns the smallest element of a collection or null on an empty collection.
 
- `maxOrNull()` returns the largest element of a collection or null on an empty collection.
 
- `average()` returns the average value of the elements in a collection with number values.
 
- `sum()` returns the sum of all elements in a collection with number values.
 
- `count()` returns the number of elements in a collection.
 

> [!CAUTION]
>  sum() and average() methods only work with numbers, and if the collection is of a different data type, they will throw an exception.

## Aggregate with selector function
 
Sometimes, we need to specify which value we want to obtain with an aggregate method. In Kotlin, we have special methods to perform these tasks using a **selector function**. They are:
 
 
- `minByOrNull()` with a selector function, returns the element with the smallest value.
 
- `maxByOrNull()` with a selector function, returns the element with the largest value.
 
- `minOfOrNull()` with a selector function, returns the smallest return value of the selector itself. 
 
- `maxOfOrNull()` with a selector function, returns the largest return value of the selector itself.
 
- `sumOf()` with a selector function, returns the sum of its application to all collection elements.
 
Alternatively, we can also use `minBy()`/`maxBy()` and `maxOf()`/`minOf()` to perform the same tasks, but they throw a `NoSuchElementException` on empty collections.

> [!TIP]
> Also, you can use predicates to find the max or min elements.
 
 
```kotlin
fun main() {
    val words = listOf("anne", "michael", "caroline", "dimitry", "emilio")
 
    // Count
    println(words.count()) // 5
    // maxByOrNull/minByOrNull
    println(words.maxByOrNull { it.length }) // caroline
    println(words.minByOrNull { it.length }) // anne
    //maxOfOrNull/minOfOrNull
    println(words.maxOfOrNull { it.length }) // 8
    println(words.minOfOrNull { it.length }) // 4
    // sumOf
    println(words.sumOf { it.length }) // 32
 
    // using predicates, length > 5
    println(words.count { it.length > 5 }) // 4
    println(words.maxByOrNull { it.length > 5 }) // michael
    println(words.minByOrNull { it.length > 5 }) // anne
 
    // emptyList
    val emptyWordsList = emptyList<String>()
    println(emptyWordsList.count()) // 0
    println(emptyWordsList.maxByOrNull { it.length }) // null
    println(emptyWordsList.minByOrNull { it.length }) // null
    println(emptyWordsList.maxOfOrNull { it.length }) // null
    println(emptyWordsList.minOfOrNull { it.length }) // null
    println(emptyWordsList.maxOf { it.length })  // NoSuchElementException
    println(emptyWordsList.minOf { it.length })  // NoSuchElementException
    println(emptyWordsList.maxBy { it.length })  // NoSuchElementException
    println(emptyWordsList.minBy { it.length })  // NoSuchElementException
}
```
 
**It is important to note the difference** between `maxOfOrNull`/`minOfOrNull` and `maxByOrNull`/`minByOrNull`. `maxOfOrNull`/`minOfOrNull` return the largest/smallest value among all values produced by the selector function applied to each element in the collection or null if the collection is empty.
 
```kotlin
    //maxOfOrNull/minOfOrNull
    println(words.maxOfOrNull { it.length }) // 8
    println(words.minOfOrNull { it.length }) // 4
```
 
 
Meanwhile, `maxByOrNull`/`minByOrNull` return the first element yielding the largest/smallest value of the given function or null if there are no elements
 
```kotlin
    println(words.maxByOrNull { it.length > 5 }) // michael
    println(words.minByOrNull { it.length > 5 }) // anne
```
## Aggregate with comparator
 
We can perform the same task as above using a custom comparator with a lambda and the following methods:
 
- `minWithOrNull()` returns the smallest element according to the comparator.
 
- `maxWithOrNull()` returns the largest element according to the comparator.
 
- `minOfWithOrNull()` returns the smallest selector return value according to the comparator.
 
- `maxOfWithOrNull()` returns the largest selector return value according to the comparator.
 
- `count()` returns the number of items according to the comparator.
 
These methods return `null` on empty collections. However, we also have `maxOfWith()` and `minOfWith()` to perform the same task, and they throw a `NoSuchElementException` on empty collections.

## Counting elements

One of the main tasks when working with collections is counting the elements. Obviously, we can make use of `size`. but an interesting fact is that we can also use a **predicate** to count the number of matching collection elements.

To perform this action, we can apply the `count()` method.

```kotlin
fun main() {
    val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    // number of elements
    println(numbers.size) // 10
    // number of elements
    println(numbers.count()) // 10
    // number of elements that match the condition
    println(numbers.count { it % 2 == 0 }) // 5
}
```

## Distinct elements

The `distinct()` methods returns a list with only the distinct elements in the given collection.
Also, `distinctBy()` returns a collection containing only the elements with distinct keys returned by the given selector function.

```kotlin
fun main() {

    val numberWithRepeated = listOf(1, 2, 3, 4, 5, 4, 4, 3, 1)
    val namesWithRepeated = listOf("Pablo", "John", "Jane", "John", "Jane")
    // distinct elements
    println(numberWithRepeated.distinct()) // [1, 2, 3, 4, 5]
    println(namesWithRepeated.distinct()) // [Pablo, John, Jane]
    // distinct by a condition
    println(numberWithRepeated.distinctBy { it % 2 }) // [1, 2]
    // -> 1 % 2 = 1 -> 2 % 2 = 0 -> 3 % 2 = 1 -> 4 % 2 = 0 -> 5 % 2 = 1
    println(namesWithRepeated.distinctBy { it.first() }) // [Pablo, John]
    // -> "Pablo".first() = 'P' -> "John".first() = 'J' -> "Jane".first() = 'J'
}
```


