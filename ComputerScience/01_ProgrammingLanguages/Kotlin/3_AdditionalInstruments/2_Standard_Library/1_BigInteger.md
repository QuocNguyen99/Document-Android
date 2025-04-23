# BigInteger

As you might remember, the standard primitive integer types cannot store extremely large numbers. It is not possible to assign such a large number to a variable of the type `Int` (or even `Long`):

```kotlin
val y: Int = 62957291795228763406253098 // compilation error: The value is out of range
```

This is also the reason why operations with numbers can sometimes lead to **overflow**

Luckily for us, the Java Class Library provides a class called `BigInteger` for processing very large numbers (both positive and negative). The size of a stored number is limited only by the available amount of memory. So, when you use Kotlin/JVM environment, you can use `BigIntegers`.

> [!IMPORTANT]
> The `BigInteger` class is **immutable** which means functions and operators of the class return new instances instead of changing existing ones.

> [!TIP]
> Although this type can store any integers, including small numbers, you should not use `BigInteger` unless you absolutely have to. There is always a performance hit associated with its use. `BigInteger` operations are slower than operations on built-in integer types.

## Functions of BigInteger

The `divideAndRemainder` function returns an array consisting of two numbers: the result of integer division and the remainder:

```kotlin
val (result, remainder) = oneHundredTen.divideAndRemainder(nine) // 12 and 2
```
The class also provides functions for performing more complex math operations. The `abs` function returns a new `BigInteger` whose value is the absolute value of this `BigInteger`:
```kotlin
val number = BigInteger("-8")
println(number.abs()) // 8
```

The `gcd` function returns the **greatest common divisor** of two numbers.

```kotlin
val eight = BigInteger.valueOf(8)
val six = BigInteger.valueOf(6)
println(eight.gcd(six)) // 2
```