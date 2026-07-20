#Scope function

Có rất nhiều cú pháp trong Kotlin cho phép bạn làm cho mã của mình dễ đọc và rõ ràng hơn. Một trong những ví dụ là chức năng phạm vi. 

Có năm hàm phạm vi trong Kotlin: `let`, `run`, `with`, `apply` và `also`.

Chúng không thực hiện bất kỳ hành động cụ thể nào mà chỉ tổ chức mã của bạn và thực thi các thao tác nhất định trong ngữ cảnh đối tượng. 
Các hàm này tạo phạm vi tạm thời cho các đối tượng và gọi mã từ lambdas.
Bên trong lambda, chúng ta có thể giao tiếp với các đối tượng bằng từ khóa `it` hoặc `this`

## áp dụng

Dưới đây là hai tính năng chính của hàm `apply`:
- Đối tượng bối cảnh có sẵn là `this`.
- Hàm trả về đối tượng bối cảnh.

Chúng ta phải sử dụng `apply` để đặt tham số đối tượng.

Ví dụ

```kotlin
fun main() {
    val thom = Musician("Jonny Greenwood")
        .apply {
            instrument = "Harmonica"
            band = "Pavement"
        }.copy(name = "Thom York") // After .apply we have an instance of Musician()
}
```

## cũng vậy
Dưới đây là hai đặc điểm chính của hàm `also`:
- Đối tượng bối cảnh có sẵn là `it`.
- Hàm trả về đối tượng bối cảnh.

Chúng ta phải sử dụng `also` để thực hiện một số thao tác bổ sung với các đối tượng.

## với

Dưới đây là các đặc điểm chính của hàm with:
- Đối tượng bối cảnh có sẵn dưới dạng `this`.
- Nó trả về kết quả của lambda.
- Đây không phải là một chức năng mở rộng.

`with` được sử dụng trong hai trường hợp:

1. khi chúng ta muốn làm điều gì đó với đối tượng bối cảnh và không muốn nhận kết quả.

```kotlin
val musicians = mutableListOf("Thom York", "Jonny Greenwood", "Colin Greenwood")
with(musicians) {
    println("'with' is called with the argument $this")
    println("List contains $size elements")
} // We print the needed data and don't try to get a certain result
```

2. chúng tôi sử dụng `with` khi chúng tôi muốn tạo một đối tượng phụ có các tham số hoặc chức năng có thể được sử dụng để tính toán kết quả.

```kotlin
val musicians = mutableListOf("Thom York", "Jonny Greenwood", "Colin Greenwood")
val firstAndLast = with(musicians) {
    "First list element - ${first()}," +
    " last list element - ${last()}"
}
println(firstAndLast) // We create a new variable firstAndLast and pass the result of calculations inside the function body to it. After that we print this variable.
```

## cho phép

Dưới đây là các tính năng chính của chức năng `let`:
- Đối tượng bối cảnh có sẵn dưới dạng `it`.
- Nó trả về kết quả của lambda.

`let` được sử dụng trong hai trường hợp chung:
1. khi chúng ta muốn làm điều gì đó với toán tử gọi an toàn `?` và các đối tượng không null

```kotlin
val str: String? = "Jonny Greenwood"  
//processNonNullString(str)       // compilation error: str can be null

val length = str?.let {
    println("let() is called on $it")       
    processNonNullString(it)      // OK: 'it' is not null inside '?.let { }'
    it.length
}
```

2. Chúng ta sử dụng let khi muốn nhập các biến cục bộ có phạm vi giới hạn.


```kotlin
val musicians = listOf("Thom York", "Jonny Greenwood", "Colin Greenwood")
val modifiedFirstItem = musicians.first().let { firstItem ->
    println("The first item of the list is '$firstItem'")
    if (firstItem.length >= 5) firstItem else "!" + firstItem + "!"
}.uppercase()
println("First item after modifications: '$modifiedFirstItem'")
```
## chạy

Bây giờ, hãy xem các đặc điểm của hàm run:

- Đối tượng bối cảnh có sẵn dưới dạng `this`.
- Nó trả về kết quả của lambda.

`run` được sử dụng trong hai trường hợp chung:

- khi chúng ta muốn khởi tạo một đối tượng mới và truyền kết quả của lambda cho nó. Điều quan trọng là đối tượng mới của chúng ta độc lập và có giá trị, không giống như hàm with

```kotlin

fun main() {
    val service = MultiportService("https://example.com", 80)

    val result = service.run {
        port = 8080
        query(prepareRequest() + " to port $port")
    }
}
```

khi chúng ta muốn sử dụng một hàm không có phần mở rộng và thực thi một khối gồm nhiều toán tử.

```kotlin
fun main() {
    val hexNumberRegex = run {
        val digits = "0-9"
        val hexDigits = "A-Fa-f"
        val sign = "+-"

        Regex("[$sign]?[$digits$hexDigits]+")
    }

    for (match in hexNumberRegex.findAll("+1234 -FFFF not-a-number")) {
        println(match.value)
    }
}
```

Tuy nhiên, chúng tôi cũng gặp phải một số vấn đề phức tạp: một số hàm có thể được sử dụng thay thế cho nhau và cũng có một số nhầm lẫn khi chọn `it` hoặc `this` khi truy cập đối tượng ngữ cảnh. Bây giờ là lúc để cắt "nút thắt Kotlinian" nổi tiếng này! Chúng ta sẽ tìm hiểu cách chọn chức năng phù hợp và lý do tại sao chúng ta cần hai từ khóa tương tự này: `it` và `this`. Hãy bắt đầu!

## Sự khác biệt là gì: kết quả của hàm

Có một **sự khác biệt quan trọng giữa các hàm phạm vi**, điều này ảnh hưởng lớn đến việc chúng ta lựa chọn hàm phù hợp nhất.

1. `apply` và `also` trả về các đối tượng ngữ cảnh.
2. `let`, `run` và `with` trả về kết quả lambda.


### Ca sử dụng cho `apply` và `also`


- chúng ta thay đổi đối tượng bối cảnh ban đầu và có thể tạo ra một chuỗi dài các hàm xung quanh nó.


### Ca sử dụng cho `let`, `run` và `with`

- chúng ta có thể gán kết quả của các hàm này cho một biến hoặc tạo một chuỗi dài và chuyển đổi dữ liệu khác nhau.
- Một cách khác để sử dụng các hàm này là tạo phạm vi tạm thời cho một biến, thực hiện một số hành động, nhận kết quả và quên nó đi.

## Sự khác biệt là gì: đối tượng bối cảnh

có năm điểm khác biệt thực tế giữa `this` và `it`.

1. `this` đề cập trực tiếp đến đối tượng bối cảnh, trong khi `it` có thể đề cập đến các thành viên riêng biệt của đối tượng mà chúng tôi gọi scope function.

```kotlin
    user.apply {
        // `this` refers to the `user` object, so we can access its properties directly.
        println("Using `this`: Name = $name, Age = $age")
    }
    user.let {
        // `it` refers to the `user` object in this scope.
        println("Using `it`: Name = ${it.name}, Age = ${it.age}")
    }
```

2. Trong cả hai trường hợp, chúng ta đề cập đến một số đối tượng mà chúng ta sẽ làm việc, nhưng với `it`, chúng ta có thể truyền một số tham số, trong khi với `this`, chúng ta đang xử lý một tham số hàm.

```kotlin
    val listOfUsers = listOf(User("Bob", 20), User("Charlie", 30))
    listOfUsers.forEach {
        // `it` refers to each User object in the list, accessed individually in each iteration.
        println("User name: ${it.name}, age: ${it.age}")
    }
    user.apply {
        // With `this`, we're referring to a single `user` object here, not multiple objects.
        println("Single User with `this`: Name = $name, Age = $age")
    }
```

3. Chúng ta có thể bỏ qua `this` trong một hàm và truy cập trực tiếp vào các đối số hoặc phương thức đối tượng, nhưng trong trường hợp `it`, chúng ta phải gọi các đối số và tham số bằng từ khóa it.

```kotlin
    user.apply {
        // No need to use `this` explicitly, we can directly call properties and methods.
        println("Omitted `this`: Name = $name, Age = $age")
    }
    user.let {
        // Must use `it` to refer to properties of the object
        println("With `it`: Name = ${it.name}, Age = ${it.age}")
    }
```
4. Với `it`, chúng ta có thể đổi tên các tham số của mình và sử dụng tên phù hợp hơn bên trong hàm.

```kotlin
    user.let { person ->
        println("Renamed `it`: Person's Name = ${person.name}, Age = ${person.age}")
    }
```
5. Nếu bạn chỉ có một hàm trong phần thân và `it` làm tham số, bạn có thể thay thế hàm đó bằng tham chiếu `::` cho hàm.

```kotlin
    val printUser = { user: User -> println("User with :: function reference: ${user.name}, ${user.age}") }
    listOfUsers.forEach(::printUser)  // Replacing `it` by directly referencing `printUser`
```
