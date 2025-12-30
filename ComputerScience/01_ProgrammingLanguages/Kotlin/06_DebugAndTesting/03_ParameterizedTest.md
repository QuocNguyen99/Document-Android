# Parameterized test

Suppose we have: 

```kotlin
class Calculator {
    fun maxOf(a: Int, b: Int): Int {
        return if (a >= b) {
            a
        } else {
            b
        }
    }
}
```
We will also write the necessary tests to make sure that this method works correctly. 

We need to test three cases:
- when the first argument is greater than the second one
- when the first argument is less than the second one
- when both arguments are equal.

```kotlin
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class CalculatorTest {
    @Test
    fun testMaxFirstArgGreaterThanSecondArg() {
        val calculator = Calculator()
        val result = calculator.maxOf(2, 1)
        val expected = 2
        assertEquals(expected, result)
    }

    @Test
    fun testMaxFirstArgLessThanSecondArg() {
        val calculator = Calculator()
        val result = calculator.maxOf(1, 2)
        val expected = 2
        assertEquals(expected, result)
    }

    @Test
    fun testMaxFirstArgEqualToSecondArg() {
        val calculator = Calculator()
        val result = calculator.maxOf(2, 2)
        val expected = 2
        assertEquals(expected, result)
    }
}
```

Now, let's run these tests to make sure that our implementation of the `maxOf` method successfully passes all the tests. 

## Installation

First, let's add the following dependency to our project so that JUnit will be able to work with parameterized tests.

```kotlin
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.9.0")
}
```

## @ParameterizedTest

`@ParameterizedTest` allows us to invoke a single test method multiple times, passing different arguments to it. 


```kotlin
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource

internal class CalculatorTest {
    @ParameterizedTest
    @CsvSource("2, 1, 2", "1, 2, 2", "1, 1, 1")
    fun testMax(first: Int, second: Int, expected: Int) {
        val calculator = Calculator()
        val result = calculator.maxOf(first, second)
        assertEquals(expected, result)
    }
}
```

`@CsvSource` annotation to provide an array of such arguments.

JUnit has plenty of annotations for different sources of arguments, such as `@ValueSource`, `@EnumSource`, `@MethodSource`, `@CsvSource`, `@CsvFileSource`, and `@ArgumentsSource`, some of which we are going to discuss below.

## Sources of arguments

### @ValueSource

`@ValueSource` is an argument source that supplies an array of literal values for test methods with a single parameter. 


```kotlin
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

internal class CalculatorTest {

    @ParameterizedTest
    @ValueSource(ints = [0, 2, 4, 1000])
    fun testIsEven(arg: Int) {
        assertTrue(Calculator().isEven(arg))
    }
}
```

For non-primitive types, you can use `@EmptySource`, `@NullSource`, or `@NullAndEmptySource` annotations to pass `null` and empty values.


```kotlin

internal class CalculatorTest {

    @ParameterizedTest
    @EmptySource
    fun testEmpty(arg: IntArray) {
        assertEquals(0, arg.size)
    }

    @ParameterizedTest
    @NullAndEmptySource
    fun testNullAndEmpty(arg: List<String?>?) {
        assertTrue(arg == null || arg.isEmpty()) // we can also write this line 
                                                 // assertTrue(arg.isNullOrEmpty())
    }
}
```

### @MethodSource

Each such method must satisfy the following requirements: it must not accept any arguments and must return a stream, an array, or a collection of arguments.

```kotlin
import junit.framework.TestCase.assertFalse
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class CalculatorTest {

    @ParameterizedTest
    @MethodSource("stringFactory")
    fun testStrings(str: String) {
        assertFalse(str.isEmpty())
    }

    fun stringFactory(): List<String>? {
        return listOf("apple", "banana", "lemon", "orange")
    }
}
```

If a parameterized test method has multiple parameters, your argument source method needs to return a collection, a stream, or an array of `Arguments` or an array of `Object`:

```kotlin
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.Arguments.arguments
import org.junit.jupiter.params.provider.MethodSource

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class CalculatorTest {

    @ParameterizedTest
    @MethodSource("argFactory")
    fun testStringLength(str: String, length: Int) {
        assertEquals(length, str.length)
    }

    fun argFactory(): List<Arguments?>? {
        return listOf(arguments("apple", 5), arguments("watermelon", 10))
    }
}
```

## Working with CSV

It allows you to supply a list of arguments as comma-separated values

```kotlin
@CsvSource({ "apple, 5", "strawberry, 10", "cherry, 6" })
```

JUnit has the `@CsvFileSource` annotation, which is used to load a CSV file from the classpath or the local file system


## And here's an example of the @CsvFileSource annotation:

```kotlin
@CsvFileSource(resources = "/dataset.csv", numLinesToSkip = 1)
```












