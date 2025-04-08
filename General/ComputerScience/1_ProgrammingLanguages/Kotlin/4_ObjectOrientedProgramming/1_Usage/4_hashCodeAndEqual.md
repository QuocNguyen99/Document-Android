# hashCode and equals

One of the most frequent problems is check two objects for equality. For this task, we can use two fundamental methods: `hashCode()` and `equals()`.


### The hashCode() method

A hash function is a special function that can be used to map data of any size to fixed-size values.

One of the fundamental properties of hash functions is that they always return the same value for the same content or input information, that is, if we pass them the same content value, they will always return the same hash code.

This property can be used to check if two objects are equal based on their content and their hash. **If the content of two objects, that is, their state, is the same, their hash code must be the same.**

To obtain the hash code for the state of an object, we can make use of the `hashCode()` functions for the types or simple classes Kotlin has already pre-calculated: `Int`, `Long`, `String`, etc.

```kotlin
    val intValue = 32
    val intValue2 = 64
    val intValue3 = 32

    println(intValue.hashCode()) // 32
    println(intValue2.hashCode()) // 64
    println(intValue3.hashCode()) // 32

    println(intValue.hashCode() == intValue2.hashCode()) // false
    println(intValue.hashCode() == intValue3.hashCode()) // true
```

To get the hash code for the state of our class, **we must override** the default `hashCode()` (inherited from `Any`) according to the properties of our class. This way, we can get the proper `hashCode()` method to represent the state of our object.

```kotlin
class Person(val name: String, val age: Int) {
    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age.hashCode()
        return result
    }
}

fun main() {
    val person1 = Person("John", 32)
    val person2 = Person("John", 32)
    val person3 = Person("John", 64)

    println(person1.hashCode()) // 71750741
    println(person2.hashCode()) // 71750741
    println(person3.hashCode()) // 71750773

    println(person1.hashCode() == person2.hashCode()) // true
    println(person1.hashCode() == person3.hashCode()) // false
}
```
### Standard Formula
```kotlin
override fun hashCode(): Int {
    var result = field1?.hashCode() ?: 0
    result = 31 * result + (field2?.hashCode() ?: 0)
    // Repeat for other fields...
    return result
}
```


> [!NOTE]
> The value `31` was chosen because it is an odd prime. 
> If it were even and the multiplication overflowed, information would be lost, as multiplication by `2` is equivalent to shifting. 
> The advantage of using a prime is less clear, but it is traditional.
> A nice property of `31` is that the multiplication can be replaced by a shift and a subtraction for better performance: `31 * i == (i << 5) - i`.
> Modern VMs do this sort of optimization automatically.

### The equals method

What is the `equals` method? This special method compares two objects and returns true if they are **equal**. This method exists by default for all objects and is defined in `Any`, **so we must override it to adapt it to the nature and definition of our classes**.

we can make use of the equals method that already exists implemented in the basic Kotlin types or classes: `Int`, `Long`, `String`, etc. we can either call it or use the == operator.


```kotlin
fun main() {
    val intValue = 32
    val intValue2 = 64
    val intValue3 = 32

    println(intValue.equals(intValue2)) // false
    println(intValue.equals(intValue3)) // true
    println(intValue == intValue2) // false
    println(intValue == intValue3) // true

    val stringValue = "Hello"
    val stringValue2 = "Hello"
    val stringValue3 = "Hello World"

    println(stringValue.equals(stringValue2)) // true
    println(stringValue.equals(stringValue3)) // false
    println(stringValue == stringValue2) // true
    println(stringValue == stringValue3) // false
}
```

To perform the right operation of `equals` for the state of our class, we must override the default `equals()`

```kotlin
class Person(val name: String, val age: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Person) return false

        if (name != other.name) return false
        return age == other.age
    }
}

fun main() {
    println(person1.equals(person2)) // true
    println(person1.equals(person3)) // false
    println(person1 == person2) // true
    println(person1 == person3) // false
}
```

### equals and hashCode relationship

Normally, the `hashCode()` method is overridden so that it behaves in the way `equals()` does: that is, if two objects are equal, they must have the same hash value. So, if two objects are equal, `hashCode()` produces the same integer result. Hence, `equals()` returns true if `hashCode()` is equal, else it returns false. This is very important, as `equals()` and `hashCode()` must be consistent and based on the same object properties to be calculated.

```kotlin
class Person(val name: String, val age: Int) {
    override fun hashCode(): Int {
        var result = name.hashCode()
        result = 31 * result + age.hashCode()
        return result
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Person) return false

        if (name != other.name) return false
        return age == other.age
    }
}

fun main() {
    println(person1.hashCode() == person2.hashCode()) // true
    println(person1.hashCode() == person3.hashCode()) // false
    println(person1 == person2) // true
    println(person1 == person3) // false
}
```
### equals and hashCode in data classes

When we are working with data classes, the `equals()` and `hashCode()` methods are implemented and defined automatically based on the state of the properties that define our data class in the constructor.

