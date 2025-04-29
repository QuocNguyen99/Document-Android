# Random

## Types of random numbers

You can set some restrictions for your random number by choosing a specific type. Everything you need for this purpose is located in the `kotlin.random` package. Take a look at the code snippet below:

```kotlin
fun main() {
    // generates an integer value between Int.MIN_VALUE and Int.MAX_VALUE (inclusive)
    println( Random.nextInt() ) 
    // generates a long value between Long.MIN_VALUE and Long.MAX_VALUE (inclusive).
    println( Random.nextLong() ) 
    // generates a float value between 0 (inclusive) and 1.0 (exclusive)
    println( Random.nextFloat() )
    // generates a double value between 0 (inclusive) and 1.0 (exclusive)
    println( Random.nextDouble() )
    // same thing one more time
    println( Random.nextDouble() )
}
```

Notice that if you run it again, the numbers will be different

## Custom ranges

we can specify them explicitly:

```kotlin
// generates a non-negative integer value less than 100 
Random.nextInt(100) 
// generates an integer value between 1 (inclusive) and 100 (exclusive)
Random.nextInt(1, 100) 

// generates a non-negative long value less than 100
Random.nextLong(100)
// generates a long value between 1 (inclusive) and 100 (exclusive)
Random.nextLong(1, 100) 
 
// generates a non-negative double value less than 5.0 
Random.nextDouble(5.0) 
// generates a double value between 0.0 (inclusive) and 5.0 (exclusive)
Random.nextDouble(0.0, 5.0) 
```

## Pseudorandom numbers and seeding

We can calculate them all if we know the initial value and the algorithm of the sequence.

That initial value is called a **seed**.

It is guaranteed that the same seed produces the same sequence if the same Kotlin runtime version is used because the algorithm is the same

```kotlin
val randomGenerator42 = Random(42) // the generator takes the seed
for (i in 0..5) {
    randomGenerator42.nextInt(100)
}
//this code will always generate the same six numbers — 33, 40, 41, 2, 41, 32
```
