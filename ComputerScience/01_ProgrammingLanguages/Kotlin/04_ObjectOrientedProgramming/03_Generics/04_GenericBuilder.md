# Generic builder

Generic builders are an advanced of type-safe builders that incorporate generics.

They allow the creation of builders that can construct objects of any given type, specified at the time of the builder's invocation.
This is particularly useful when you want to create a builder that is not tied to a specific type and can be reused across different types.

For example, you might want to create a list of different types of objects using the same building process. 
By using a generic builder, you can define the construction logic once and apply it to any type you need.

## Implementing generic builders in kotlin

We'll create a simple builder for a list of items where the type of items is not predetermined. 
Our builder will use Kotlin's DSL features to provide a clean and intuitive way to add items to the list.


```kotlin
class GenericListBuilder<T> {
    private val items = mutableListOf<T>()

    fun item(item: T) {
        items.add(item)
    }

    fun build(): List<T> = items
}

fun <T> buildList(builderAction: GenericListBuilder<T>.() -> Unit): List<T> {
    val builder = GenericListBuilder<T>()
    builder.builderAction()
    return builder.build()
}

val intList = buildList {
    item(1)
    item(2)
    item(3)
}
val stringList = buildList {
    item("one")
    item("two")
    item("three")
}
```

In this example, `GenericListBuilder` is a class with a type parameter `T`, representing the type of items in the list. 
The item method adds an element to the internal mutable list of type `T`. 
The `build` method returns an immutable list of the added items.

The `buildList` function is a higher-order function that takes a lambda with receiver, allowing us to use the `item` method inside the lambda to add elements to the list. 
We use this function to create lists of integers and strings, demonstrating the reusability of our generic builder.








