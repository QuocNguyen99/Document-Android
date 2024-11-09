# Loop


Kotlin provides several special statements to repeat blocks of code multiple times. These statements are known as loops

## Loops: repeat statement

To use the simplest loop, write `repeat(n)` and a sequence of statements in curly braces `{...}`. `n` is an integer that determines how many times these statements are going to be repeated.


```kotlin
repeat(n) {
    // statements
}
```

> [!NOTE]
> If n is zero or a negative number, Kotlin will ignore the loop. If n is one, the statements will be executed only once.

## While loop

```kotlin
    while (i < 5) {
        println(i)
        i++
    }
```
## Do...while loop

A `do...while` loop is executed first, after that the program tests a condition.

```kotlin
do {
    // body: do something
} while (condition)
```

## For loop

This is the syntax the for loop has:
```kotlin
for (element in source) {
    // body of loop
}
```
Iterating through a range

```kotlin
for (i in 1..4) {
    println(i)    
}
```

Iterating in the backward order

```kotlin
for (i in 4 downTo 1) {
    println(i)
}
```

> [!NOTE]
> Note that it is required to use in 4 downTo 1, not in 4..1, to iterate the range in reverse order.

Excluding the upper limit

```kotlin
for (i in 1 until 4) {
    println(i)
}
```

Specifying a step

```kotlin
for (i in 1..7 step 2) {
    println(i)
}
//output
//1
//3
//5
//7

```
You can also use it for backward iteration.

```kotlin
for (i in 7 downTo 1 step 2) {
    println(i)
}
```

Iterating through a MutableList

```kotlin
for (element in mutList) {
    // body of loop
}
```
Iterating by indexes

```kotlin
for (index in daysOfWeek.indices){
   // body of loop
}

```
