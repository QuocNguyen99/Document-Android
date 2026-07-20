# Contracts

Sometimes, when writing code, everything may seem correct, but the compiler still gives a warning. 
For example, it may not be able to determine (with all its mighty power of analysis) that a variable cannot be `null` and suggests using the `?` operator. 

Should you listen and obey even if you know the compiler is wrong? Or is there a way to get the compiler on the same page as you, so everyone is satisfied in the end?

## Understanding contracts

Contracts are agreements between different parts of the code that allow a function to explicitly describe its behavior in a way that is understood by the compiler. 

This information can help the compiler make smart decisions, such as when to **allow smartcasts** or **determine variable initialization**.

Consider the following example:

```kotlin
fun foo(s: String?) {
    if (s != null) s.length // Compiler automatically casts 's' to 'String'
}
```

Here, the compiler smartcasts s to a String inside the if statement.

However, if we extract the null check into a separate function, the compiler loses this context:


```kotlin
fun String?.isNotNull(): Boolean = this != null

fun foo(s: String?) {
    if (s.isNotNull()) s.length // No smartcast :(
}
```

This is where contracts come into play. 
By adding a contract to our `isNotNull` function, we can inform the compiler that when `isNotNull` returns `true`, the receiver of the function (like s) is not `null`.


```kotlin
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.contract

@OptIn(ExperimentalContracts::class)
fun String?.isNotNull(): Boolean {
    contract {
        returns(true) implies (this@isNotNull != null)
    }
    return this != null
}

fun foo(s: String?) {
    if (s.isNotNull()) s.length // Smartcast :)
}
```

Now, the compiler will know from the contract that `s` is definitely not a `String?` type (based on our word), 
so it will smartcast it to a `String` inside the `if` statement, even though the null check is inside a separate function.

## Syntax of contracts

The standard format for a contract is as follows:

```kotlin
function {
    contract {
        Effect
    }
}
```

This can be interpreted as "calling the function results in the specified Effect".


As of now, there are two main types of contracts: `returns–implies` and `callsInPlace`.

### "returns"–"implies" contract

The `returns–implies` contract is used to specify that a function will return a certain type by implying a **condition**.

This allows the compiler to assume that after the function is called, the implies part of the contract will be satisfied, which is, in fact, a boolean expression.
### "callsInPlace" contract

The `callsInPlace` contract is used to specify that a function parameter lambda is invoked in place.
There are four possible invocation kinds: 

- `AT_MOST_ONCE`: the lambda is invoked zero or one time.
- `AT_LEAST_ONCE`: the lambda is invoked at least one time.
- `EXACTLY_ONCE`: the lambda is invoked exactly one time.
- `UNKNOWN`: the number of invocations is unknown.

The `callsInPlace` contract is especially useful when you know that the lambda will assign a value to a variable but the compiler does not. 
By using the contract, you can tell the compiler that the lambda will assign a value to the variable, and the compiler will allow the code to be compiled.

```kotlin
import kotlin.contracts.ExperimentalContracts
import kotlin.contracts.InvocationKind
import kotlin.contracts.contract

@OptIn(ExperimentalContracts::class)
fun myRun(block: () -> Unit) {
    contract {
       callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block()
}

fun main() {
    val x: Int
    myRun {
        x = 10 // The compiler is satisfied :)
    }
    println(x) // 10
}
```

## Contracts in standard library

Contracts are widely used in the standard library. Here are some examples:

- `isNullOrEmpty` extension function:

```kotlin
public inline fun CharSequence?.isNullOrEmpty(): Boolean {
    contract {
        returns(false) implies (this@isNullOrEmpty != null)
    }

    return this == null || this.length == 0
}
```
- `run` and other scoped functions:


```kotlin
public inline fun <R> run(block: () -> R): R {
    contract {
        callsInPlace(block, InvocationKind.EXACTLY_ONCE)
    }
    return block()
}
```

## Limitations and future of contracts

While contracts are a promising feature, they currently have a few limitations:
- They can only be applied to top-level functions with a body.
- The contract call must be the first statement in the function body.
- The compiler trusts contracts unconditionally, so it is up to the programmer to ensure that the contracts they write are correct and sound.














