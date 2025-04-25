# Comparable and Comparator

In Kotlin, Comparable and Comparator are two interfaces that allow developers to compare objects of the same or different classes. **Both interfaces are commonly used to sort and order collections of objects based on one or more attributes**

## Kotlin Comparable interface

The `Comparable` interface is used to define the natural ordering of objects. When a class implements `Comparable`, it must override the `compareTo()` method:

```kotlin
public operator fun compareTo(other: T): Int
```
For example, consider the following code:

```kotlin
data class Person(val name: String, val age: Int): Comparable<Person> {
  override fun compareTo(other: Person): Int {
    return this.age - other.age
  }
}
```

Now, if we have a list of `Person` objects, we can sort it by their age as follows:
```kotlin
val people = listOf(Person("Alice", 25), Person("Bob", 30), Person("Charlie", 20))
val sortedPeople = people.sorted() //[Person(name=Charlie, age=20), Person(name=Alice, age=25), Person(name=Bob, age=30)]
```

The class implementing the `Comparable` interface supports useful extension functions, among them the following:

- `coerceAtLeast()` – this function checks whether the calling object is greater than a certain minimum object. It returns the current object if it is greater; otherwise, it returns the minimum object

```kotlin
fun <T : Comparable> T.coerceAtLeast(minimumValue: T): T
```

```kotlin
fun main() {
    val people = listOf(
        Person("Alice", 25), Person("Bob", 30), Person("Charlie", 20)
    )

    val minimum = Person("Jack", 28)
    println(people[0].age.coerceAtLeast(minimum.age)) // 28
    println(people[1].age.coerceAtLeast(minimum.age)) // 30
}
```

- `coerceAtMost()` – this function checks whether the calling object is smaller than the given maximum object. It returns the current object if it's smaller; otherwise, it returns the maximum object.

```kotlin
fun <T : Comparable> T.coerceAtMost(maximumValue: T): T
```

```kotlin
fun main() {
    val people = listOf(
        Person("Alice", 25), Person("Bob", 30), Person("Charlie", 20)
    )

    val maximum = Person("Jack", 28)
    println(people[0].age.coerceAtMost(maximum.age)) // 25
    println(people[1].age.coerceAtMost(maximum.age)) // 28
}
```

- **coerceIn()** – this function checks whether the calling object lies within a certain range between the minimum and maximum values. It returns the object if it is within the range, the minimum if the object is less than the minimum, or the maximum if the object is greater than the maximum.


```kotlin
fun <T : Comparable> T.coerceIn(
    minimumValue: T?, 
    maximumValue: T?
): T
```

```kotlin
fun main() {

    println(25.coerceIn(18..28)) // 25
    println(15.coerceIn(18..28)) // 18
    println(30.coerceIn(18..28)) // 28
}
```

## Kotlin Comparator interface

**The Comparator interface is used to define a custom ordering of objects.** When a class implements `Comparator`, it must override the `compare()` method, which takes two objects of the same type as arguments and returns an integer value. It returns zero if the arguments are equal, a negative number if the first argument is less than the second, or a positive number if the first argument is greater than the second. Here's how it works:

```kotlin
data class Person(val name: String, val age: Int)

class PersonAgeComparator : Comparator<Person> {
    override fun compare(p1: Person, p2: Person): Int {
        return p1.age - p2.age
    }
}

fun main() {
    val ageComparator = PersonAgeComparator()

    // or passing lambda as compare fun
    //  val ageComparator = Comparator<Person> { p1, p2 -> p1.age - p2.age }

    val people = listOf(
        Person("Alice", 25), Person("Bob", 30), Person("Charlie", 20))
    val sortedPeople = people.sortedWith(ageComparator)
    println(sortedPeople) // [Person(name=Charlie, age=20), Person(name=Alice, age=25), Person(name=Bob, age=30)]
}
```

The `Comparator` interface has interesting methods, among them the following:

- `reversed()` – this function takes the comparator as an argument and returns a comparator with the reversed ordering of the passed comparator

```kotlin
fun <T> Comparator<T>.reversed(): Comparator<T>
```

```kotlin
data class Person(val name: String, val age: Int)

fun main() {
    val ageComparator = Comparator<Person> { p1, p2 -> p1.age - p2.age }.reversed()

    val people = listOf(
        Person("Alice", 25), Person("Bob", 30), Person("Charlie", 20))
    val sortedPeople = people.sortedWith(ageComparator)
    println(sortedPeople) // [Person(name=Bob, age=30), Person(name=Alice, age=25), Person(name=Charlie, age=20)]
}
```

You can see more methods in Kotlin documentation.

## Differences between Comparable and Comparator

The main difference between `Comparable` and `Comparator` is that `Comparable` defines the natural ordering of objects, while `Comparator` defines a custom ordering of objects.


> [!TIP]
> When objects of the same class are being compared, it's recommended to implement `Comparable` to provide a natural ordering for them.
> When objects of different classes are compared or custom orderings are required, it's recommended to implement `Comparator`.
