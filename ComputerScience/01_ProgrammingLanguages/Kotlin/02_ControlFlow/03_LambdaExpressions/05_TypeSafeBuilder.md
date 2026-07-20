# Builders in Kotlin

you can implement this pattern using Kotlin's functional advantages:
extension functions and lambdas with receivers or function literals with receivers.

```kotlin
data class Person(
    var firstName: String="",
    var lastName: String="",
    var age: Int=0,
    var address: String=""
)

fun personBuilder(init: Person.() -> Unit): Person {
    val builder = Person()
    builder.init()
    return builder
}

fun main() {
    val person = personBuilder {
        firstName = "John"
        lastName = "Doe"
        age = 30
        address = "123 Main St"
    }
    print(person)
}
```