# Recursion

Recursion in programming is when a function calls itself.

## Designing a function

Each recursive function consists of the following steps:

- A **trivial base case** stops the recursion. This is the case we know the result for. For example, if we find a doll we can't open, we take it and proudly state: "it's our smallest doll!"

- A **reduction step** (one or more, imagine that our doll contains two dolls inside it!) gets us from the current problem to a simpler one. For example, if our doll can be opened, we open it and look at what is inside.

## Types of recursion

1. **Direct recursion**

It’s the case when a function simply calls itself only once. Our recursive factorial makes a good example:

```kotlin
fun factorialRecursive(n: Int): Int = if (n == 0 || n == 1) 1 else n * factorialRecursive(n - 1)
```

2. **Indirect recursion**

This is the case when a function uses some other function, which, in turn, calls the former function. There’s no necessity to do it like that, but a modified version of the factorial function can be an example:


```kotlin
fun weirdFactorialRecursive(n: Int): Int = if (n == 0 || n == 1) 1 else factorialCompute(n)

fun factorialCompute(n: Int): Int = n * weirdFactorialRecursive(n - 1)
```

3. **Tail recursion**

A function utilizes tail recursion if a recursive call is the last thing the function does.

```kotlin
fun tailFactorialRecursive(n: Int, cur: Int = 1): Int {
    if (n == 0) return cur
    return tailFactorialRecursive(n - 1, cur * n)
}
```
> [!NOTE]
> Why does tail recursion stand out as a separate type? Because modern compilers can more efficiently work with it. To compute another call of a recursion function, the compiler usually pushes the stack frame onto the stack of operations to be performed, therefore, creating a new set of local variables, which costs time and space. In the case of tail recursion, the compiler can just return to the beginning of the function to continue working with the same variables it already has in the current stack frame.

4. **Multiple recursion**

This is the case when a function makes several calls to itself.

```kotlin
fun fibonacci(n: Int): Int {
    if (n <= 0) return 0
    if (n == 1) return 1
    return fibonacci(n - 1) + fibonacci(n - 2)
}
```

> [!CAUTION]
> However, this solution is extremely inefficient, as recursion branches each time we need another number; therefore, the number of calls and calculations grows exponentially.

### Optimizations

- possible optimization method involves replacing recursion with a loop, which may be used

- Apart from turning recursion into a loop, there is yet another method of optimizing it, which is called **memoization**. Calling `f(6)`, for example, would call `f(5)` and `f(4)`, and `f(5)`, in its turn, would also call `f(4)`. The basic version would compute `f(4)` two times, and it gets worse for the numbers which are used more often. Let’s save it to an array once we compute it and make all other recursion branches first check if the value has already been computed. If not, they will do it, but if the value is already there, it can be used right away.

```kotlin
val fibList = MutableList(1000){0}

fun coolerFibonacci(n: Int): Int {
    if (n <= 0) return 0
    if (n == 1) return 1
    return if (fibList[n] != 0) fibList[n]
    else {
        fibList[n] = coolerFibonacci(n - 1) + coolerFibonacci(n - 2)
        fibList[n]
    }
}
```

## Advantages and disadvantages

It depends on the programming language. As a rule, in Python and Java, loops are more efficient in terms of **time** and **memory**. **Recursion is slower and "heavier" because each call of a function takes additional memory, and recursive functions usually get called many times.**

In that case, why recursion? Well, it has one certain advantage over loops: in some cases, it is intuitive. If you are certain that some function uses itself, it is much faster to write 3-4 lines of recursive code than to think how exactly a loop should behave. If you are short on time but don't have to worry about memory consumption, recursion is your choice.

So, recursion is usually slower and less memory-efficient, but it saves the developers' time.
