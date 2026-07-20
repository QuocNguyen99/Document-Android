# Chức năng như đối tượng

Kotlin cung cấp cách làm việc với các hàm như thể chúng là các đối tượng.

## Công dân hạng nhất

Công dân hạng nhất trong lập trình là những đối tượng:

1. có thể được lưu trữ dưới dạng biến,
2. có thể được trả về bởi một hàm,
3. có thể được truyền vào một hàm làm đối số,
4. không phụ thuộc vào tên của họ (Ví dụ: `Int` với tên mười không cần phải là `10`. Và ngược lại: giá trị `10` không cần được lưu trữ dưới tên mười.)
5. Có thể được tạo tại chương trình runtime (thời điểm chương trình đang hoạt động).

Ví dụ: `Int` là công dân hạng nhất trong Kotlin. 
Trên thực tế, **các hàm cũng là công dân hạng nhất trong ngôn ngữ Kotlin**.

## Các loại hàm

Kotlin có hỗ trợ tích hợp cho các loại chức năng.
Cú pháp của một kiểu hàm như sau:

`(parameters' types) -> return value type`

Trong một loại hàm có:
- **biểu tượng mũi tên** `(->)` ở giữa
- **loại tham số trong ngoặc đơn được phân tách bằng dấu phẩy** ở bên trái
- **kiểu giá trị trả về** được viết bên phải.

Hãy nhớ lại một số chức năng từ các chủ đề trước và sử dụng chúng làm ví dụ:

```kotlin
fun sum(a: Int, b: Int): Int = a + b
```

`sum` có loại `(Int, Int) -> Int`.

```kotlin
fun sayHello() {
    println("Hello")
}
```
`sayHello` có loại `() -> Unit` 

## Tham chiếu hàm dưới dạng đối tượng

Ngoài ra, Kotlin cho phép lấy tham chiếu đến các hàm. 
Để tham chiếu đến hàm cấp cao nhất, chúng ta chỉ cần viết dấu hai chấm kép (`::`) trước tên của nó và chúng ta không viết dấu ngoặc đơn và đối số sau tên. 

Hãy xem ví dụ: `::sum` cung cấp cho chúng ta một đối tượng thuộc loại `(Int, Int) -> Int`.

> [!NOTE] 
> Trong Kotlin, hàm cấp cao nhất là hàm được xác định ở cấp cao nhất của tệp, bên ngoài bất kỳ lớp hoặc đối tượng nào.



Bây giờ chúng ta đã sẵn sàng gán tham chiếu hàm cho các giá trị! Chúng ta có thể tạo ra các giá trị theo cách này:

```kotlin
val sumObject = ::sum
```

Đừng nhầm lẫn phép gán này với việc lưu kết quả hàm vào một giá trị như sau: `val sumResult = sum(1, 2)`. Giá trị `sumResult` có loại `Int` vì **kết quả** của hàm tổng được gọi chỉ là một **số.** Trong khi đó, giá trị `sumObject` được khởi tạo với tham chiếu đến hàm `sum` (`::sum`), do đó, nó có loại Chức năng `sum`.

Chúng tôi cũng có thể chỉ định rõ ràng loại giá trị sumObject:

```kotlin
val sumObject: (Int, Int) -> Int = ::sum
```

Trong cả hai trường hợp, chúng ta đều có cơ hội gọi hàm tổng ban đầu bằng cách **gọi đối tượng**: `sumObject(10, 20)` trả về `30` như thể chúng ta gọi trực tiếp hàm ban đầu với các đối số này.


## Hàm trả về các hàm khác
Vì một hàm có thể được lưu trữ dưới dạng một đối tượng, tại sao không tạo một hàm trả về một đối tượng như vậy?
Ví dụ:

```kotlin
fun getRealGrade(x: Double) = x
fun getGradeWithPenalty(x: Double) = x - 1

fun getScoringFunction(isCheater: Boolean): (Double) -> Double {
    if (isCheater) {
        return ::getGradeWithPenalty
    }

    return ::getRealGrade
}
```

Vì vậy, nếu chúng ta thực hiện `val wantedFunction = getScoringFunction(false)`, giá trị wantedFunction sẽ chứa tham chiếu đến hàm chấm điểm dành cho một học sinh trung thực. Xem cách triển khai hàm `getScoringFunction`, chúng ta có thể nói rằng trong trường hợp này, giá trị `wantedFunction` chứa tham chiếu đến hàm `getRealGrade`. Vì vậy kết quả của `wantedFunction(9.0)` sẽ bằng `9.0`.

## Tham chiếu hàm dưới dạng tham số hàm

Ngoài ra, bạn có thể tạo các hàm lấy các hàm khác làm đối số.

Bán tại:
```kotlin
fun applyAndSum(a: Int, b: Int, transformation: (Int) -> Int): Int {
    return transformation(a) + transformation(b)
}
```
Nó nhận hai số nguyên, biến đổi chúng bằng hàm biến đổi đã nhận và trả về tổng của các số nguyên được chuyển đổi. Chúng ta có thể khai báo một số hàm chuyển đổi:

```kotlin
fun same(x: Int) = x
fun square(x: Int) = x * x
fun triple(x: Int) = 3 * x
```

Và sau đó chuyển chúng sang hàm cũ:

```kotlin
applyAndSum(1, 2, ::same)    // returns 3 = 1 + 2
applyAndSum(1, 2, ::square)  // returns 5 = 1 * 1 + 2 * 2
applyAndSum(1, 2, ::triple)  // returns 9 = 3 * 1 + 3 * 2
```

## Tham khảo theo lớp

Ngoài ra, bạn có thể tham chiếu các hàm thuộc về một lớp. Cú pháp cơ bản trong những trường hợp như vậy trông như thế này:

```kotlin
objectOrClass::functionName
```

Ở đây, `objectOrClass` có thể là **tên lớp** hoặc **phiên bản cụ thể** của một lớp.

Ví dụ: 

```kotlin
class Person(val name: String, val lastname: String) {

    fun printFullName(): String {
        return("full name: $name $lastname")
    }
}
```
Ở đây, chúng ta tạo một tham chiếu hàm:
```kotlin
val person: Person = Person("Sara", "Rogers")
val personFun: () -> String = person::printFullName

```
## Tham chiếu đến hàm tạo của Lớp
Tài liệu tham khảo này có khai báo sau:
```kotlin
class Person (val name: String){
}

val personGenerator: (String) -> Person = ::Person

val johnFoster: Person = personGenerator("John Foster")
```



## Cách sử dụng trong thế giới thực

Còn những ví dụ thực tế hơn thì sao? Vâng, hãy tự mình xem.

Loại `String` có phương thức lọc để lọc ký hiệu. 
Làm sao nó biết ký hiệu nào cần loại bỏ khỏi chuỗi và ký hiệu nào cần để lại trong chuỗi? 

Câu trả lời rất đơn giản: phương thức này lấy **vị ngữ** làm đối số và sau đó sử dụng nó cho các phép tính nội bộ. **Vị ngữ là một hàm nhận một đối số và trả về kết quả Boolean**.

Vì vậy, trong phương thức lọc, vị từ cho biết có nên để lại ký hiệu hay không và có loại `(Char) -> Boolean`.

Hãy thử sử dụng phương pháp này. Nếu chúng ta muốn xóa dấu chấm khỏi một chuỗi, chúng ta khai báo vị từ này:

```kotlin
fun isNotDot(c: Char): Boolean = c != '.'
```

Sau đó chúng ta có thể làm một cái gì đó như thế này:

```kotlin
val originalText = "I don't know... what to say..."
val textWithoutDots = originalText.filter(::isNotDot)
```