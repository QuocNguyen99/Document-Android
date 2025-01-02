# Currying

This concept allows you to transform a function with multiple arguments into a sequence of functions, each with a single argument. In other words, it breaks down a function that takes multiple arguments into a series of functions that take one argument.

```kotlin
fun  ((T1, T2) -> R).curried() = 
    fun(p1: T1) = fun(p2: T2) = this(p1, p2)
```


In this example, we have created a curried function. The function `curried()` takes a function with two parameters and returns a function that takes one parameter and returns another function that also takes one parameter. Instead of taking all its arguments at once, the function takes the first one and returns a new function that takes the second one.

## Applying

To understand how currying can be applied, consider a function that calculates the total price of items with a certain discount This function takes two arguments: the original price and the discount rate.

```kotlin
fun calculateTotalPrice(price: Double, discount: Double): Double {
    return price - (price * discount / 100)
}
```
We can use the currying technique to transform this function into a series of functions, each taking one argument.

```kotlin
fun calculateTotalPrice(price: Double): (Double) -> Double {
    return { discount -> price - (price * discount / 100) }
}
```

Now, we can create a new function for a specific discount rate. This new function takes the original price as an argument and returns the discounted price.

```kotlin
val calculateWith30PercentOff = calculateTotalPrice(100.0)
println(calculateWith30PercentOff(30.0))  // Output: 70.0
```

## Currying in action

Now let's look at a more complex example to understand how currying can be used in real-world applications. Suppose we are working on software for a delivery service, and we have a function that calculates the delivery cost based on the weight of the package, the distance to the destination, and the type of delivery (standard or express).

```kotlin
fun calculateDeliveryCost(weight: Double, distance: Double, type: String): Double {
    val baseCost = if (type == "standard") 5.0 else 10.0
    val weightCost = weight * 0.5
    val distanceCost = distance * 0.3
    return baseCost + weightCost + distanceCost
}
```

This function works fine, but it can be improved using currying. We can curry this function so that we can create new functions for specific `weights`, `distances`, and `delivery` types.

```kotlin
fun calculateDeliveryCost(weight: Double): (Double) -> (String) -> Double {
    return { distance -> { type -> 
        val baseCost = if (type == "standard") 5.0 else 10.0
        val weightCost = weight * 0.5
        val distanceCost = distance * 0.3
        baseCost + weightCost + distanceCost
    }}
}
```

Now, we can create new functions for specific weights and distances

```kotlin
val calculateFor10KgAnd50Km = calculateDeliveryCost(10.0)(50.0)
println(calculateFor10KgAnd50Km("standard")) // Output: 35.0
println(calculateFor10KgAnd50Km("express"))  // Output: 40.0
```

## Deep dive

Currying provides several advantages that can significantly enhance your Kotlin code:

- **Code Reusability**: Currying allows you to create new functions from existing ones with some arguments pre-filled. This can help to increase code reusability. You can generate as many specific functions as you need from a general function, each tailored to a specific use case.

- **Delayed Computation**: Currying allows you to delay computation. You can create a function with some arguments and execute it later with the remaining arguments. This is especially useful in scenarios where computations are expensive and you want to spread them over time.

- **Higher-order Functions**: Currying allows you to create higher-order functions. It enables you to pass functions as parameters and return them as results. Higher-order functions are a cornerstone of functional programming, and currying provides a straightforward way to create them.

- **Function Composition**: Currying can facilitate function composition. In this technique, you combine simple functions to build more complex ones. With currying, you can easily compose functions that enhance readability and maintainability.