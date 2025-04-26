# Exceptions and resources

Sometimes, we may need to work with different resources, like files, sockets, database connections, etc., and exceptions may occur in those cases, too

## Working with resources

A resource is data that can be accessed by an application. **Kotlin is a platform-independent programming language**, and it lets you directly control only variables and objects but not computer memory and its objects, such as files, sockets, databases, etc. Kotlin does, however, provide methods to access operating system resources through the JVM.

For example, when we work with files (read file, write into file, etc.), an IO stream is created.

The JVM notifies the operating system (OS) about starting the work with a file, and if everything is fine, the OS will return the file descriptor, which is used to access the file.

```kotlin
var reader = FileReader("somefile.txt")
val text = reader.readText()
reader.close()
```
When we create an instance of `FileReader`, we open an `input stream` for reading data from a file.

If you want to write something into a file, you should use `FileWriter`; below you can see an example:

```kotlin
val writer = FileWriter("somefile.txt")
writer.write("hello!")
writer.close()
```

The `close()` method is used by the JVM to release resources. If we talk about files, the OS can provide a limited number of file descriptors. If we keep creating resources without releasing them, an exception may occur because there is not enough memory. That is why resources like `FileReader`, `BufferedReader`, `Socket`, etc. must be closed when they are **not used** any longer.

However, something can go wrong after declaring certain resources, and exceptions can be thrown. It means that `close()` isn't called and system resources are not released.

### Get familiar with use()

Luckily, the above problem with resources can be solved by the `use()` method, which manages resources automatically.

```kotlin
val reader = FileReader("test.txt")
reader.use {
    reader.read()
}
```

The method takes a functional expression, executes it, and, by calling `close()` on it, releases resources every time the execution is completed – **no matter with or without an exception**.

### Closeable vs AutoCloseable

`Closeable` and `AutoCloseable` interfaces introduce objects which may hold resources (such as file or socket handles) until the resource is closed. The function `use()` is defined in both interfaces, and after we invoke it, `close()` is called automatically when exiting a try-with-resources block. `Closeable` is an older interface, but it still extends `AutoCloseable` for the sake of backward compatibility.

The main difference between `Closeable` and `AutoCloseable` is that the former has a limited exception type – **it can throw only** `IOException` **and its inheritors**. Meanwhile, in `AutoCloseable` the exception range has been expanded to `Exception`.

We can invoke the use function on any object which implements `AutoCloseable` or `Closeable`, but `AutoCloseable` is newer and more flexible.










