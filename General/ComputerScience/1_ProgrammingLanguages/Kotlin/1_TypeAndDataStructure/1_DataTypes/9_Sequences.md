# Sequences

A `Sequence` is a container where objects are not contained but produced while iterating.

What does that mean? Those objects are not processed until it is time to use them: that is, sequences are executed lazily. We won't get an intermediate result at the end of each step.

`Sequences` offer the same functions as `Iterable`: we can filter, map, or order the items, but under the hood,
they work differently and have a great potential for collections with large numbers of items or those requiring a lot of concatenated operations


That brings us two advantages:

- **Sequences can be infinite**: we can define a sequence by an initial value and an operation (for example), and that sequence will have infinite values.
- **They allow you to avoid intermediate steps**: unlike other collections, when a sequence performs several operations (filtering, transformation, etc.), 
these are applied in a chain to the objects one by one, without the need to create a new collection at each step.


## Creating sequences

We can create sequences in different ways.
- use the `sequenceOf()` function to obtain a sequence from the elements passed as arguments:
```kotlin
val sequenceOfStrings = sequenceOf("one", "two", "three", "four")
val sequenceOfInts = sequenceOf(1, 2, 3, 4)
```
- Using the `asSequence()` function, we can convert any collection into a sequence:
```kotlin
val listOfStrings = listOf("one", "two", "three", "four")
val sequenceOfStrings = listOfStrings.asSequence()
```
- We can use `generateSequence()`, which receives the first value `(seed)` and a function to apply to that value and constructs an infinite sequence. 
You may wonder why we might want an infinite sequence. 

We can, for example, generate values under a certain condition or simply take the elements we want from our sequence.

```kotlin
val sequenceOfEvenNumbers = generateSequence(1) { it + 1 }
    .filter { it % 2 == 0 }
    .take(5)
println(sequenceOfEvenNumbers.toList()) // [2, 4, 6, 8, 10]
```

> [!CAUTION]
> Be careful when using Sequence; if you don't limit the result, it may cause an OutOfMemoryError due to an infinite output.


Using the `sequence()` method, we can produce sequence elements one by one. Thanks to `yield()` and `yieldAll()`, we can return one or more elements (`Iterable`) and suspend the execution (wait until these elements are consumed).


```kotlin
val evenNumbersSequence = sequence {
    yield(2) // return 2 and suspend the function
    yieldAll(listOf(4, 6)) // return 4 and 6 and suspend the function
    yieldAll(generateSequence(8) { it + 2 }) // generate an infinite sequence of even numbers starting at 8
}
println(evenNumbersSequence.take(5).toList()) // [2, 4, 6, 8, 10]
```

## Sequence operations

Operations with sequences can be classified into two categories:

- **Stateless**: these operations require no state and process each element independently; they can require a small constant amount of state to process an element. Some stateless operations are `map()`, `filter()`, `take()` or `drop()`.

- **Stateful**: these operations require a large amount of state, usually proportional to the number of elements in the sequence. Some examples include all variants of `sorted()`, `distinct()` or `chunked()`.

We also have two types of operations, depending on whether they generate a new sequence or already need to calculate the result:

- **Intermediate**: when we apply the operation, the returned result is another sequence, and so you don't yet need to calculate the result from the values of the sequence, which is produced lazily. For example, `map()` or `filter()`.

- **Terminal**: it needs the values of the stream, so it will process the entire stream to get the result. Some examples are `toList()`, which returns a specific list, or `sum()`, which calculates the sum of the values in the sequence.

### Sequence processing

When we work with `Iterables` or `Sequences`, it is important that we identify if we are working lazily or eagerly
#### 1. Iterable: eager

When we work with `Iterables`, we perform all operations on all the elements. 
That is, we work in a horizontal or eager way. 

> [!WARNING]
> It means that each and every operation is performed on each of the elements even if they are not subsequently necessary.
> At each step, a new collection is created. 

> [!TIP]
> We use that when working with smaller lists or when we do not have many chained operations.

```kotlin
val withIterator = (1..10)
    .filter { print("Filter: $it, "); it % 2 == 0 } // filter out the odd numbers
    .map { print("Mapping: $it, "); it * 2 } // multiply the remaining numbers by 2
    .take(3) // take the first 3 numbers
println()

// Filter: 1, Filter: 2, Filter: 3, Filter: 4, Filter: 5, Filter: 6, Filter: 7, Filter: 8, Filter: 9, Filter: 10,
// Mapping: 2, Mapping: 4, Mapping: 6, Mapping: 8, Mapping: 10,
// Take: 4, Take: 8, Take: 12,

println(withIterator) // [4, 8, 12]
```

In this example, we filtered all the elements to get only the even numbers and received a new collection with the filtered elements. 
Then, we map the new collection by multiplying each element by 2.
Finally, we take the first 3 numbers. Therefore, **we have performed a total of 10 filtering operations, 5 mapping operations, and 3 takes. That is, a total of 18 operations.**

#### 2. Sequence: lazy

When we work with sequences, methods are called only when building the result list. 
That is, we work in a vertical or lazy way. 

> [!NOTE]
> We perform each operation after the terminal operation has been called. 
> The entire chain of operations on each element is processed. 
There are no intermediate collections involved.

> [!TIP]
> That is suitable for collections with many elements or where we perform many chained operations.

```kotlin
val withSequence = (1..10).asSequence()
    .filter { print("Filter: $it, "); it % 2 == 0 } // filter out the odd numbers
    .map { print("Mapping: $it, "); it * 2 } // multiply the remaining numbers by 2
    .take(3) // take the first 3 numbers
    .toList() // convert the sequence into a list
println()

// Filter: 1,
// Filter: 2, Mapping: 2, Take: 4
// Filter: 3, 
// Filter: 4, Mapping: 4, Take: 8
// Filter: 5,
// Filter: 6, Mapping: 6, Take: 12

println(withSequence) // [4, 8, 12]
```
In this example, we take items element by element and perform all the operations (filter, map, and take) on each of them, one by one. 
Therefore, we have performed a total of 6 filtering operations, 3 mapping operations, and 3 taking operation. That is, a total of 12 operations.