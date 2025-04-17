# Generic Programming

Generics represent parameterized types. Generic methods and classes can handle different types in the same general way

The type should be determined when you create an instance of the class or invoke a method.

Kotlin allows us to define not only one parameter of arbitrary type but also two, three, etc. In this case, you can specify several type parameters, separating them with a comma:

```kotlin
class Three<T, U, V>(var first: T, var second: U, var third: V)
```

## Naming convention for type parameters

The type parameter is named with a single letter according to the convention in order to distinguish it from an ordinary class name.

The most commonly used type parameter names are:

- `T` – Type;

- `S`, `U`, `V`, etc. – 2nd, 3rd, 4th types;

- `E` – Element (often used by different collections);

- `K` – Key;

- `V` – Value;

- `N` – Number.

## Generic function

However, not only classes can be generic – there are generic functions, too. Type parameters can be passed to the function or be defined as its return type

### Declaring generic functions

The following function is declared as generic and does not belong to any class.

```kotlin
fun <T> doSomething(t: T): T {
    return t
}
```

Just like generic classes, generic functions can have several type parameters. They are separated by commas inside angle brackets:

```kotlin
fun <T,U> multipleDoSomething(t: T, u: U){
   // do something
}
```

### Generic methods

As we said, generic functions can be members of classes. They can operate with other members of a class just like ordinary class methods. 

```kotlin
class NonGenericClass {
    fun <T> someGenericMethod(t: T): T {
        //...//
        return t
    }
}
```

## Extension functions

Kotlin provides the ability to extend existing classes without inheritance or using design patterns. You can use extension functions, which allow adding some functionality to a class while not being a member of it.

```kotlin
class BiggerBox<T>(var value1: T, var value2: T) {}

fun <T> BiggerBox<T>.changeBoxes() {
    val tmp = this.value1
    this.value1 = this.value2
    this.value2 = tmp
}
```


## Difference reuse code with any and generic

```kotlin
val nonGenericInstance: NonGenericClass = NonGenericClass("abc")
val str: String = nonGenericInstance.get() // Compile-time error: Type mismatch
```

After an invocation of the `get()` method, we obtain an `Any`, not a `String` or an Integer. We cannot get a string directly from the method.

> [!TIP]
> Now we can see the main advantage of generics over the `Any` class. Because there is no need to perform an explicit type-cast, we never get a runtime exception. If we do something wrong, we can see it at compile-time.