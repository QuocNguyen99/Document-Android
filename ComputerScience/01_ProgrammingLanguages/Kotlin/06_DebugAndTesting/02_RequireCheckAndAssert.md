# Require, check, and assert

In Kotlin, `require`, `check`, and `assert` are functions used to verify conditions in code. These functions throw exceptions if the condition they check is not met.

## reqiuire

`fun require(value: Boolean)` is used to verify the requirements of the **arguments** of a function or a constructor. 
If the condition specified in `require` is not met (is false), an `IllegalArgumentException` is thrown.

Here we have a traditional construction using `if` and `throw`. We use it to check the prerequisites or a parameter of a function.

```kotlin
fun setAgeWithIf(age: Int) {
    if (age < 0) {
        throw IllegalArgumentException("Age must not be less than zero")
    }
    println("Age is $age")
}
```

Now, we will use `require` to solve this type of task and check a prerequisite for executing a fragment of code.

```kotlin
fun setAgeWithRequire(age: Int) {
    require(age >= 0) { "Age must not be less than zero" }
    println("Age is $age")
}
```

## check

`fun check(value: Boolean)` is used to verify the **state** of an object or variable. It throws `IllegalStateException` if the condition specified in `check` is not met (is false), so we need a legal state to perform the code.

```kotlin
class MyClassWithIf {
    private var isInitialized = false

    fun performActionWithIf() {
        if (!isInitialized) {
            throw IllegalStateException("Object state is not initialized")
        }
        println("Action performed")
    }
}
```

And now let's see how you can do it with `check`:


```kotlin
class MyClassWithCheck {
    private var isInitialized = false

    fun performActionWithCheck() {
        check(isInitialized) { "Object state is not initialized" }
        println("Action performed")
    }
}
```

## assert

`fun assert(value: Boolean)` is a function in Kotlin used to verify conditions in the code that are supposed to be true unless there is a bug in the program. 

If the condition specified in `assert` is not met (false), an `AssertionError` is thrown

```kotlin
fun calculateValueWithIf(x: Int): Int {
    val value = x * 2
    if (value != x + x) {
        throw AssertionError("Error in calculation")
    }
    return value
}
```

In the above case, if the result of the calculation is incorrect due to a bug in the program, `AssertionError` will be thrown with the message "Error in calculation".

```kotlin
fun calculateValueWithAssert(x: Int): Int {
    val value = x * 2
    assert(value == x + x) { "Error in calculation" }
    return value
}
```

## Good practice
Here's the procedure you might want to follow when performing your checks:
- Begin by using `check` to verify the initial **state** of the object.
If these checks fail, it means the function should not have been invoked in the first place due to incorrect object state.
- Next, use `require` to **validate the function arguments**. 
If any argument is invalid, it's best to identify that before proceeding with the function's operations, as the function call will eventually fail due to the invalid argument.
- After validating the state and arguments, proceed with the main logic or operations of your function.
- Finally, use `assert` to **ensure that your function has done its job correctly**. 
This could involve verifying that certain objects have been updated to a new state or ensuring that the return value is as expected.


```kotlin
class MyClass {
    private var isInitialized = false

    fun initialize() {
        isInitialized = true
    }

    fun performAction(x: Int, y: Int): Int {
        check(isInitialized) { "Object is not initialized" }
        require(x > 0 && y > 0) { "Both x and y must be greater than zero" }

        val result = x + y

        assert(result == x + y) { "Error in calculation" }

        return result
    }
}
```