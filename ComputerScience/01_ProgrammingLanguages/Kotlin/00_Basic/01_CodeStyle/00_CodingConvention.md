# Coding Conventions

It is a fact that programmers can spend more time reading code written by others than creating it from scratch. That is why it is so important to write clearly and concisely. 

## Source file names

**Use an upper camel case with an uppercase first letter** (also known as Pascal case), for example, `ProcessDeclarations.kt`.

> [!TIP]
> If a Kotlin file contains a single class or interface (potentially with related top-level declarations), its name should be the same as the name of the class, with the .kt extension appended. 
> It applies to all types of classes and interfaces. If a file contains multiple classes, or only top-level declarations, choose a name describing what the file contains, and name the file accordingly. 

**The name of the file should describe what the code in the file does. Therefore, you should avoid using meaningless words such as `Util` in file names.**

## Class layout

The contents of a class should go in the following order:

1. Property declarations and initializer blocks

2. Secondary constructors

3. Method declarations

4. Companion object

> [!TIP]
> Put nested classes next to the code that uses those classes. If the classes are intended to be used externally and aren't referenced inside the class, put them in the end, after the companion object.

## Interface implementation layout

When implementing an interface, keep the implementing members in the same order as members of the interface (if necessary, interspersed with additional private methods used for the implementation).

## Naming rules

Package and class naming rules in Kotlin are quite simple:

- Names of packages are always lowercase and do not use underscores (org.example.project). Using multi-word names is generally discouraged, but if you do need to use multiple words, you can either just concatenate them together or use **the camel case** (org.example.myProject).

- Names of classes and objects start with an uppercase letter and use the camel case:

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### Function names

Names of functions, properties and local variables start with a lowercase letter and use the camel case and no underscores:

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```
**Exception**: factory functions used to create instances of classes can have the same name as the abstract return type:

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### Property names

Names of constants (properties marked with `const`, or top-level or object val properties with no custom get function that hold deeply immutable data) **should use uppercase underscore-separated (screaming snake case)** names:

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```
Names of top-level or object properties which hold objects with behavior or mutable data should **use camel case names**:

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

Names of properties holding references to singleton objects can use the same naming style as object declarations:

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

> [!NOTE]
> For enum constants, it's OK to use either uppercase underscore-separated names (screaming snake case) (enum class Color { RED, GREEN }) or upper camel case names, depending on the usage.


> [!CAUTION]
> Jetpack Compose framework development MUST name deeply immutable constants following the permitted object declaration convention of PascalCase as documented here as a replacement for any usage of CAPITALS_AND_UNDERSCORES. Enum class values MUST also be named using PascalCase as documented in the same section.
### Names for backing properties

If a class has two properties which are conceptually the same but one is part of a public API and another is an implementation detail, use an underscore as the prefix for the name of the private property:

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### Choose good names

**The name of a class is usually a noun or a noun phrase explaining what the class is**: `List`, `PersonReader`.

**The name of a method is usually a verb or a verb phrase saying what the method does**: `close`, `readPersons`. The name should also suggest if the method is mutating the object or returning a new one. For instance `sort` is sorting a collection in place, while `sorted` is returning a sorted copy of the collection.

The names should make it clear what the purpose of the entity is, so it's best to avoid using meaningless words (Manager, Wrapper) in names.

For Example:

**Don't**

```kotlin
class NetworkManager {
    fun connect() {
        // code to connect to network
    }

    fun disconnect() {
        // code to disconnect from network
    }
}
```

**Do**

```
class NetworkConnectionHandler {
    fun connect() {
        // code to connect to network
    }

    fun disconnect() {
        // code to disconnect from network
    }
}
```



When using an acronym as part of a declaration name, capitalize it if it consists of two letters (IOStream); capitalize only the first letter if it is longer (XmlFormatter, HttpInputStream).

## Formatting

### Indentation

Use four spaces for indentation. Do not use tabs.

For curly braces, put the opening brace at the end of the line where the construct begins, and the closing brace on a separate line aligned horizontally with the opening construct.

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

### Class headers

Classes with a few primary constructor parameters can be written in a single line:

```kotlin
class Person(id: Int, name: String)
```

Classes with longer headers should be formatted so that each primary constructor parameter is in a separate line with indentation. Also, the closing parenthesis should be on a new line. If you use inheritance, the superclass constructor call, or the list of implemented interfaces should be located on the same line as the parenthesis:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

For multiple interfaces, the superclass constructor call should be located first and then each interface should be located in a different line:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

For classes with a long supertype list, put a line break after the colon and align all supertype names horizontally:

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

### Functions

If the function signature doesn't fit on a single line, use the following syntax:

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

### Control flow statements


In a when statement, if a branch is more than a single line, consider separating it from adjacent case blocks with a blank line:

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken ->
            callback.visitValue(propName, token.value)

        Token.LBRACE -> { // ...
        }
    }
}
```

### Wrap chained calls

When wrapping chained calls, put the `.` character or the `?`. operator on the next line, with a single indent:

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

### Lambda

In lambda expressions, spaces should be used around the curly braces, as well as around the arrow which separates the parameters from the body. If a call takes a single lambda, pass it outside parentheses whenever possible.

```kotlin
list.filter { it > 10 }
```

If assigning a label for a lambda, do not put a space between the label and the opening curly brace:

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

When declaring parameter names in a multiline lambda, put the names on the first line, followed by the arrow and the newline:

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```
If the parameter list is too long to fit on a line, put the arrow on a separate line:

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### Trailing commas

A trailing comma is a comma symbol after the last item in a series of elements:

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

Using trailing commas has several benefits:

- It makes version-control diffs cleaner – as all the focus is on the changed value.

- It makes it easy to add and reorder elements – there is no need to add or delete the comma if you manipulate elements.

- It simplifies code generation, for example, for object initializers. The last element can also have a comma.

### Decomposing a program into functions

Functional decomposition is the process of decomposing a problem into several functions. Each function does a particular task which we can perform in a row to get the results we need. Considering a problem, we need to identify the actions that will be repeated multiple times or, alternatively, performed separately. This is how we get the desired functions that are easier to read, understand, reuse, test, and debug.