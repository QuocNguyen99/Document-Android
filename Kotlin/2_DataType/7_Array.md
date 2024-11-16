# Array

You may consider an array as **a collection of elements of one type**. All elements are stored in the memory sequentially.

The collection provides one name for all elements. Once an array is created, **it cannot be changed** and You cannot change the size of an array after it has been created.. However, you can modify a stored element at any time.

## Creating an array with specified elements

Kotlin can handle many types of arrays: `IntArray`, `LongArray`, `DoubleArray`, `FloatArray`, `CharArray`, `ShortArray`, `ByteArray`, `BooleanArray`. Note that Kotlin doesn't have a default `StringArray` type.
You can store `Strings` in arrays.

To create an array of a specified type, we need to invoke a special function and pass all elements to store them together:

- `intArrayOf` creates `IntArray`;
- `charArrayOf` creates `CharArray`;
- `doubleArrayOf` creates `DoubleArray`;
- and so on.

## Creating an array of a specified size

To create an array of a certain size, we need to write its type and pass it after the type name in round brackets (the constructor):
```kotlin
val numbers = IntArray(5) // an array of 5 integer numbers
println(numbers.joinToString())
```

They are filled by the default values of the corresponding types (0 for numeric types).
You cannot change the size of an array, but you can modify the elements.

Another option is to use the Array constructor that takes the array size and the function that returns values of array elements given its index or a constant value or using a combination of the apply scope function and the `fill() `method that fills an array with the specified element.

```kotlin
val numbers = IntArray(10) { i -> i + 1 }
println("Numbers: ${numbers.joinToString()}") 
// 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
val onlyOne = IntArray(10) { 1 }
println("Only 1: ${onlyOne.joinToString()}") 
// 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
val onlyMinusOne = IntArray(10).apply { fill(-1) }
println("Only -1: ${onlyMinusOne.joinToString()}") 
// -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
```
## Comparing arrays

To compare two arrays, invoke the `contentEquals()` function of an array and pass another array as the argument.
the operators `==` and `!=` do not compare the contents of arrays, they compare only the variables that point to the same object
