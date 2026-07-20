# Serialize

## `@Serializable`

The `@Serializable `annotation marks a Kotlin class as serializable, enabling automatic generation of serializers by the Kotlin Serialization plugin. This facilitates seamless conversion between Kotlin objects and formats like JSON, ProtoBuf, or BSON

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

## `@SerialName`

The `@SerialName` annotation allows customization of the serialized name for a class or property. This is particularly useful when the desired serialized name differs from the Kotlin property name, such as when adhering to specific naming conventions or interfacing with external APIs
