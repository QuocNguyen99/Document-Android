# Type aliases

## Usage of type aliases

Type aliases provide alternative names for existing types – both standard types and custom ones. If the type name is too long, it's a good idea to introduce a different shorter name and use the new one instead.

```kotlin
class ClassWithVeryLongName{}
typealias SomeClass = ClassWithVeryLongName
```

Also, type aliases can be used if you want to emphasize the type, for example:

```kotlin
typealias Password = String
val myPassword: Password = "hyperskill"
```
> [!CAUTION]
> Remember that type aliases should be top level! You cannot place them inside classes.

An alternative to type aliases are **import aliases**.  If you're working with a long class name (especially, if you have package names within the class name), you can use import aliases to shorten it:

```kotlin
import Pet.Kitten as Kitten
```

> [!NOTE]
> You don't need to be worried that using type aliases can lead to some errors during runtime: compile time checks take care of that.

### Usage with generics

In generic programming, type aliases can be useful in shortening long generic types. For example:

```kotlin
typealias DessertBox<T> = BoxForSomeDessert<T>

class BoxForSomeDessert<T>(var dessert: T) {
    fun getDessertFromBox(): T {
        return dessert
    }
}

class Tart(var name: String) {}

fun main() {
    var tartBox = DessertBox(Tart("tastytart"))
    println(tartBox.getDessertFromBox().name) // tastytart
}
```

### Naming type aliases

Try to define readable and meaningful type aliases so that other programmers can understand your code.

```kotlin
/* bad example */
typealias SomeClass = HashMap<Int, List<String>>

/* good example */
typealias FileTable = MutableMap<Int, MutableList<File>>
```