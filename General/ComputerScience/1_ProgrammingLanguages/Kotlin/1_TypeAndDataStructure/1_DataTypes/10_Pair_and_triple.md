# Pair and Triple


What if we want to return several values of different types? Kotlin offers us two special classes that help us handle this situation: Pair and Triple. Let's see how they work.


## Pair

Pair is a simple Kotlin datatype to store two values with the same or different types in a single instance. There doesn't need to be any relationship between the two values. 

```kotlin
val pair = Pair(1, "one")
println(pair) // (1, one)
```

We can use the infix function to to create a new Pair object:

```kotlin
val pair = 1 to "one"
println(pair) // (1, one)
```
## How to work with Pair

To work with the values, we can use **first** and **second** properties or the `componentN` method to extract the values from a Pair. The N value of `componentN` stands for the number of the component; for example, `component1` represents the first property or value of a Pair.

```kotlin
val pairOne = Pair("Hi", "I am a Pair")
val pairTwo = "Hi" to "I am another Pair"

// Properties
println(pairOne.first) // Hi
println(pairOne.second) // I am a Pair

// Methods
println(pairTwo.component1()) // Hi
println(pairTwo.component2()) // I am another Pair
```

Besides, we can use the `copy()` method to copy `Pair` objects and change their properties using the name of the parameter

> [!WARNING]
> The properties of a `Pair` are immutable, read-only. 
> You must create a new `Pair` to change the values, or use the `copy` function to create a new Pair and assign it whatever values you want based on a previous object.

```kotlin
val pair = Pair("marks", listOf(8.0, 9.0, 10.0))
val other = pair.copy("other")
val grades = pair.copy(second = listOf(9.0, 7.0, 8.5))
val myCopy = pair.copy(first = "other", second = listOf(1.0, 2.0, 3.0))
println(pair) // (marks, [8.0, 9.0, 10.0])
println(other) // (other, [8.0, 9.0, 10.0])
println(grades) // (marks, [9.0, 7.0, 8.5])
println(myCopy) // (other, [1.0, 2.0, 3.0])
```

## Triple

`Triple`, like `Pair`, is a simple Kotlin datatype that represents a triad of values with the same or different types in a single instance.

```kotlin
val triple = Triple(1, "A", true)
println(triple)
```

### How to work with Triple

To work with the values, we can use **first**, **second**, and **third** properties or the `componentN` method to extract the values. The N value of `componentN` stands for the number of the component; for example, component1 represents the first property or value of a `Triple`.


Like in the case of `Pair`, with the `copy()` method you can create a new Triple based on another Triple or change some properties. You must preserve the order of properties. 

> [!WARNING]
> the properties of a Triple are immutable, read-only. 
> You must create a new Triple to change the values, or use the copy function to create a new Triple and assign it whatever values you want based on a previous object.

