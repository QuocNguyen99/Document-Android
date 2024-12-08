# Introduction to collections

   Collections are containers that support various ways to store and organize different objects and make them easily accessible. A collection usually contains a number of objects (this number may be zero) of the same type. Objects in a collection are called **elements** or **items**. 
Collections are an implementation of abstract data structures that can support the following operations:

- retrieving an element;

- removing an element;

- changing or replacing an element;

- adding a new element.


However, it is important to note that operations like adding, removing, and changing elements only apply to **mutable** collections.


## Mutability

Collections can be **mutable** or **immutable**.

Immutable collections cannot be changed. That is, they only allow those operations that do not change the elements.
Immutability can be helpful when you want to store items together without allowing them to be modified in the future.

Kotlin Standard Library provides the implementation for the basic types of collections: **list**, **set**, and **map**. All three exist in mutable and immutable variations.

Another way to check if an item is contained in a collection is to use the keyword `in`.It works just like the contains() function. Look at the example:

```kotlin
println(elem in collection)

println(collection.contains(elem))
```
## Map collection

A `Map` **is an immutable collection that holds pairs of objects** (**keys** and **values**) and supports efficiently retrieving values corresponding to each key. As you remember, immutable implies that the size and content of the collection cannot be changed once it's initialized. It's important to remember that `Map` keys are unique: in other words, a `Map` can hold only one value for each individual key.

## Test predicates: checking elements in collection

A **predicate** is a function that returns true or false based on the input. We will get true if the condition matches the predicate and false otherwise. A single predicate always checks for the same condition; different conditions are checked by different predicates.

A predicate is defined based on a lambda function: `(T) -> Boolean`. Also, a predicate can be passed as a function reference

```kotlin
val isEven: (Int) -> Boolean = { x -> x % 2 == 0 }

fun main() {
    val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    // any number is even?
    println(numbers.any { x -> x % 2 == 0 }) // true
    println(numbers.any { isEven(it) }) // true
    println(numbers.any(isEven)) // true
}
```

### Any

With a predicate, the `any()` function will return true if at least one collection element matches the predicate we defined in `any()`. 
The function can be also called without a predicate to check for emptiness.

### None

With a predicate, the `none()` function will return true if none of the collection elements matches the predicate indicated in `none()`. Like `any()`, it can also be called without a predicate to check for emptiness.

### All

The `all()` function will only return true if all elements in the collection satisfy the given predicate. A special feature of this function is that it will always return true on an empty collection; this trait is also called vacuous truth in math.

## Ordering elements in collection

### Sorting objects

In Kotlin, we have two functions: `sorted()` and `sortedDescending()` for sorting the elements of a collection in natural

```kotlin
    val numbers = listOf(3, 5, 6, 4, 1, 8, 2, 7)
    println(numbers.sorted()) // [1, 2, 3, 4, 5, 6, 7, 8]
    println(numbers.sortedDescending()) // [8, 7, 6, 5, 4, 3, 2, 1]
```

### Reverse order

We can obtain a collection in reverse order (based on the index positions) using two functions: `reversed()` and `asReversed()`

- The `reversed()` function returns a copy of the original collection in reverse index order. If you change the original collection, the changes won't affect the copy.

> [!NOTE]
> Remember in ASCII or UTF-8, the uppercase letters are assigned lower numeric codes than their corresponding lowercase letters. So, the uppercase letters come before the lowercase letters when ordered by their decimal codes.

Ex:
```kotlin
val numbers = mutableListOf(3, 5, 6, 4, 1, 8, 2, 7)
    val reversedNumbers = numbers.reversed()
    
    println(numbers) // [3, 5, 6, 4, 1, 8, 2, 7]
    println(reversedNumbers) // [7, 2, 8, 1, 4, 6, 5, 3]

    val words = listOf("racecar", "mom", "dad", "abracadabra", "MANDRAKE")
    val wordsReversed = words.reversed()
    
    println(words) // [racecar, mom, dad, abracadabra, MANDRAKE]
    println(wordsReversed) // [MANDRAKE, abracadabra, dad, mom, racecar]
```
- The `asReversed()` method returns a reference to the original collection in reverse index order. It is lighter because it does not create a new copy, but if the original collection changes, the changes are reflected in the reversed list. **So we must be careful if we work with mutable collections.**

Ex:
```kotlin
fun main() {
    val numbers = mutableListOf(3, 5, 6, 4, 1, 8, 2, 7)
    val numbersAsReversed = numbers.asReversed()
    
    println(numbers) // [3, 5, 6, 4, 1, 8, 2, 7]
    println(numbersAsReversed) // [7, 2, 8, 1, 4, 6, 5, 3]
    
    numbers.add(9)
    
    println(numbers) // [3, 5, 6, 4, 1, 8, 2, 7, 9]
    println(numbersAsReversed) // [9, 7, 2, 8, 1, 4, 6, 5, 3]

    val words = listOf("racecar", "mom", "dad", "abracadabra", "MANDRAKE")
    val wordsAsReversed = words.asReversed()
    println(words) // [racecar, mom, dad, abracadabra, MANDRAKE]
    println(wordsAsReversed) // [MANDRAKE, abracadabra, dad, mom, racecar]
}
```

### Random order

The `shuffled()` method gives you a new collection where the original items are randomly shuffled. You can use it without arguments or with a Random instance as the source of randomness.
Ex:

```kotlin
fun main() {
    val numbers = mutableListOf(3, 5, 6, 4, 1, 8, 2, 7)
    val shuffledNumbers = numbers.shuffled()

    println(numbers) // [3, 5, 6, 4, 1, 8, 2, 7]
    println(shuffledNumbers) // [5, 3, 6, 7, 1, 8, 2, 4]
    
    val words = listOf("racecar", "mom", "dad", "abracadabra", "MANDRAKE")
    val shuffledWords = words.shuffled(Random(1))

    println(words) // [racecar, mom, dad, abracadabra, MANDRAKE]
    println(shuffledWords) // [MANDRAKE, abracadabra, mom, dad, racecar]
}
```

### Custom order

To perform custom sorting of the elements in a collection and order the elements of any type in a way you like, Kotlin offers the following functions: `sortedBy()` and `sortedByDescending()`.

They take a lambda as the selector function, which maps the element or some properties of the element into comparable attributes. As a result, it returns an ordered collection following the identified natural order. `sortedBy()` returns a collection where the elements are sorted in ascending order, and `sortedByDescending()` returns a collection in descending order.

### Define new order

you can implement a custom order for non-comparable elements or properties. We can define custom sorting using the `Comparator` interface. The `Comparator` interfaces helps us to define the `compare()` method, which returns the integer result of the comparison between two values

```kotlin
  val words = listOf("peter", "anne", "michael", "caroline")

    // define a comparator for the list of words
    val wordsLengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    // Ordered list according to the comparator
    println(words.sortedWith(wordsLengthComparator)) // [anne, peter, michael, caroline]
```

### Retrieve by position

To get the element at a specific index position, you can use `elementAt()`. We can also fetch an element in an equivalent way with the `get()` function.

However, in the Kotlin world, things are easier if we use the indexed access operator `[]`, which is equivalent to the `get()` function on lists.

All of them will throw an `IndexOutOfBoundsException` if the index is not within the indicated limits (0.. size-1).

In order not to have problems with exceptions when trying to get an invalid index element, we can make use of the following safe calls:

`elementAtOrNull()`: it will return null when the index position is out of the collection bounds.

`elementAtOrElse()`: it takes a lambda function that returns the result of the lambda if the index position is out of the collection bounds.

`getOrNull()`: it is the equivalent to `elementAtOrNull()` for a list.

`getOrElse()`: it is the equivalent to `elementAtOrElse()` for a list.

`firstOrNull()`: it is used to get the first element or null if the collection is empty.

`lastOrNull()`: it is used to get the last element or null if the collection is empty.

### Retrieve by condition

Some functions allow you to get elements based on a predicate: `first()` and `last()`. You will only get the element if the predicate is true. To avoid an exception, you can use the secure calls: `firstOrNull()` and `lastOrNull()`.

### Retrieve with selector

Sometimes, it is helpful to use a selector to map the collection before getting an element. The `firstNotNullOf()` method performs the following actions: maps the collection with a selector function and returns the first non-null value in the result. However, it throws `NoSuchElementException` if there is no non-null element. To avoid that, you can use `firstNotNullOfOrNull()`.

### Random element
If You need is to obtain a random value from a collection.
We can use the `random()` function. Remember, though, that this function throws `NoSuchElementException` if the array is empty. To avoid that, you can use the safer call `randomOrNull()`, which returns null if the collection is empty.

### Check if an element exists

you can use the `contains()` method – this methods returns true if the element is found in the collection.
To check if a collection contains multiple elements, you can make use of the method `containsAll()`.

## Collections as interface

![alt text](/resources/collection_as_interface.png)

`Collection<T>` is the root for a hierarchy of immutable collections — `List` and `Set`. It provides methods like `size`, `get()`, `find()`, `filter()`, `count()`, etc.

`MutableCollections<T>` is the root for `MutableList` and `MutableSet`, and it supports adding and removing elements with the help of the following methods: `add()`, `addAll()`, `remove()`, `removeAll()`, `retainAll()`, and `drop()`.

`Collection` and `MutableCollection` inherit from `Iterable` and `MutableIterable`. So, these interfaces support all the methods available to their parents.

However, maps don't represent `Collection` or `Iterable` interfaces, though we also call them collections. It means that they have methods different from other collections. And it is logical because they contain key-value pairs — as opposed to single elements in `Set` or `List`, so we need to separate methods for them. Unfortunately, we can't use `Map` with `Collection` interfaces.


### Iterable

there are two universal interfaces in Kotlin: `Iterable` and `MutableIterable`. They provide methods for working with sequences of elements.

Classes that inherit from `Iterable` have a set of common methods: `iterator()`, `forEach()`, `contains()`, `count()`, `drop()`, `filter()`, etc.

`MutableIterable`, unlike `Iterable`, also supports removing elements during iterations. For example, `remove()` and `removeAll()`.

> [!NOTE]
> It's interesting that they both contain the method drop() which drops a certain element. But unlike remove() from MutableIterable, which really removes a certain element in a certain object, drop() returns a new object.

### Collection

There are some common methods for all collections.

- `count()` returns the number of elements that meet the conditions.

- `drop()` returns a new List of elements without n first elements.

`containsAll()` checks if the collection contains all elements from another collection and returns `true` or `false`.
- `joinToString()` returns the collection as a string with a specific delimiter.

- `find()` returns the first element which fits the pattern.

- `filter()` returns a `List` of elements that meet the conditions.

- `minus()` returns the collection without the element or elements specified in the condition.

- `random()` returns a random element of the collection.

> [!NOTE]
> Notice that drop() or minus() don’t change the original collection; instead, they create a new collection, so they also work with Collection<T>, an immutable type.

### MutableCollection

the use of `MutableCollection`. It can use all the methods from `Collection`, but it also has some specific operations.

Notice that the specific `MutableCollection` methods, unlike `drop()` or `minus()`, change the original collection. So a function with these methods will return a boolean value — `true` if the operation was successful and `false` if the operation failed.

- `addAll()` adds all elements from one collection to another.

- `add()` adds one element to a collection.

- `clear()` removes all elements from a collection.

- `remove()` removes the first occurrence of a certain element from a collection.

- `retainAll()` method leaves the unique elements in the collection — only those that are also contained in the specified collection.


## Mapping transformation

With the `map()` and `mapIndexed()` functions, we can create a new collection by applying a transformation lambda function to our source collection.

- `map()` transforms a given collection into a new one by applying a transformation lambda function to each element.
- `mapIndexed()` transforms a given collection into a new one by applying a transformation lambda function to each element and using the element index as the first argument of the lambda.

When do we need map transformations? **You need them whenever you want to get a new collection based on the elements of the original one.**

If you apply a transformation function to the elements and the transformation cannot be performed on some of them, the result for those elements is null. You can check the above example. You can avoid these results using `mapNotNull()` or `mapIndexedNotNull()`.

Why do we need these two functions? If we can't perform a mapping operation, we'll have a `null`, so our collection is `T?`. It is essential to have such operations that allow us to avoid `null` values so that our collection will be of type `T`.

You have two options to perform a transformation: transform the keys with `mapKeys()` or transform the values associated with the said keys with `mapValues()`.

### Flatten (flatten/flatMap)

The function `flatten()` returns a single list of all the elements from all collections in the given collection. It is very helpful if we have several collections and we want to get a single collection that concatenates them.

However, this function is not valid for all kinds of collections. Remember, `flatten` returns a `List` or a `sequence`.

Example:

```kotlin
    val nestedNumbers = listOf(
        listOf(1, 2, 3),
        listOf(4, 5, 6),
        listOf(7, 8, 9)
    )
    println(nestedNumbers.flatten())  // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

The function `flatMap()` takes a function that maps the elements of one collection to another and returns a list of all the values in those elements.
It is very useful if we are faced with the task of mapping **one-to-many relationships.**

Example:
```kotlin
    val nestedNumbers = listOf(
        listOf(1, 2, 3),
        listOf(4, 5, 6),
        listOf(7, 8, 9)
    )
    // FlatMap example
    println(nestedNumbers.flatMap { 
        it.map { it * 2 } }
    ) // [2, 4, 6, 8, 10, 12, 14, 16, 18]
```

## Group collection

In Kotlin, we have extension functions for grouping collection elements, and one of them is `groupBy()`.
It takes a lambda function and returns a Map grouped by keys, with the value field containing all the corresponding elements of the collection.

```kotlin
fun main() {
    val names = listOf("John", "Jane", "Mary", "Peter", "John", "Jane", "Mary", "Peter")
    
    // Grouping by the first letter of the name
    val groupedNames = names.groupBy { it.first() }
    println(groupedNames) // {J=[John, Jane, John, Jane], M=[Mary, Mary], P=[Peter, Peter]}
}
```

You can use `groupBy()` with a second lambda argument as a transformation function. 
The result is a map where the keys produced by the **keySelector** function are mapped with values, 
and each value is the result of applying the transformation function **valueTransform** to each element of the grouping.


```kotlin
fun main() {
    val names = listOf("John", "Jane", "Mary", "Peter", "John", "Jane", "Mary", "Peter")
   
    // Grouping by the length of the name and values transformed to uppercase
    val groupedNames2 = names.groupBy(keySelector = { it.length },
        valueTransform = { it.uppercase() })
    println(groupedNames2) // {4=[JOHN, JANE, MARY, JOHN, JANE, MARY], 5=[PETER, PETER]}
}
```

Sometimes when we work with collections, we want to apply an operation to all groups at the same time.
We can perform this task using `groupingBy()`.
It returns a grouping instance, which allows you to apply operations to all groups in a lazy way: 
that is, the groups are built before the operation execution
We can use this method with grouping:
- `eachCount()`
- `fold()`
- `reduce()`