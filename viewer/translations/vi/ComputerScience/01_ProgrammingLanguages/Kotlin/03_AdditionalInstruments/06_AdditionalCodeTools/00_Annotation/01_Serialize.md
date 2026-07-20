# Tuần tự hóa

##`@Serializable`

`@Serializable `annotation đánh dấu lớp Kotlin là có thể tuần tự hóa, cho phép tạo tự động các bộ tuần tự hóa bằng plugin Kotlin Serialization. Điều này tạo điều kiện chuyển đổi liền mạch giữa các đối tượng và định dạng Kotlin như JSON, ProtoBuf hoặc BSON

```kotlin
import kotlinx.serialization.*
import kotlinx.serialization.json.*

@Serializable
data class Project(val name: String, val language: String)

fun main() {
    val data = Project("kotlinx.serialization", "Kotlin")
    val json = Json.encodeToString(data)
    println(json) // Output: {"name":"kotlinx.serialization","language":"Kotlin"}
}
```

##`@SerialName`

Chú thích `@SerialName` cho phép tùy chỉnh tên được tuần tự hóa cho một lớp hoặc thuộc tính. Điều này đặc biệt hữu ích khi tên được xê-ri hóa mong muốn khác với tên thuộc tính Kotlin, chẳng hạn như khi tuân thủ các quy ước đặt tên cụ thể hoặc giao tiếp với các API bên ngoài
