# The main() function

- `fun` is a keyword that shows that `main()` is a function. Just a regular function;

- `main` is the function name. It is important to know that we cannot change it: if we change it, for example, to `Main()`, the program will compile but not start;

- and finally, the body of the function, as you well know, will be placed in curly braces.

So, anything you can do with a usual function, except renaming, can be done with `main()`.

## Arguments of the main function

Actually, the `main()` function may have input parameters.

They should be called args and stored in an array of strings. And the syntax of main() will look like this:

```kotlin
fun main(args: Array<String>) {}
```

but what's it for?

In simple words, the arguments of the `main()` function are the arguments of the program. You’ve probably used the opportunity of setting it many times in your life, for example, when you’ve opened a file with the "Open with...": in this case the file location is passed using the program arguments.

So, using the `main()` arguments, we transmit some additional external data to the program itself.

## Working with the command line

To send command line arguments to your application, you need a pre-compiled program.

So, consider how you can pass arguments through the console: firstly, you need a compiled program. When you have one, you call the command line. After that, you run the application with the following command:

```bash
 java -jar filename.jar args
```

## With or without arguments?

there will be no error when your file contains both versions of `main()` – with and without arguments. The program will just begin by executing `main(args: Array <String>) {}`:

```kotlin
fun main(args: Array<String>) {
    println(args[0]) // Love
    println(args[1]) // Kotlin!
}

fun main() {
    println("Hello, World!")
} // will not be called
```

What about the other type, the other number and another name of arguments? Of course, you may have a `main()` function with completely different input parameters in one file, for example, it can be `main(arg: Int)` or `main(a: Double, b: String)`, **but then it will no longer be an entry point**. It’ll be just a common function. In order for the program to start, the program file must contain either a function with the signature `main()` or `main(args: Array<String>)`.