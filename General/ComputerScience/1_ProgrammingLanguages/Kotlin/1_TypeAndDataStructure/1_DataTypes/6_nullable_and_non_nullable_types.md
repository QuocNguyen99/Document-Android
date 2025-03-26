## Nullable and non-nullable types

### Nullability


we just added a `?` sign right after the type of our variable. We marked our name variable as nullable.

```kotlin
var age: Int? = null
```
without a `?` sign in the type you can't assign null to a variable.
### Accessing nullable variables

we can access the length this way:

```kotlin
print(name?.length)
```

This `?`. pair of symbols is called a **safe call** in Kotlin. 

So, Kotlin introduces **nullable types** that differ from **non-nullable** ones

- In Kotlin, a **nullable type** is a variable that can hold a null value

- In Kotlin, a **non-nullable** is a type that cannot hold a null value.

### Avoiding NPEs. Null safety

Null safety is a crucial feature in Kotlin's design.
Kotlin's type system aims to get rid of null references, which commonly lead to bugs and crashes in software development.

### Save calls
If you need to have access to properties or call methods of a nullable object, you must check if it's null first.

```kotlin
val name: String? = "Kotlin"
val length = if (name != null) name.length else null 
```

But it's quite a long expression! You can get the same result if you use the safe call operator `?`. that allows you to access properties or call methods on nullable variables without risking a `NullPointerException`

```kotlin
val name: String? = "Kotlin"
val length = name?.length // length is null if name is null
```

### Elvis Operator

we can simplify the code with the **Elvis operator**:

```kotlin
var name: String? = "Kotlin"
val length: Int? = name?.length
print(length ?: 0)
```

You may ask, but why is it called Elvis? Look: there he is!

![alt text](/resources/elvis_operator.png)

### The Not-Null Assertion Operator

The not-null assertion operator`!!`. **The code won't crash only if you're 100% sure that your variable won't be** `null`


This operator is used to stop the program when `null` is encountered.

Why `!!` overuse is problematic:

1. **Defeats Null Safety**: Kotlin's type system is designed to handle nulls gracefully. Overusing !! bypasses these safety measures.

2. **Code Smell**:  Regular use often indicates a disregard for proper null checks and can lead to code that's less stable and more challenging to maintain.

3. **Unexpected Crashes**: It can cause your application to crash unexpectedly if proper null checks are not done before using `!!`.


### Best Practices for Null Safety in Kotlin

1. **Use Nullable Types Wisely**: Only use nullable types (`Type?`) when a variable can indeed be `null`. If a variable should not be `null`, use a non-nullable type.

2. **Safe Calls (?.)**: Use the safe call operator when accessing properties or methods on a nullable object. This will return `null` if the object is `null` instead of throwing a `NullPointerException`.

3. **Elvis Operator (?:)**: The Elvis operator lets you offer an alternative value if an expression evaluates to null.

4. **Non-Null Assertion (!!)**: Use this operator only when you are certain that the value is not `null`. It will throw a `NullPointerException` if the value is `null`.