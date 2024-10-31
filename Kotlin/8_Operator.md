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

