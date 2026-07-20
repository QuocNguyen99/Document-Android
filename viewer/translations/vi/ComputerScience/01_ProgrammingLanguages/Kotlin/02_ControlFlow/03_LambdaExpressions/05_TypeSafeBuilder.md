# Nhà xây dựng trong Kotlin

bạn có thể triển khai mẫu này bằng các ưu điểm chức năng của Kotlin:
các hàm mở rộng và lambda với bộ thu hoặc chữ hàm với bộ thu.

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