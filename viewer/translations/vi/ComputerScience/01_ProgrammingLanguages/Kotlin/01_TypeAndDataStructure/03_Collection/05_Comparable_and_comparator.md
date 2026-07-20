# Có thể so sánh và so sánh

Trong Kotlin, Comparable và Comparator là hai giao diện cho phép các nhà phát triển so sánh các đối tượng cùng lớp hoặc khác lớp. **Cả hai giao diện thường được sử dụng để sắp xếp và sắp xếp các bộ sưu tập đối tượng dựa trên một hoặc nhiều thuộc tính**

## Kotlin Giao diện có thể so sánh

Giao diện `Comparable` được sử dụng để xác định thứ tự tự nhiên của các đối tượng. Khi một lớp triển khai `Comparable`, nó phải ghi đè phương thức `compareTo()`:

```kotlin
public operator fun compareTo(other: T): Int
```
Ví dụ: hãy xem xét đoạn mã sau:

```kotlin
data class Person(val name: String, val age: Int): Comparable<Person> {
  override fun compareTo(other: Person): Int {
    return this.age - other.age
  }
}
```

Bây giờ, nếu chúng ta có danh sách các đối tượng `Person`, chúng ta có thể sắp xếp nó theo độ tuổi của chúng như sau:
```kotlin
val people = listOf(Person("Alice", 25), Person("Bob", 30), Person("Charlie", 20))
val sortedPeople = people.sorted() //[Person(name=Charlie, age=20), Person(name=Alice, age=25), Person(name=Bob, age=30)]
```

Lớp triển khai giao diện `Comparable` hỗ trợ các chức năng mở rộng hữu ích, trong số đó có các chức năng sau:

- `coerceAtLeast()` – chức năng này kiểm tra xem đối tượng gọi có lớn hơn một đối tượng tối thiểu nhất định hay không. Nó trả về đối tượng hiện tại nếu nó lớn hơn; mặt khác, nó trả về đối tượng tối thiểu

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

- `coerceAtMost()` – chức năng này kiểm tra xem đối tượng gọi có nhỏ hơn đối tượng tối đa đã cho hay không. Nó trả về đối tượng hiện tại nếu nó nhỏ hơn; mặt khác, nó trả về đối tượng tối đa.

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

- **coerceIn()** – hàm này kiểm tra xem đối tượng gọi có nằm trong một phạm vi nhất định giữa giá trị tối thiểu và tối đa hay không. Nó trả về đối tượng nếu nó nằm trong phạm vi, giá trị tối thiểu nếu đối tượng nhỏ hơn giá trị tối thiểu hoặc giá trị tối đa nếu đối tượng lớn hơn giá trị tối đa.


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

## Giao diện so sánh Kotlin

**Giao diện Comparator được sử dụng để xác định thứ tự tùy chỉnh của các đối tượng.** Khi một lớp triển khai `Comparator`, nó phải ghi đè phương thức `compare()`, phương thức này lấy hai đối tượng cùng loại làm đối số và trả về một giá trị số nguyên. Nó trả về 0 nếu các đối số bằng nhau, số âm nếu đối số thứ nhất nhỏ hơn đối số thứ hai hoặc số dương nếu đối số thứ nhất lớn hơn đối số thứ hai. Đây là cách nó hoạt động:

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

Giao diện `Comparator` có các phương thức thú vị, trong số đó có các phương thức sau:

- `reversed()` – hàm này lấy bộ so sánh làm đối số và trả về một bộ so sánh có thứ tự đảo ngược của bộ so sánh đã truyền

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

Bạn có thể xem thêm các phương pháp trong tài liệu Kotlin.

## Sự khác biệt giữa Bộ so sánh và Bộ so sánh

Sự khác biệt chính giữa `Comparable` và `Comparator` là `Comparable` xác định thứ tự tự nhiên của các đối tượng, trong khi `Comparator` xác định thứ tự tùy chỉnh của các đối tượng.


> [!TIP]
> Khi so sánh các đối tượng cùng loại, bạn nên triển khai `Comparable` để cung cấp thứ tự tự nhiên cho chúng.
> Khi các đối tượng thuộc các lớp khác nhau được so sánh hoặc cần có thứ tự tùy chỉnh, bạn nên triển khai `Comparator`.
