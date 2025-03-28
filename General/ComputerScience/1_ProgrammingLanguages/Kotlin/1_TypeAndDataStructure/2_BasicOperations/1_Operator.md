# Operator

## Arithmetic Unary operators

Unary operators are operators that operate on a single operand.
such as increment (`++`), decrement (`--`), negation (`-`), or logical not (`!`)

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

Some operations take precedence over others, that is, they are performed first.
The priority of operations should be taken into account when executing a set of arithmetic expressions

1. Parentheses ( `(expr)` );
2. Postfix increment/decrement ( `expr++`, `expr--`);
3. Unary plus/minus, prefix increment/decrement ( `-expr`, `++expr`, `--expr` );
4. Multiplication, division, and modulus ( `*`, `/`, `%` );
5. Addition and subtraction ( `+`, `-` );
6. Assignment operations ( `=`, `+=`, `-=`, `*=`, `/=`, `%=` ).

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

