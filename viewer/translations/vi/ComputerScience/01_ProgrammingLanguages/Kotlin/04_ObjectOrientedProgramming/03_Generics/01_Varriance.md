# Phương sai


Ví dụ: chúng tôi biết rằng `Int` là một kiểu con của `Number`. 
Hãy tưởng tượng chúng ta có `Box<T>`: bây giờ, `Box<Int>` là một kiểu con của `Box<Number>`, hay `Box<Dog>` là một kiểu con của `Box<Animal>?`. Hãy cùng xem:

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

Vấn đề ở đây là gì? Tất cả những vấn đề này đều liên quan đến phương sai.

Phương sai áp dụng khi bạn có mối quan hệ kiểu giữa hai loại và bạn muốn duy trì mối quan hệ đó khi bạn sử dụng các lớp đó làm tham số chung. Có ba loại phương sai:

- **Bất biến**: một lớp chung được gọi là bất biến đối với tham số loại khi đối với hai loại A và B khác nhau, `Class<A>` không phải là kiểu con hay siêu kiểu của `Class<B>`.

    - **Trong mã Kotlin ở trên, các loại chung theo mặc định là bất biến, trong đó bạn có thể vừa tạo và tiêu thụ các giá trị**, nghĩa là chúng không duy trì mối quan hệ loại con giữa các loại. Đây là lý do tại sao bạn nhìn thấy lỗi trong mã. Mặc dù `Dog` là kiểu con của `Animal`, nhưng `Box<Dog>` không phải là kiểu con của `Box<Animal>` và ngược lại.
    Nó ngăn chúng ta mắc những sai lầm như đặt `Cat` vào `Box<Dog>`




- **Hiệp phương sai**: một lớp chung được gọi là hiệp biến trên tham số loại khi có các điều kiện sau: `Class<A>` là kiểu con của `Class<B>` nếu `A` là kiểu con của `B` (quan hệ kiểu con được giữ nguyên).
    - Mối quan hệ được duy trì theo cùng một hướng khi các lớp được sử dụng làm tham số chung. Nếu `Dog` là kiểu con của `Animal` thì `Box<Dog>` là kiểu con của `Box<Animal>`.**Điều này thường được phép khi tham số chung chỉ được sử dụng ở các vị trí "đầu ra" (như giá trị trả về), nhưng không được phép ở các vị trí "đầu vào" (như tham số phương thức).**
    - Ví dụ: giao diện `List` của Kotlin đại diện cho **chỉ đọc** collection, có nghĩa là nếu `Dog` là kiểu con của `Animal`, thì `List<Dog>` là kiểu con của `List<Animal>`. `List` được xác định bằng công cụ sửa đổi `out`. Công cụ sửa đổi phương sai `out` được sử dụng để khai báo một lớp là hiệp biến trên một tham số loại nhất định.
    - Ví dụ: 

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

- **Contravariance**: một lớp generic được gọi là contravariant trên tham số loại khi có các điều kiện sau: `Dog` là kiểu con của `Animal`, `Box<Animal>` là kiểu con của `Box<Dog>`
    - Điều này thường được cho phép khi tham số chung chỉ được sử dụng ở các vị trí “đầu vào” chứ không được sử dụng ở các vị trí “đầu ra”, ví dụ như trong tham số của các phương thức.
    - Lưu ý rằng khi bạn định nghĩa một lớp có contravariance bằng từ khóa `in`, nó sẽ hạn chế việc sử dụng loại `T` bên trong lớp đó. Chúng tôi khai báo lớp `Box` với công cụ sửa đổi `in` trên tham số loại `T`. Điều này cho phép chúng ta gán `Box<Animal>` cho các biến loại `Box<Dog>` và `Box<Cat>`, vì `Animal` là siêu lớp của cả `Dog` và `Cat`. 
    - Từ khóa `in` cho compiler biết rằng lớp chung (hoặc giao diện) tiêu thụ các giá trị thuộc loại `T` và không bao giờ tạo ra chúng

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
## Loại phép chiếu: phương sai tại địa điểm sử dụng

Phương sai tại nơi sử dụng đề cập đến khả năng chỉ định các công cụ sửa đổi phương sai tại thời điểm sử dụng, thay vì trong định nghĩa lớp hoặc giao diện.
Ví dụ:
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

Vì `source` được khai báo với phương sai tại địa điểm sử dụng (`out Animal`), nên nó cho phép đọc các phần tử thuộc loại `Animal` từ danh sách. Và vì `destination` được khai báo với phương sai tại địa điểm sử dụng (`in Animal`), nên nó cho phép ghi các phần tử thuộc loại `Animal` vào danh sách. Điều này cho phép chúng ta sao chép cả hai đối tượng `Dog` và `Cat` vào danh sách động vật.

## Loại phép chiếu: phép chiếu ngôi sao

Phép chiếu sao `*` trong Kotlin được sử dụng cùng với generic khi loại chính xác không xác định hoặc không quan trọng. Nó cho phép xử lý các kiểu generic một cách linh hoạt mà không cần chỉ định một kiểu cụ thể.

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


