## Fold and reduce

With `fold()` and `reduce()`, we can operate on the elements of a collection as a sequence and return the accumulated result.

- `fold()` takes an initial value, uses it as the accumulated value on the first step, and applies the operation from left to right combining the current accumulated value with each element. **the initial value will be the default value with an empty collection. We can change the type of the return value thanks to the implementation of this function.**

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)
    val sum = list.fold(0) { acc, i ->
        println("acc: $acc, i: $i, acc + i: ${acc + i}")
        acc + i
    }
    println(sum) // 15
    val product = list.fold(1) { acc, i ->
        println("acc: $acc, i: $i, acc * i: ${acc * i}")
        acc * i
    }
    println(product)

    // empty list
    val emptyList = listOf<Int>()

    // fold uses the parameter as the initial value of the accumulator
    val sum1 = emptyList.fold(0) { acc, i ->
        println("acc: $acc, i: $i, acc + i: ${acc + i}") // this line will not run
        acc + i
    }
    println(sum1) // 0


    val string = list.fold(StringBuilder()) { acc, s ->
        acc.append(s)
    }
    println(string) //12345
}
```
Output
```bash
acc: 0, i: 1, acc + i: 1
acc: 1, i: 2, acc + i: 3
acc: 3, i: 3, acc + i: 6
acc: 6, i: 4, acc + i: 10
acc: 10, i: 5, acc + i: 15
15
acc: 1, i: 1, acc * i: 1
acc: 1, i: 2, acc * i: 2
acc: 2, i: 3, acc * i: 6
acc: 6, i: 4, acc * i: 24
acc: 24, i: 5, acc * i: 120
120
0
12345
```

- `reduce()` transforms a given collection into a single result. It takes a lambda function operator to combine a pair of elements into an accumulated value. Then it loops through the collection and performs the operation step by step combining the accumulated value with the next element in the collection.

```kotlin
// reduce uses the first element as the initial value of the accumulator
val sum = list.reduce { acc, i ->
    println("acc: $acc, i: $i, acc + i: ${acc + i}")
    acc + i
}
println(sum) // 15
product = list.reduce { acc, i ->
    println("acc: $acc, i: $i, acc * i: ${acc * i}")
    acc * i
}
println(product) // 120
```
Output
```bash
acc: 1, i: 2, acc + i: 3
acc: 3, i: 3, acc + i: 6
acc: 6, i: 4, acc + i: 10
acc: 10, i: 5, acc + i: 15
15
acc: 1, i: 2, acc * i: 2
acc: 2, i: 3, acc * i: 6
acc: 6, i: 4, acc * i: 24
acc: 24, i: 5, acc * i: 120
120
```


`reduce` **performs one step less because the accumulator is the first element.**. `reduce` will throw an exception if performed on an empty collection. The result of a reduce operation will always be of the same type (or a super type) as the data that is being reduced – we cannot change it to another type.


```kotlin
    // empty list
    val emptyList = listOf<Int>()

    // reduce uses the first element as the initial value of the accumulator
    // Throws exception: Empty collection can't be reduced.
    val sum = emptyList.reduce { acc, i ->
        println("acc: $acc, i: $i, acc + i: ${acc + i}")
        acc + i
     }
     println(sum)

    // with reduce you can't change the type of the accumulator. Compiler error
    val string2 = list2.reduce(StringBuilder()) { acc, s ->
       acc.append(s)
    }
```

### Reverse order

Sometimes, we need to perform the actions in the reverse order. We can use `foldRight()` and `reduceRight()` to apply operations from right to left. However, remember that the operation arguments change their order: first goes the element and then the accumulated value.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)

    // foldRight, use the parameter as the initial value of the accumulator.
    // from right to left
    val sum = list.foldRight(0) { i, acc -> acc + i }
    println(sum) // 15
    product = list.foldRight(1) { i, acc -> acc * i }
    println(product) // 120
    
    // reduceRight, use the last element as the initial value of the accumulator
    // from right to left
    sum = list.reduceRight { i, acc -> acc + i }
    println(sum) // 15
    product = list.reduceRight { i, acc -> acc * i }
    println(product) // 120
}
```

### Accumulate result with indices

In some tasks, you may need to use the index to perform the calculation. You can apply operations that take element indices as parameters. Kotlin has `reduceIndexed()` and `foldIndexed()`, which use the index as the first parameter. Also, we can use `reduceRightIndexed()` and `foldRightIndexed()` to perform the action form right to left.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)
   
    // foldIndexed and FoldRightIndexed are similar to Fold and FoldRight,
    // but they have an additional parameter to indicate the index of the element to fold
    // sum of even elements
    val sum = list.foldIndexed(0) { index, acc, i ->
        if (index % 2 == 0) acc + i else acc
    }
    println(sum) // 9
    
    // product of odd elements right to left
    product = list.foldRightIndexed(1) { index, i, acc ->
        if (index % 2 == 1) acc * i else acc
    }
    println(product) // 8

    // reduceIndexed and ReduceRightIndexed are similar to Reduce and ReduceRight,
    // but they have an additional parameter to indicate the index of the element to reduce
    // sum of even elements
    var sum = list.reduceIndexed { index, acc, i ->
        if (index % 2 == 0) acc + i else acc
    }
    println(sum) // 9
    
    // product of odd elements right to left
    product = list.reduceRightIndexed { index, i, acc ->
        if (index % 2 == 1) acc * i else acc
    }
    println(product) // 40
}
```

### Work with nullable collections

**All the reduce operations that we have presented throw an exception on empty collections**. If we want to get null, we must use the same methods but ending with `*OrNull()`: `reduceOrNull()`, `reduceRightOrNull()`, `reduceIndexedOrNull()`, and `reduceRightIndexedOrNull()`.

```kotlin
fun main() {
    
    // fold and reduce with empty collections
    val sum = emptyList<Int>().fold(0) { acc, i -> acc + i }
    println(sum) // 0
    
    // sum = emptyList<Int>().reduce { acc, i -> acc + i } // exception
    // println(sum)
    sum = emptyList<Int>().reduceOrNull { acc, i -> acc + i } ?: 0 // is null
    println(sum) // 0

}
```

### Accumulate with intermediate results

Finally, in some cases it is interesting to save the intermediate value of the accumulator. For this purpose, we have `runningFold()`, `runningReduce()`, `runningFoldIndexed()`, and `runningReduceIndexed()`, which return a list with the intermediate results.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)
  
    println("runningFold and runningReduce")
    
    // runningFold and RunningReduce are similar to Fold and Reduce,
    // but they return a list of intermediate results
    val runningSum = list.runningFold(0) { acc, i -> acc + i }
    println(runningSum) // [0, 1, 3, 6, 10, 15]
}
```

