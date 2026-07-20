# Networking HTTP Client

## Retrofit Serialization

Retrofit is a library that simplifies HTTP communication by turning remote APIs into declarative, type-safe interfaces

It allows you to customize your requests with annotations, convert `JSON` responses into `Java` objects,
and handle asynchronous calls with callbacks or coroutines.

You can define the model look like this:

```kotlin
@Serializable
class Drink(
    val id: Int,
    val image: String,
    val name: String,
    val type: String
)

/*
JSON example
[
  {
    "id": 1,
    "image": "https://raw.githubusercontent.com/hatepoint/hyperskill-networking/main/images/5.jpg",
    "name": "Caffè Americano",
    "type": "americanos"
  },
  {
    "id": 2,
    "image": "https://raw.githubusercontent.com/hatepoint/hyperskill-networking/main/images/2.jpg",
    "name": "Dark Roast Coffee",
    "type": "brewed"
  },
  ...
]
*/ 
```

The model is used to represent the JSON data that you will get (or send) from API,
It’s a class that has the fields which will be mapped correspondingly to JSON properties you’ve got as an answer from a server.
The `@Serializable` annotation. This annotation marks the class as capable of being serialized or deserialized,
enabling it to be converted to a format suitable for network transmission or persistent storage and later reconstructed back into an object with the original data.


> [!NOTE]
> Serialization is the process of converting an object's state into a format that can be stored or transported.
> This is especially useful in networking because it allows complex data structures to be sent over a network in a form that can be accurately reconstructed on the other side

















































