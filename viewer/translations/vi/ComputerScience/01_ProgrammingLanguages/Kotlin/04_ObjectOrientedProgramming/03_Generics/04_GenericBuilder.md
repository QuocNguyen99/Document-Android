# Trình tạo chung

Trình xây dựng chung là một trình xây dựng an toàn kiểu tiên tiến kết hợp các công cụ chung.

Chúng cho phép tạo ra các trình xây dựng có thể xây dựng các đối tượng thuộc bất kỳ loại nhất định nào, được chỉ định tại thời điểm trình tạo được gọi.
Điều này đặc biệt hữu ích khi bạn muốn tạo một trình tạo không bị ràng buộc với một loại cụ thể và có thể được sử dụng lại trên nhiều loại khác nhau.

Ví dụ: bạn có thể muốn tạo một danh sách các loại đối tượng khác nhau bằng cách sử dụng cùng một tòa nhà process. 
Bằng cách sử dụng trình tạo chung, bạn có thể xác định logic xây dựng một lần và áp dụng nó cho bất kỳ loại nào bạn cần.

## Triển khai các trình tạo chung trong kotlin

Chúng tôi sẽ tạo một trình tạo đơn giản cho danh sách các mục trong đó loại mục không được xác định trước. 
Trình xây dựng của chúng tôi sẽ sử dụng các tính năng DSL của Kotlin để cung cấp một cách rõ ràng và trực quan để thêm các mục vào danh sách.


```kotlin
class GenericListBuilder<T> {
    private val items = mutableListOf<T>()

    fun item(item: T) {
        items.add(item)
    }

    fun build(): List<T> = items
}

fun <T> buildList(builderAction: GenericListBuilder<T>.() -> Unit): List<T> {
    val builder = GenericListBuilder<T>()
    builder.builderAction()
    return builder.build()
}

val intList = buildList {
    item(1)
    item(2)
    item(3)
}
val stringList = buildList {
    item("one")
    item("two")
    item("three")
}
```

Trong ví dụ này, `GenericListBuilder` là một lớp có tham số loại `T`, đại diện cho loại mục trong danh sách. 
Phương thức item thêm một phần tử vào danh sách mutable nội bộ của loại `T`. 
Phương thức `build` trả về danh sách immutable của các mục đã thêm.

Hàm `buildList` là higher-order function lấy lambda với receiver, cho phép chúng ta sử dụng phương thức `item` bên trong lambda để thêm các phần tử vào danh sách. 
Chúng tôi sử dụng hàm này để tạo danh sách các số nguyên và chuỗi, thể hiện khả năng sử dụng lại của trình tạo chung của chúng tôi.








