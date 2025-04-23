# Variance


For example, we know that `Int` is a subtype of `Number`. 
Imagine we have `Box<T>`: now, is `Box<Int>` a subtype of `Box<Number>`, or is `Box<Dog>` a subtype of `Box<Animal>?` Let's see:

```kotlin
class Box<T>
open class Animal
class Dog : Animal()
class Spider : Animal()

val d: Animal = Dog() // Dog is a subtype of Animal
val bd: Box<Animal> = Box<Dog>() // Error: Type mismatch
val bp: Box<Dog> = Box<Animal>() // Error: Type mismatch
val bn: Box<Number> = Box<Int>() // Error: Type mismatch
val bi: Box<Int> = Box<Number>() // Error: Type mismatch
```

What is the problem here? All these problems are related to variance.

Variance applies when you have a type relationship between two types and you want to maintain that relationship when you use those classes as generic parameters. There are three kinds of variance:

- **Invariant**: a generic class is called invariant on the type parameter when for two different types A and B, `Class<A>` is neither a subtype nor a supertype of `Class<B>`.

    - **In the above Kotlin code, generic types are by default invariant, in which you can both produce and consume values**, meaning that they do not preserve the subtype relationship between types. This is why you're seeing errors in the code. Even though `Dog` is a subtype of `Animal`, `Box<Dog>` is not a subtype of `Box<Animal>`, and vice versa.
    It prevents us from making mistakes like putting a `Cat` into a `Box<Dog>`




- **Covariance**: a generic class is called covariant on the type parameter when the following holds: `Class<A>` is a subtype of `Class<B>` if A is a subtype of B (preserved subtyping relation).
    - The relationship is preserved in the same direction when the classes are used as generic parameters. If `Dog` is a subtype of `Animal`, `Box<Dog>` is a subtype of `Box<Animal>`.**This is usually allowed when the generic parameter is only used in "output" positions (like return values), but not in "input" positions (like method parameters).**
    - For example, Kotlin’s `List` interface represents a **read-only** collection, which means that if `Dog` is a subtype of `Animal`, then `List<Dog>` is a subtype of `List<Animal>`. `List` is defined with the `out` modifier. The `out` variance modifier is used to declare a class as covariant on a certain type parameter.
    - Example: 

    ```kotlin
        open class Animal
        class Dog : Animal()
        class Cat : Animal()

        // Box class defined as covariant
        class Box<out T>

        // Now, you can use Box<Dog> wherever Box<Animal> is expected.
        val dog: Dog = Dog()
        val dogBox: Box<Dog> = Box<Dog>()
        val animalBox: Box<Animal> = dogBox // This is okay
    ```

- **Contravariance**: a generic class is called contravariant on the type parameter when the following holds: `Dog` is a subtype of `Animal`, `Box<Animal>` is a subtype of `Box<Dog>`
    - This is usually allowed when the generic parameter is only used in "input" positions, but not in "output" positions, for example, in the parameters of methods.
    - Note that when you define a class with contravariance using the `in` keyword, it restricts the usage of the type `T` inside the class. We declare the `Box` class with the `in` modifier on the type parameter `T`. This allows us to assign `Box<Animal>` to variables of type `Box<Dog>` and `Box<Cat>`, since `Animal` is a superclass of both `Dog` and `Cat`. 
    - The `in` keyword is telling the compiler that the generic class (or interface) consumes values of type `T` and never produces them

    ```kotlin
        interface Comparator<in T> {
            fun compare(e1: T, e2: T): Int
        }

        open class Animal {
            open fun feed() = println("Feeding an animal")
        }

        class Dog : Animal() {
            override fun feed() = println("Feeding a dog")
        }

        fun main() {
            val animalComparator: Comparator<Animal> = object : Comparator<Animal> {
                override fun compare(e1: Animal, e2: Animal): Int {
                    // Comparison logic goes here
                    return 0
                }
            }

            val dogComparator: Comparator<Dog> = animalComparator
            // This is okay because Comparator is contravariant in its type parameter.
        }

    ```
## Type projections: use-site variance

Use-site variance refers to the ability to specify variance modifiers at the point of use, rather than in the class or interface definition.
Example:
```kotlin
open class Animal
class Dog : Animal()
class Cat : Animal()

fun copyAnimals(source: MutableList<out Animal>, destination: MutableList<in Animal>) {
    destination.addAll(source)
}

fun main() {
    val dogs: MutableList<Dog> = mutableListOf(Dog(), Dog())
    val cats: MutableList<Cat> = mutableListOf(Cat(), Cat())

    val animals: MutableList<Animal> = mutableListOf()

    copyAnimals(dogs, animals)
    copyAnimals(cats, animals)

    println(animals)
}
```

Since `source` is declared with use-site variance (`out Animal`), it allows reading elements of type `Animal` from the list. And since `destination` is declared with use-site variance (`in Animal`), it allows writing elements of type `Animal` to the list. This allows us to copy both `Dog` and `Cat` objects to the animals list.

## Type projections: star projection

Star projection `*` in Kotlin is used with generics when the exact type is unknown or not important. It allows handling generic types flexibly without specifying a particular type.

```kotlin
open class Animal
class Dog : Animal()
class Cat : Animal()

class Box<T>(val item: T)

fun printItems(boxes: List<Box<*>>) {
    for (box in boxes) {
        println(box.item)
    }
}

fun main() {
    val dogBox = Box(Dog())
    val catBox = Box(Cat())

    val boxes: List<Box<*>> = listOf(dogBox, catBox)

    printItems(boxes)
}
```


