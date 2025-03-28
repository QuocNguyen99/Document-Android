## Retrieve collection parts

### Slice

Slicing is a fundamental operation: it returns a range of items from a collection based on their indices.

```kotlin
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // retrieve items from 1 to 5 using slice and range
    println(list.slice(0..4)) // [1, 2, 3, 4, 5]
```

### Take and drop
You can indicate how many elements to return from a collection using the family of the "take" methods:

- `take()`: returns a collection with n elements from the original collection, starting from the first element. If called with a number larger than the collection size, the whole collection is returned.

- `takeLast()`: returns a collection with n elements from the original collection, starting from the last element. If called with a number larger than the collection size, the whole collection is returned.

- `takeWhile()`: returns a collection with the elements that satisfy the predicate, starting from the first element. If none of the elements match the predicate, the result is an empty collection.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // take 5 elements from the first
    println(list.take(5)) // [1, 2, 3, 4, 5]
    // take 5 elements from the last
    println(list.takeLast(5)) // [6, 7, 8, 9, 10]
    // take while the condition is true < 5
    println(list.takeWhile { it < 5 }) // [1, 2, 3, 4]
    // take last while the condition is true > 5
    println(list.takeLastWhile { it > 5 }) // [6, 7, 8, 9, 10]
}
```

Sometimes, we want to take just a specific number of elements from a collection.

- `drop()`: returns a collection containing all the elements except the first n elements. If called with a number larger than the collection size, an empty list is returned.

- `dropLast()`: returns a collection containing all the elements except the last n elements. If called with a number larger than the collection size, an empty list is returned.

- `dropWhile()`: returns a collection containing all the elements except the first elements that satisfy the given predicate. If no elements match the predicate, the result is the original collection; if all of them match the predicate, an empty list is returned.

- `dropLastWhile()`: returns a collection containing all the elements except last elements that satisfy the given predicate. If no elements match the predicate, the result is the original collection; if all of them match the predicate, an empty list is returned.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // drop 5 elements from the first
    println(list.drop(5)) // [6, 7, 8, 9, 10]
    // drop 5 elements from the last
    println(list.dropLast(5)) // [1, 2, 3, 4, 5]
    // drop while the condition is true < 5
    println(list.dropWhile { it < 5 }) // [5, 6, 7, 8, 9, 10]
    // drop last while the condition is true > 5
    println(list.dropLastWhile { it > 5 }) // [1, 2, 3, 4, 5]
}
```

### Chunked

Quite often, we need to split a collection into parts of a fixed size.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // chunked into 3
    println(list.chunked(3)) // [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
    // chunked into 3, the result transformed by applying a lambda with sum
    println(list.chunked(3) { it.sum() }) // [6, 15, 24, 10]
    // chunked into 3, the result transformed into a string
    println(list.chunked(3) { it.joinToString() }) // ["1, 2, 3", "4, 5, 6", "7, 8, 9", "10"] => print [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
```

### Windowed

You can also get all possible ranges of collection elements of a defined size. 

We use the following parameters:

- `size`: it is the number of elements in each window, that is, the size of the window.

- `step`: it is the number of elements we need to scroll between windows, by default it is 1. It represents the distance between the first elements of consecutive windows.

- `partialWindows`: it includes windows of smaller sizes at the end of the collection if you can't build a window of the specified size; by default, it is `false`. It indicates whether you want to keep partial windows at the end.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // windows of 3, default step is 1
    println(list.windowed(3))
    // [[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 6, 7], [6, 7, 8], [7, 8, 9], [8, 9, 10]]
    // windows of 3, step 3
    println(list.windowed(3, 3)) // [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    // windows of 3, step 4, partial windows is false
    println(list.windowed(3, 4, false)) // [[1, 2, 3], [5, 6, 7]]
    // windows of 3, step 4, partial windows is true
    println(list.windowed(3, 4, true)) // [[1, 2, 3], [5, 6, 7], [9, 10]]
    // windows of 3, step 4, partial windows is true, the result is transformed with sum
    println(list.windowed(3, 4, true) { it.sum() }) // [6, 18, 19]  
}
```

