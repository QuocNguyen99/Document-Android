# Null and collections

We have four cases:

```kotlin
val list = listOf<String>() //non-null collection

var nullableList: List<Int>? = listOf<Int>(1, 2, 4, 6) //nullable collection with non-nullable element

val listWithNullableElements: List<Int?> = listOf<Int?>(1, 2, 4, null, null) // collection  is non-nullable type, but the elements inside are nullable.

var absolutelyNullableList: List<Int?>? = listOf<Int?>(1, 2, 4, null, null) //  nullable collection with nullable element type
```
 
**The basic principle is**: if we can return an empty collection — it’s better than returning null and using nullable types.

## Creating non-null collections from sequences with null elements

Sometimes you have element sequences with `null`, and you need to use them to create a collection without `null`. In that case, you can use the special functions `listOfNotNull()` and `setOfNotNull()`

```kotlin
val list = listOfNotNull(1, null, 50, 404, 42, null, 42, 404) // [1, 50, 404, 42, 42, 404]
val set = setOfNotNull(1, null, 50, 404, 42, null, 42, 404) // [1, 50, 404, 42]
```
## Functions for nullable collections

Kotlin has some convenient tools for collections with nullable elements:

- The function `isNullOrEmpty()` returns true if the collection is empty or equal to `null`. In all other cases, it returns `false`.

- The function `getOrNull()` returns one element of a list or an array, but if this element doesn't exist, it returns `null` (it doesn’t work with `Set`).

- `randomOrNull()` works like the previous one: it returns null if the collection is empty and a random element in all other cases.