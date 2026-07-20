# Gói và nhập khẩu

## Gói

Trong một gói, chúng tôi nhóm các lớp, hàm và/hoặc biến theo trường hợp sử dụng hoặc chức năng cụ thể.

Để xác định gói, chúng tôi sử dụng tiêu đề `package`. 

Tất cả các thành phần trong gói này, cho dù chúng có nằm trong cùng một tệp hay không (các lớp và hàm), đều được gói gọn trong gói đó. Để có thể sử dụng chúng, chúng ta phải cho biết tên đầy đủ của thành phần, bao gồm tên gói.

```kotlin
package packages

data class Person(val name: String, val age: Int)

fun sayHello() {
    println("Hello")
}

fun main() {
    val person = packages.Person("John", 30)
    packages.sayHello()
}
```

## Nhập khẩu

Nếu chúng ta muốn sử dụng mã được nhóm hoặc đóng gói trong một gói, chúng ta phải `import` mã đó. 

Chúng tôi có thể nhập toàn bộ gói 

```kotlin
import allpackage.*
```

hoặc một số yếu tố cụ thể từ gói đó.

```kotlin
import oneclass.Person
```

## Nhập mặc định

Theo mặc định, một số gói được nhập vào mọi tệp Kotlin:

- kotlin.*
- kotlin.annotation.*
- kotlin.collections.*
- kotlin.comparisons.*
- kotlin.io.*
- kotlin.ranges.*
- kotlin.sequences.*
- kotlin.text.*

## Nhập bí danh

Đôi khi, chúng ta có thể cần nhập hai phần tử có cùng tên nhưng thuộc các gói khác nhau hoặc nhập cùng một lớp và sử dụng nó với hai tên khác nhau. 

Chúng tôi thực hiện điều đó với công cụ sửa đổi `as`.

```kotlin
import packagetwo.Person as PersonAdavanced
```

