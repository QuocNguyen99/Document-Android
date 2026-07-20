# Type cast and smart cast

## is and !is operators

The `is` and `!is` operators in Kotlin are used for type checks. They allow developers to check if an object belongs to a particular data type. 

## Smart casts

Kotlin also has a feature known as **smart casts**. Smart casts are used to simplify code when working with **nullable types**. When a nullable type is checked with the is operator, Kotlin automatically casts the object to a non-nullable type.

Ex

```kotlin
fun printLength(obj: Any) {
   if (obj is String) {
      println(obj.length)
   }
}
```

In the above code, we check if the `obj` variable is a `String` by using the `is` operator. If it is a `String`, we print its length. Since Kotlin automatically casts the `obj` variable to a non-nullable type, we don't need to use any type cast operator.

## "Unsafe" cast operator

Kotlin has an unsafe cast operator, which is represented by the `as` keyword. The `as` keyword is used to cast an object to a **non-nullable type**. If the object cannot be cast to the specified type, the as operator throws a `ClassCastException`.

Ex

```kotlin
val obj: Any = "Hello, Kotlin"
val str: String = obj as String // Unsafe cast operator
println(str.uppercase())
```

## "Safe" (nullable) cast operator

Kotlin also has a safe cast operator, which is represented by the `as?` keyword. The `as?` operator is used to cast an object to a nullable type. If the object cannot be cast to the specified type, the `as?` operator returns `null`.


```kotlin
fun main() {
    val obj: Any = 123
    val str: String? = obj as? String // Safe (nullable) cast operator
    if (str != null) {
        println(str.uppercase())
    }
}
```
