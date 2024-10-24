# Variable Declaretion


## Integer numbers

Here are several examples of valid integer number :  `0`, `1`, `2`, `10`, `11`, `100`.

If an integer value contains a lot of digits, we can add underscores to divide the digits into blocks to make this number more readable: for example, `1_000_000` is much easier to read than `1000000`.


## Characters

A single character can represent a digit, a letter, or another symbol. To write a single character, we wrap a symbol in single quotes as follows: `'A'`, `'B'`, `'C'`, `'x'`, `'y'`, `'z'`, `'0'`, `'1'`, `'2'`, `'9'`

## String 

To write strings, we wrap characters in double quotes instead of single ones. Here are some valid examples: "text", "I want to learn Kotlin", "123456", "e-mail@gmail.com". So, strings can include letters, digits, whitespaces, and other characters.


## Declaring variables

To declare a variable, Kotlin provides two keywords:
- val (for value) declares a **read-only variable (just a named value)**, which cannot be changed after it has been initialized, so a value can be assigned once (this is actually not entirely true, we will discuss this issue in more detail later);
- var (for variable) declares a mutable variable, which can be changed (as many times as needed).
- const is used for variables (with val) **that are known at compile-time**.

#### Val variables and mutability

It is important to note that `val` is not a synonym of **immutable**

Example:

```kotlin
// list creation
val myMutableList = mutableListOf(1, 2, 3, 4, 5)
// trying to update the list
myMutableList = mutableListOf(1, 2, 3, 4, 5, 6) // error line
```

**It is always possible to change the internal state of a val variable**: while it is prohibited to reassign the variable, its content can be modified in some other ways.

Example:

```kotlin
// list creation
val myMutableList = mutableListOf(1, 2, 3, 4, 5)
// adding a new element
myMutableList.add(6)   // it works
// printing the list
println(myMutableList) // [1, 2, 3, 4, 5, 6]
```

As you can see, this code changed the internal state of the `myMutableList` by adding another integer number. When we invoked the `add()` function, we changed not the variable itself but the list it represents.
If you are familiar with the Java programming language, it may be easier for you to think about Kotlin val variables as Java final variables. They are quite similar: both prohibit reassigning a value to the variable but allow changing the internal state of the object.

#### Const variables

In Kotlin, there is also a const modifier, which is used before the val keyword to declare a compile-time constant. The value of a const variable is known at compile time and won't be changed at runtime, There are some restrictions on when the const modifier can be applied. First, it can only be used with a String or a primitive type variable.

```kotlin
const val CONST_INT = 127
const val CONST_DOUBLE = 3.14
const val CONST_CHAR = 'c'
const val CONST_STRING = "I am constant"
const val CONST_ARRAY = arrayOf(1, 2, 3) // error: only primitives and strings are allowed
```


Besides, const variables need to be declared on top level, outside of any functions:

```kotlin
const val MY_INT_1 = 1024 // correct line

fun main() {
    const val MY_INT_2 = 2048 // error: Modifier 'const' is not applicable to 'local variable'
}
```

#### When to use val variables

A good practice is to use val variables by default. Then, when it appears to be necessary for the code, change them to var variables
This approach allows you to write programs with the minimum number of mutable variables, which leads to fewer errors.

### Naming conventions

When declaring val and const variables in Kotlin, it's the best practice to follow Kotlin's naming conventions to ensure your code is easily readable and maintainable.

For `val` variables use the **camelCase** format. 

```kotlin
val numberOfWheels: Int
val isConnectionAvailable: Boolean
val userFirstName: String
```
`const` variables are compile-time constants. Since they represent static, unchangeable values, their names should be in uppercase letters, with underscores separating words

```kotlin
const val MAX_USER_COUNT = 50
const val COMPANY_NAME = "TechCorp"
const val VERSION_CODE = 3
```