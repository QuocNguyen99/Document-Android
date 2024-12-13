# Singleton Pattern

Singleton is a creational design pattern that allows you to keep only one instance of an object and provide global access to it. 

it solves two problems:

- Keeping only one instance of an object is useful when you want to control access to some shared resources. When you create one object of a class, if you use a singleton pattern, you will always have that same object. In case you'll try to create another one, the code will return the first initiated object each time.

- Providing a global access point to allow all clients to use the initiated instances. When you address this problem, you also should squeeze all the code regarding the first problem in one class, to avoid it being scattered all over your code.

![alt text](/resources/singleton_pattern.png)
## Implementation

to implement this pattern, we create a `Singleton` class that is connected to other parts of our application. It consists of Object `constructor` and `getInstance()` method. Through our `constructor`, we create instances when an application first needs it. Then we check the presence of this instance with our method `getInstance()` and pass it to our application. This helps us to avoid creating other instances.


> [!NOTE]
> Instead of trying to maintain one instance of a class, you can maintain a few instances. All it takes is a bit of change to the getInstance() method and keeping more than one instance. But by doing this, you'll now work with a different design pattern called multiton.
## Kiến trúc

Cách sử dụng

* Đặt constructor là private để client không thể khởi tạo object của class
* Tạo một biến static private là instance của class đó để đảm bảo rằng nó là duy nhất và chỉ được tạo ra trong class đó thôi
* Tạo một public static method trả về instance vừa khởi tạo bên trên, đây là cách duy nhất để các class khác có thể truy cập vào instance của class này

### Ưu điểm

* Có thể chắc chắn rằng một lớp chỉ có một instance
* Có khả năng truy cập đến instance từ mọi nơi (global access)
* Đối tượng singleton chỉ được khởi tạo duy nhất một lần khi nó được yêu cầu lần đầu.
* Kiểm soát truy cập đến instance duy nhất
* Giảm namespace

### Problems

- Singleton violates SRP (Single Responsibility Principle) by solving two problems at once. This could have a negative impact on your code because the solution for one problem can interfere with the solution for another.

- Components of a program can have a bit too much information about each other.

- The use of the singleton pattern makes unit testing harder.

## Trường hợp sử dụng

Singleton được sử dụng khi:

* Có thể chắc chắn rằng một lớp chỉ có một instance
* Có khả năng truy cập đến instance từ mọi nơi (global access)
* Đối tượng singleton chỉ được khởi tạo duy nhất một lần khi nó được yêu cầu lần đầu.
* Vì class dùng Singleton chỉ tồn tại 1 Instance (thể hiện) nên nó thường được dùng cho các trường hợp giải quyết các bài toán cần truy cập vào các ứng dụng như: Shared resource, Logger, Configuration, Caching, Thread pool, …
* Một số design pattern khác cũng sử dụng Singleton để triển khai: Abstract Factory, Builder, Prototype, Facade,…

## Code sample:

### No Thread Safe

```kotlin
object Singleton1 {
    private constructor()
    companion object {
        private var instance: Singleton1? = null

        fun getInstance(): Singleton1 {
            if (instance == null) {
                instance = Singleton1()
            }
            return instance!!                
        }
    }
}
```

## Thread Safety

```kotlin
object Singleton2 {
    private var instance: Singleton2? = null
    private val lock = Any()

    fun getInstance(): Singleton2 {
        synchronized(lock) {
            if (instance == null) {
                instance = Singleton2()
            }
            return instance!!
        }
    }
}
```


