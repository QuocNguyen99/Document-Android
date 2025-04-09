## Type bound

Sometimes we need to restrict the type parameter inside a generic function or class.  For example, we have a generic class `Storage<T>` and we want to make it store only books without creating one more class. In such a situation, we should use **type bounds**.

We can add our limitation by adding a constraint `T : Book` inside angle brackets:

```kotlin
class Storage<T : Book>() {
      // some code
}
```

Then we create the classes whose objects we want to store:

```kotlin
open class Book {}
class Magazine : Book() {}
class Stone {}
```

Now let's create instances of `Storage<T>`:

```kotlin
val storage1 = Storage<Book>()
val storage2 = Storage<Magazine>()
val storage3 = Storage<Stone>() // compile-time error
```

By default, all type parameters are constrained by the type `Any?`. `SomeGeneric<T>` is the same as `SomeGeneric<T : Any?>`.

> [!CAUTION]
> As constraints, we can set not only classes but interfaces, too. Do not try to extend one generic class from another — it will lead to an error.

### Usage with functions

Type bounds can be used with generic functions, too. The principle of usage with functions is the same as with classes.


```kotlin
fun <T : Book> sortByDate(list: List<T>) { ... }
```

### Multiple bounds

If you need multiple type bounds, you need to use the **where-clause** to separate them.

```kotlin
fun <T> sortByDate(list: List<T>)
     where T : Book, T : Watchable<T> {...}
```

> [!NOTE]
> When you use multiple bounds, the first type should be a class or an interface. The following types must be interfaces.


### Definitely non-nullable types


In addition to the type bounds we've covered, there's another concept that is essential to understand when working with generics, especially in the context of interoperability with Java—the concept of **definite non-nullability**. This is particularly useful when dealing with generic Java classes and interfaces.


Since Kotlin 1.7.0, we can declare a generic type parameter as definitely non-nullable. This is achieved by declaring the type with the syntax `T & Any` (intersection type of `T` and `Any`).

Suppose we have the following Java interface `Game<T>`:

```kotlin
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x);

    @NotNull
    public T load(@NotNull T x);
}
```

To override this method in Kotlin, the type `T1` needs to be declared as definitely non-nullable:

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1

    override fun load(x: T1 & Any): T1 & Any // T1 is definitely non-nullable

 // override fun load(x: T1): T1
 // ^ This won't compile
}
```
