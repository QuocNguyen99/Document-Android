# Delegate

Delegation is a process of using a certain object instead of providing implementation

## Syntax of delegation

Suppose we have fairly simple code – an interface and it's implementation:

```kotlin
interface MyInterface {
    fun print()
    val msg: String
}

class MyImplementation : MyInterface {
    override fun print() {
        println(msg)
    }

    override val msg: String = "MyImplementation sends regards!"
}
```

Now, suppose that we need to create a new class, which would 
1. have some functionality of its own
2. would implement the given interface at the same time

We'd stumble upon copy-pasting the code: we already have an implementation of this interface, but we need a different class, which, however, would still need to implement this interface.

That's where delegation comes into play. it turns out that we can happily code our new class, and when we need to use the implementation of the interface, we just reference the already existing implementation, and Kotlin does the rest. Like so:

```kotlin
class MyNewClass(  
        base: MyInterface) 
        // ^ Here we expect an implementation of MyInterface as a parameter (named "base")  
        : MyInterface by base { 
        // ^ And here we state that MyInterface is implemented by the previously obtained parameter, the one named "base"  
    override val msg = "Delegate sends regards."  
}

// We create an instance of class, implementing MyInterface
val delegate = MyImplementation()  

// Then we pass this implementation instance as a parameter
val delegatingObj = MyNewClass(delegate)  
println(delegatingObj.msg)
```

Essentially, in the constructor of this class, we require something that implements the interface `MyInterface` marked by a colon `:`, and then, using the keyword `by`, we tell the derived class that whenever it is asked to perform anything "promised" by the `MyInterface` interface, it will use the provided object to do so.

## Advantages of using class delegation

- **It simplifies code**: class delegation avoids code duplication by delegating the implementation of an interface or functionality to another class.
- **It improves composition and modularity**: instead of using inheritance, you can combine different objects to create new functionality.
- **It prevents multiple inheritance problems**: unlike inheritance, delegation does not lead to problems related to multiple inheritance, such as the "diamond problem".
- **It provides flexibility to change the behavior of objects**: you can easily replace a delegate to change the behavior of an object without changing the source code.

### Solving complications by overriding

Sometimes, however, when a class implements many interfaces, we might encounter a situation when it inherits multiple implementations of the same method or property. This leads to conflicts.

what exactly will this code do?

```kotlin
val delegate = MyImplementation()
val delegatingObj = MyNewClass(delegate)

delegatingObj.print()
```

This code will print the following line:
```bash
MyImplementation sends regards!
```

`MyNewClass` doesn't have any methods named `print()`. But it does have the `base` instance, which is an implementation of `MyInterface`, which does have the `print()` function, and that function is called when we write `delegate.print()`. So, the class `MyNewClass` just delegates this task to `MyImplementation` (the delegate). `MyImplementation` contains an overridden `msg`, which reads `MyImplementation` sends regards!, so the code just prints `MyImplementation` sends regards! to the console.

> [!NOTE]
> When you use delegation, be careful to draw a line between the overridden properties/methods of the delegating class and the ones which will use only the base implementation and its data.

Let's take a look at a more complex case featuring not one but two delegates!

```kotlin
// Defines the contract for callbacks
interface ICallbackReceiver {
    fun onBeforeAction()
    fun onAfterAction()
    fun action(function: () -> Unit) {
        onBeforeAction()
        function()
        onAfterAction()
    }
}

// Defines the contract for logging
interface ILogger {
    fun getStubDateTime() = "05.11.2022-14:31:04" // placeholder date and time

    val format: String
        get() = "[${getStubDateTime()}]: "

    fun print(s: String)
}

// Simple implementation of ILogger interface
class BasicLogger : ILogger {
    override fun print(s: String) = println(format + s)
}

// Implementation of ICallbackReceiver that uses BasicLogger for printing
class ConsoleNotifier(logger: ILogger) : ICallbackReceiver, ILogger by logger {
    val onBeforeStr = "OnBefore!"
    val onAfterStr = "OnAfter!"

    // "print" is delegated to "logger"
    override fun onBeforeAction() = print(onBeforeStr)
    override fun onAfterAction() = print(onAfterStr)
}

// Class implementing both interfaces by delegation
class ExampleParser(notifier: ConsoleNotifier, logger: BasicLogger) :
    ICallbackReceiver by notifier,
    ILogger by logger {

    fun start() = action { parseFiles() }

    fun parseFiles() {
        print("Parsing...")
        // do some file parsing
    }
}


fun main() {
    val loggerInstance = BasicLogger()
    val dateTimeNotifier = ConsoleNotifier(loggerInstance)

    val simpleParser = ExampleParser(dateTimeNotifier, loggerInstance)
    simpleParser.start()
}


```
Output
```bash
[05.11.2022-14:31:04]: OnBefore!
[05.11.2022-14:31:04]: Parsing...
[05.11.2022-14:31:04]: OnAfter!
```

Keep in mind that there is another way of specifying the constructors of `ExampleParser` class, so that it becomes more flexible and expects any implementation of the `ICallbackReceiver` and `ILogger` interfaces. This means you could pass any object that implements these interfaces, not just `ConsoleNotifier` and `BasicLogger`. **This allows for more flexibility and is generally a better practice as it follows the principle of "programming to an interface, not an implementation", which is a key principle in object-oriented programming.**
