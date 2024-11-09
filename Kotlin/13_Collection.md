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
