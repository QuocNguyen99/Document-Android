# Named arguments

## Improving code readability

We can declare standard variables and pass them on, but sometimes you have to work with literals, not variables. Named arguments can make our code more readable.

```kotlin
val amount = calcEndDayAmount(
    startAmount = 1000,
    ticketPrice = 10,
    soldTickets = 500
) 
```
## Reordering arguments

You can change the order of arguments in a function call with the help of named arguments. All you need to do is to specify the names in any order you want:

```kotlin
val amount = calcEndDayAmount(
    ticketPrice = 10,
    soldTickets = 500,
    startAmount = 1000
)
```
## Named and positional arguments

You can also call a function with named and regular (positional) arguments, as long as named arguments are placed after positional ones:

```kotlin
calcEndDayAmount(1000, ticketPrice = 10, soldTickets = 500)  // 6000
```

Kotlin 1.4 or later allows you to use positional arguments after named arguments, but you need to maintain their order. For example:

```kotlin
calcEndDayAmount(ticketPrice = 10, 500, 1000)   // Incorrect invocation!
calcEndDayAmount(startAmount = 1000, 10, 500)   // OK


calcEndDayAmount(soldTickets = 500, ticketPrice = 10, startAmount = 500) // OK
calcEndDayAmount(soldTickets = 500, ticketPrice = 10, 500)  // Incorrect invocation!
```

## Named arguments and default values

The default values for function parameters may or may not be constant. They can also be another named argument or a function.

```kotlin
fun sum2(a: Int, b: Int = a) = a + b
 
sum2(1)    // 1 + 1
sum2(2, 3) // 2 + 3
```
