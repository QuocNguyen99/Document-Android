# Operator

## Arithmetic Unary operators
A unary operator takes a single value as the operand.

- A unary plus just gives you a value. It is an optional operator, so you omit it in practice:
```kotlin
println(+5) // prints 5
println(+(-5)) // prints -5
```

Explain code
- A unary minus negates a value or expression:
```kotlin
println(-8)  // prints -8
println(-(100 + 4)) // prints -104
```
Explain code
They both **have higher** precedence than the multiplication and division operators.



## Arithmetic Precedence order


Take a look at the precedence order of arithmetic operators, including parentheses. The list is sorted from the highest to the lowest priority.

1. Parentheses;
2. Unary plus/minus;
3. Multiplication, division, and modulus;
4. Addition and subtraction.

## Precedence of Increment and Decrement Operators

Some operations take precedence over others, that is, they are performed first. The priority of operations should be taken into account when executing a set of arithmetic expressions

1. Parentheses ( (expr) );
2. Postfix increment/decrement ( expr++, expr--);
3. Unary plus/minus, prefix increment/decrement ( -expr, ++expr, --expr );
4. Multiplication, division, and modulus ( *, /, % );
5. Addition and subtraction ( +, - );
6. Assignment operations ( =, +=, -=, *=, /=, %= ).

## Ranges

Imagine a situation where you need to check whether the integer variable `c` is greater than or equal to `a` and less than or equal to `b`

```kotlin
val within = a <= c && c <= b
```

This code works well. However, Kotlin provides a more convenient way to do the same thing using **ranges**:

```kotlin
val within = c in a..b
```

Here, `a..b` is a range of numbers from `a` to `b` (including both border values), `in` is a special keyword that is used to check whether a value is within a range. This is a **closed-ended range**.

Also, we have an open-ended range: `a..<b` is a range of numbers from `a` until `b` (excluding the border value, `b`).

If you need to check that a value is not within a range, just add `!` (not) before `in`.

```kotlin
val notWithin = 100 !in 10..99 // true
```
You can assign a range to a variable and use it later.
```kotlin
val range = 100..200
println(300 in range) // false
```

## Operator overloading

Kotlin allows you to define your own operators on certain types. These operators have predefined symbolic representation, like "+" or "+=", and precedence. To define our custom operator, we must meet these requirements:
- Provide a member function or an extension function with a specific name for the corresponding type.
- This type becomes the left-hand side type for binary operations and the argument type for the unary ones.

To customize an operator, we should mark the function with the `operator` modifier.

```kotlin
operator fun String.unaryMinus() = this.reversed()

fun main() {
    val name = "Kotlin"
    println(-name) // niltoK
}
```

Also, you can combine operator with the infix modifier.

```kotlin
infix operator fun String.times(n: Int) = this.repeat(n)

fun main() {
    val s = "Kotlin"
    println(s * 3) //KotlinKotlinKotlin
}
```

### Unary operations

These are functions that generally have no parameters.

| Expression | Translated to    |
|------------|------------------|
| +a         | a.unaryPlus()     |
| -a         | a.unaryMinus()    |
| !a         | a.not()           |
| a++        | a.inc()          |
| a--        | a.dec()          |

### Binary operations
These are functions that generally have two parameters.

| Expression | Translated to    |
|------------|------------------|
| a + b      | a.plus(b)        |
| a - b      | a.minus(b)       |
| a * b      | a.times(b)       |
| a / b      | a.div(b)         |
| a % b      | a.rem(b)         |
| a..b       | a.rangeTo(b)     |


| Expression | Translated to    |
|------------|------------------|
| a in b     | b.contains(a)    |
| a !in b    | !b.contains(a)   |

### Indexed access operator

Square brackets `[]` are translated to calls to `get` and `set`.

| Expression        | Translated to             |
|-------------------|---------------------------|
| a[i]              | a.get(i)                  |
| a[i, j]           | a.get(i, j)               |
| a[i_1, ..., i_n]  | a.get(i_1, ..., i_n)      |
| a[i] = b          | a.set(i, b)               |
| a[i, j] = b       | a.set(i, j, b)            |
| a[i_1, ..., i_n] = b | a.set(i_1, ..., i_n, b)  |

### invoke operator

| Expression | Translated to |
|---|---|
| a() | a.invoke() |
| a(i) | a.invoke(i) |
| a(i, j) | a.invoke(i, j) |
| a(i_1, ..., i_n) | a.invoke(i_1, ..., i_n) |

### Augmented assignments

| Expression | Translated to |
|---|---|
| a += b | a.plusAssign(b) |
| a -= b | a.minusAssign(b) |
| a *= b | a.timesAssign(b) |
| a /= b | a.divAssign(b) |
| a %= b | a.remAssign(b) |

### Equality and inequality operators

| Expression | Translated to |
|---|---|
| a == b | a?.equals(b) ?: (b === null) |
| a != b | !(a?.equals(b) ?: (b === null)) |

### Comparison operators

| Expression | Translated to |
|---|---|
| a > b | a.compareTo(b) > 0 |
| a < b | a.compareTo(b) < 0 |
| a >= b | a.compareTo(b) >= 0 |
| a <= b | a.compareTo(b) <= 0 |