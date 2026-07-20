# Bản đồ Mutable và Mutable Đặt làm giao diện

Trong Kotlin, `MutableMap` và `MutableSet` là các giao diện mở rộng các đối tác immutable, `Map` và `Set`. 
Họ cung cấp các chức năng bổ sung để sửa đổi các bộ sưu tập.

`MutableMap` là collection gồm các cặp khóa-giá trị, trong đó mỗi khóa là **duy nhất**. 
Nó cho phép bạn thêm, xóa hoặc cập nhật các mục. Đây là một ví dụ:

```kotlin
val mutableMap = mutableMapOf("one" to 1, "two" to 2)
mutableMap["three"] = 3  // Add a new entry
mutableMap.remove("one") // Remove an entry 
```

`MutableSet` là collection gồm các phần tử duy nhất cho phép bạn thêm, xóa hoặc cập nhật các phần tử. 
Đây là một ví dụ:

```kotlin
val mutableSet = mutableSetOf(1, 2, 3)
mutableSet.add(4)    // Add a new element
mutableSet.remove(1) // Remove an element
```


`MutableMap` và `MutableSet` cung cấp tính linh hoạt cao hơn so với các phiên bản immutable nhưng phải trả thêm phí bộ nhớ. 
Sử dụng chúng khi bạn cần sửa đổi các bộ sưu tập sau khi tạo.

## Tìm hiểu bản đồ Mutable trong Kotlin

Giao diện `MutableMap` trong Kotlin là một phần của Bộ sưu tập Kotlin Framework.

Nó kế thừa từ giao diện `Map` và cho phép sửa đổi các mục bản đồ, không giống như immutable `Map`.


## Thuộc tính và phương thức của MutableMap

`MutableMap` có hai thuộc tính chính: `keys` và `values`. 
Thuộc tính `keys` trả về `MutableSet` của tất cả các khóa trong bản đồ, trong khi `values` trả về `MutableCollection` của tất cả các giá trị.

```kotlin
val mutableMap = mutableMapOf("one" to 1, "two" to 2)
println(mutableMap.keys) // prints: [one, two]
println(mutableMap.values) // prints: [1, 2]  
```

Giao diện `MutableMap` cung cấp một số phương pháp để sửa đổi bản đồ, chẳng hạn như `put()`, `putAll()`, `remove()` và `clear()`.

## Khi nào và tại sao nên sử dụng MutableMap

Trong khi `Map` ở chế độ chỉ đọc và không thể sửa đổi sau khi tạo, `MutableMap` cho phép thay đổi. 
Điều này hữu ích khi bạn cần thêm, xóa hoặc cập nhật các mục một cách linh hoạt.

Các đối tượng Immutable như `Map` vốn là thread an toàn và không yêu cầu synchronization. 
Nếu bản đồ của bạn không cần thay đổi sau khi được tạo, hãy ưu tiên sử dụng `Map` để có hiệu suất và độ an toàn tốt hơn.

## Khi nào và tại sao nên sử dụng MutableSet

Hãy nhớ rằng, mặc dù `MutableSet` mang đến sự linh hoạt nhưng nó lại hy sinh sự an toàn của thread. 
Nếu nhiều luồng truy cập và sửa đổi `MutableSet` cùng một lúc, bạn phải đồng bộ hóa nó với bên ngoài.

## Ứng dụng thực tế của Bản đồ Mutable và Bộ Mutable trong Kotlin

- **Bộ nhớ đệm dữ liệu**: Sử dụng `MutableMap` để lưu trữ dữ liệu vào bộ nhớ đệm. Nó lưu trữ các cặp khóa-giá trị trong đó mỗi khóa là duy nhất. **Phương pháp này tăng tốc độ truy xuất dữ liệu**.

```kotlin
val cache: MutableMap<String, Any> = mutableMapOf()
cache["user"] = User("John", "Doe")
val user = cache["user"] as User 
```

- **Đếm số lần xuất hiện**: Sử dụng MutableMap để đếm tần suất các phần tử xuất hiện trong collection.

```kotlin
val words = listOf("a", "b", "a", "c", "b", "a")
val frequencyMap: MutableMap<String, Int> = mutableMapOf()

for (word in words) {
    val count = frequencyMap[word] ?: 0
    frequencyMap[word] = count + 1
}
```

- **Xóa các phần trùng lặp**: Sử dụng MutableSet để loại bỏ các phần tử trùng lặp khỏi collection, vì nó chỉ cho phép các phần tử duy nhất.


## Các phương pháp hay nhất để sử dụng Bản đồ Mutable và Mutable được đặt trong Kotlin

Khi làm việc với Bản đồ Mutable và Mutable được đặt trong Kotlin, dưới đây là một số phương pháp hay nhất bạn nên làm theo:

1. **Sử dụng các hàm the` mutableMapOf()` và `mutableSetOf()`**: Các hàm này là cách đơn giản nhất để tạo bản đồ và bộ mutable.

2. **Tránh các đột biến không cần thiết**: Mặc dù có thể xảy ra đột biến nhưng tốt nhất nên tránh trừ khi cần thiết. Những đột biến không cần thiết có thể dẫn đến lỗi và làm cho mã khó hiểu hơn.

3. **Sử dụng phương pháp `put()` để thêm các phần tử vào bản đồ mutable**: Phương pháp này thêm một cặp khóa-giá trị mới vào bản đồ. Nếu bản đồ đã chứa khóa thì giá trị liên quan sẽ bị ghi đè.

4. **Sử dụng phương pháp `add()` để thêm phần tử vào bộ mutable**: Phương pháp này thêm phần tử mới vào tập hợp. Nếu tập hợp đã chứa phần tử đó thì nó sẽ không được thêm lại.














