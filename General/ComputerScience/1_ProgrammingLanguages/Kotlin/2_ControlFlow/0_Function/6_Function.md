


## Inline functions and reified types in Kotlin

### Inline functions definition

An `inline` function is a function where it's body is copied and pasted directly into the calling code.

By default, all functions in Kotlin are `non-inline`, meaning that they are executed as separate function calls. 

However, when we mark a function as `inline`, the compiler replaces the function call with the function's body. This reduces the overhead of the function call as well as the creation of unnecessary objects.


Let's look at an example and figure out what is happening:

```kotlin
inline fun measureTimeMillis(block: () -> Unit): Long {
    val startTime = System.currentTimeMillis()
    block()
    return System.currentTimeMillis() - startTime
}

fun main() {
    val time = measureTimeMillis {
        // do some time-consuming operation
        Thread.sleep(1000)
    }
    println("Time taken: $time milliseconds")
}
```

By marking the `measureTimeMillis` function as `inline`, the Kotlin compiler will replace any calls to this function with the actual code inside the function body at compile time.

In Kotlin, functions are stored in memory in the same way as any other object. When a function is defined in code, it is compiled into bytecode and can then be loaded into memory during program execution.

When the function is called, its code is loaded into memory, and the processor begins to execute this code. Like other objects, functions are stored in the heap, a memory area allocated for storing objects during program execution. When you create a function in a heap, enough memory is allocated to store it, including the function code and any variables or objects needed to run it.

**It is important to understand that each time a function is called, a new instance of the function is created in memory. This means that if a function is called repeatedly, many instances of that function will be created in memory.**

Overall, **inline functions can be a powerful tool in Kotlin for optimizing performance-critical code by eliminating function call overhead. However, they should be used with care, as inlining too much code can lead to an increased binary size and longer compile time.**

### Benefits of inline functions

- **Improved performance**: since the code of an inline function is inserted directly into the calling code, there is no need to create an additional function object, which reduces the overhead of function calls.

- **Reduction of memory usage**: the inline function avoids the creation of a function object and its closure object, which leads to a smaller memory footprint.

- **Higher-order function optimization**: inlining functions allows us to use higher-order functions without the overhead of function calls, which makes the code faster and more efficient.


### When do we use inline functions?

- **Functions that are used as arguments to other functions**: inlining a function that is used as an argument to another function will eliminate the overhead of function calls and improve the performance of the code.

- **Functions that are used frequently**: if a function is called frequently, marking it as `inline` can significantly improve the performance of the code by reducing the overhead of function calls.

- **Functions that return lambda expressions**: if a function returns a lambda expression, marking it as `inline` can help reduce the overhead of function calls when the lambda expression is called.

- **Small functions**: inlining small functions can help reduce the overhead of function calls and improve the performance of the code.

### Inline functions also have some limitations, which we need to keep in mind:

- **Code duplication**: inlining functions can lead to code duplication, which can increase the size of the compiled code.

- **Large functions**: inlining large functions can lead to an increase in code size, as the entire function body is copied and pasted into the calling code.

- **Recursive functions**: inline functions cannot be recursive, as inlining a recursive function can lead to an infinite loop.

### Reified type parameters

In the body of a universal function, you cannot access type `T` because it is available only at compile time but is erased at runtime. So, if you want to use a generic type as a regular class in the body of a function, you need to explicitly pass the class as a parameter, like this:

```kotlin
fun <T> myFun(c: Class<T>)
```

Reified type parameters are another feature of Kotlin that can be used in conjunction with inline functions to provide additional type information at runtime


`reified` is a keyword in Kotlin that is used to mark a type parameter as being available at runtime. In other words, `reified` type parameters are those that are not erased by the compiler but, instead, retain their type information at runtime. By marking a type parameter as `reified`, it is possible to use it as a regular class object, with all its type information available at runtime

```kotlin
inline fun <reified T> printType() {
    println(T::class.qualifiedName)
}
```
The function prints the qualified name of the class represented by the reified type parameter. The main benefit of using reified type parameters in inline functions is that **it allows for more flexible and powerful type checking and casting at runtime. This can be particularly useful in cases where the type information of generic type parameters is needed at runtime.**

