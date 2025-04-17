# Operator overloading

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

## Unary operations

These are functions that generally have no parameters.

| Expression | Translated to    |
|------------|------------------|
| +a         | a.unaryPlus()     |
| -a         | a.unaryMinus()    |
| !a         | a.not()           |
| a++        | a.inc()          |
| a--        | a.dec()          |

## Binary operations
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

## Indexed access operator

Square brackets `[]` are translated to calls to `get` and `set`.

| Expression        | Translated to             |
|-------------------|---------------------------|
| a[i]              | a.get(i)                  |
| a[i, j]           | a.get(i, j)               |
| a[i_1, ..., i_n]  | a.get(i_1, ..., i_n)      |
| a[i] = b          | a.set(i, b)               |
| a[i, j] = b       | a.set(i, j, b)            |
| a[i_1, ..., i_n] = b | a.set(i_1, ..., i_n, b)  |

## invoke operator

| Expression | Translated to |
|---|---|
| a() | a.invoke() |
| a(i) | a.invoke(i) |
| a(i, j) | a.invoke(i, j) |
| a(i_1, ..., i_n) | a.invoke(i_1, ..., i_n) |

## Augmented assignments

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