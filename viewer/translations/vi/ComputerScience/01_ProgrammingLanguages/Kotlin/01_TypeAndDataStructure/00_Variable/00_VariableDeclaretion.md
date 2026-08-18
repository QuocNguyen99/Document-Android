# Khai báo biến

## Khai báo biến

Để khai báo một biến, Kotlin cung cấp hai từ khóa:
- val (for value) khai báo một **biến chỉ đọc (chỉ là giá trị được đặt tên)**, biến này không thể thay đổi sau khi đã được khởi tạo, do đó, một giá trị có thể được gán một lần (điều này thực tế không hoàn toàn đúng, chúng ta sẽ thảo luận vấn đề này chi tiết hơn sau);
- var (đối với biến) khai báo biến mutable, có thể thay đổi (nhiều lần nếu cần).
- const được sử dụng cho các biến (có val) **được biết tại thời điểm biên dịch**.

### Biến giá trị và khả năng thay đổi

Điều quan trọng cần lưu ý là `val` không phải là từ đồng nghĩa của **immutable**

Ví dụ:

```kotlin
// list creation
val myMutableList = mutableListOf(1, 2, 3, 4, 5)
// trying to update the list
myMutableList = mutableListOf(1, 2, 3, 4, 5, 6) // error line
```

**Luôn có thể thay đổi trạng thái bên trong của biến val**: mặc dù việc gán lại biến bị cấm nhưng nội dung của nó có thể được sửa đổi theo một số cách khác.

Ví dụ:

```kotlin
// list creation
val myMutableList = mutableListOf(1, 2, 3, 4, 5)
// adding a new element
myMutableList.add(6)   // it works
// printing the list
println(myMutableList) // [1, 2, 3, 4, 5, 6]
```

Như bạn có thể thấy, mã này đã thay đổi trạng thái bên trong của `myMutableList` bằng cách thêm một số nguyên khác. Khi gọi hàm `add()`, chúng tôi không thay đổi chính biến mà thay đổi danh sách mà nó đại diện.

> [!TIP]
> Nếu bạn đã quen thuộc với Java programming language, bạn có thể dễ dàng nghĩ về các biến val Kotlin như các biến cuối cùng của Java.
> Chúng khá giống nhau: cả hai đều cấm gán lại giá trị cho biến nhưng cho phép thay đổi trạng thái bên trong của đối tượng.

### Biến cố định

Trong Kotlin, cũng có một công cụ sửa đổi const, được sử dụng trước từ khóa val để khai báo hằng số thời gian biên dịch. Giá trị của biến const được biết tại thời điểm biên dịch và sẽ không bị thay đổi tại runtime. Có một số hạn chế về thời điểm có thể áp dụng công cụ sửa đổi const.
- Đầu tiên, nó chỉ có thể được sử dụng với một biến String hoặc một biến kiểu nguyên thủy.

```kotlin
const val CONST_INT = 127
const val CONST_DOUBLE = 3.14
const val CONST_CHAR = 'c'
const val CONST_STRING = "I am constant"
const val CONST_ARRAY = arrayOf(1, 2, 3) // error: only primitives and strings are allowed
```

- Ngoài ra, các biến const cần được khai báo ở cấp cao nhất, bên ngoài bất kỳ hàm nào:

```kotlin
const val MY_INT_1 = 1024 // correct line

fun main() {
    const val MY_INT_2 = 2048 // error: Modifier 'const' is not applicable to 'local variable'
}
```

### Khi nào nên sử dụng biến val

Một cách thực hành tốt là sử dụng các biến val theo mặc định. Sau đó, khi thấy cần thiết đối với mã, hãy thay đổi chúng thành các biến var
Cách tiếp cận này cho phép bạn viết chương trình với số lượng biến mutable tối thiểu, dẫn đến ít lỗi hơn.

### Quy ước đặt tên

Khi khai báo các biến val và const trong Kotlin, best practice phải tuân theo các quy ước đặt tên của Kotlin để đảm bảo mã của bạn dễ đọc và dễ bảo trì.

Đối với các biến `val`, hãy sử dụng định dạng **camelCase**. 

```kotlin
val numberOfWheels: Int
val isConnectionAvailable: Boolean
val userFirstName: String
```
Các biến `const` là các hằng số thời gian biên dịch. Vì chúng đại diện cho các giá trị tĩnh, không thể thay đổi nên tên của chúng phải bằng chữ in hoa, có dấu gạch dưới phân cách các từ

```kotlin
const val MAX_USER_COUNT = 50
const val COMPANY_NAME = "TechCorp"
const val VERSION_CODE = 3
```

### Đặt tên biến

Các lập trình viên có kinh nghiệm rất thận trọng trong việc chọn tên cho các biến, vì vậy mã của họ rất dễ theo dõi. Điều này rất quan trọng vì các lập trình viên dành nhiều thời gian để đọc mã do người khác viết. 

Để tránh những lỗi mã không thể đọc được:

- Luôn đặt tên mô tả và ngắn gọn cho tất cả các biến.
- Tuân theo quy ước đặt tên.
- Tránh các số ma thuật, Các giá trị như vậy phải được lưu trữ trong các biến immutable, cụ thể là hằng số.
- Tuân theo các quy tắc Kotlin hạn chế các tên có thể có cho các biến.
    - Tên có phân biệt chữ hoa chữ thường (số không giống Số);
    - Mỗi tên chỉ được bao gồm các chữ cái, chữ số và dấu gạch dưới;
    - Tên không được bắt đầu bằng chữ số;
    - Tên không thể là từ khóa (ví dụ: val, var, fun là bất hợp pháp).



## Khởi tạo lười biếng

Khởi tạo lười biếng cho phép chúng ta tạo một đối tượng tại điểm chính xác khi tham chiếu đầu tiên đến nó xảy ra.

Điều này có nghĩa là chúng ta không cần lãng phí thời gian bằng cách sử dụng ngay tài nguyên của chương trình để phân bổ bộ nhớ cho các đối tượng không được yêu cầu ngay từ đầu.

Nếu chúng ta cho phép khởi tạo các đối tượng khi cần thiết, chúng ta có thể tiết kiệm rất nhiều thời gian bằng cách phân phối lại việc phân bổ tài nguyên trong vòng đời của chương trình.


Kotlin có chức năng `lazy()` đặc biệt chấp nhận lambda. Cuộc gọi đầu tiên thực thi lambda này và ghi nhớ kết quả. Các cuộc gọi tiếp theo chỉ cần trả về giá trị này.

Ví dụ:

```kotlin
fun main() {
    val a: String by lazy {
        print("Variable a is initialized. ")
        "I love Hyperskill!"
    }

    println("Initializing a! ") // Initializing a!
    println(a) // Variable a is initialized. I love Hyperskill!
    println(a) // I love Hyperskill!
}
```

> [!NOTE]
> Khi sử dụng khởi tạo lười biếng trong Kotlin, bạn phải khai báo các biến bằng từ khóa val vì giá trị chỉ có thể được khởi tạo một lần.

### Sự cố Synchronization

Nếu chương trình của bạn tận dụng multithreading, bạn cần biết về tham số chế độ của hàm `lazy()`.

- `LazyThreadSafetyMode.SYNCHRONIZED` có nghĩa là giá trị chỉ được tính trong một thread và tất cả các thread sẽ nhận được cùng một giá trị. Đây là tùy chọn mặc định nên bạn có thể bỏ qua nếu muốn:

```kotlin
val a: String by lazy(LazyThreadSafetyMode.SYNCHRONIZED) {
     //... 
     }
```
- `LazyThreadSafetyMode.PUBLICATION` chỉ định lambda có thể được gọi nhiều lần với giá trị đối tượng lười chưa được khởi tạo, nhưng giá trị được trả về trước sẽ được sử dụng:

```kotlin
val a: String by lazy(LazyThreadSafetyMode.PUBLICATION) {
     //...
     }
```

- `LazyThreadSafetyMode.NONE` nghĩa là không có synchronization nào cả, vì vậy nếu chúng ta gọi biến từ các thread khác nhau thì giá trị của nó không thể được xác định duy nhất. Bạn không nên sử dụng tùy chọn này nếu chương trình của bạn cho phép một đối tượng lười biếng được gọi lần đầu tiên từ nhiều hơn một thread:

```kotlin
val a: String by lazy(LazyThreadSafetyMode.None) {
     //..
     }
```

Có thể bạn đang thắc mắc tại sao từ khóa by lại được dùng trước từ khóa lười biếng? Vâng, nó liên quan đến các đại biểu. Đây là cách chúng tôi **ủy thác** việc triển khai thuộc tính tương ứng cho lambda.

###ban đầu muộn

Một tính năng khởi tạo bị trì hoãn khác trong Kotlin đáng được nhắc đến là `lateinit`. Đây là một từ khóa chứ không phải là một chức năng như `lazy()`.

Chúng tôi không thể sử dụng phương pháp sau vì giá trị mặc định của trường phải được khởi tạo:

```kotlin
var a: String
```

Chúng ta có thể tạo ra một giá trị rỗng, nhưng chúng ta không muốn điều đó xảy ra!
```kotlin
var a: String? = null
```
May mắn thay, `lateinit` có thể được sử dụng để giải quyết vấn đề này:

```kotlin
lateinit var a: String

fun initA(a: String) {
    this.a = a
}
```

Phương pháp này cho phép chúng tôi đặt giá trị của `a` trong `initA()`
hoạt động tại một điểm thuận tiện sau khi đối tượng đã được tạo.

> [!NOTE]
> các biến Lateinit phải được khai báo bằng var, không giống như các biến được khai báo bằng lười().

Chúng tôi cũng có thể kiểm tra xem thuộc tính đã được khởi tạo chưa.
Để xem nó hoạt động như thế nào, hãy thêm một hàm vào lớp của chúng ta.
Như được hiển thị bên dưới, `isInitialized` có thể được gọi trên trường của đối tượng hiện tại thông qua `this::a`,
trả về đúng hoặc sai:

```kotlin 
lateinit var a: String

fun initA(a: String) {
    this.a = a
}

fun doSmth() {
    if (::a.isInitialized)
        println("a is Initialized")
    else
        println("a isn't Initialized")
}
```

> [!CAUTION]
> Nếu bạn cố truy cập một thuộc tính trước khi nó được khởi tạo, sẽ xuất hiện lỗi:
> Nguyên nhân do: kotlin.UninitializedPropertyAccessException: thuộc tính Lateinit a chưa được khởi tạo

## Thành viên cuối cùng

Trong các ngôn ngữ lập trình như Java và C++, từ khóa cuối cùng được sử dụng để chỉ ra rằng một giá trị, phương thức hoặc lớp không thể thay đổi hoặc ghi đè. Tuy nhiên, trong Kotlin, tình hình có phần khác.

**Trong Kotlin, theo mặc định, tất cả các lớp và phương thức đều là cuối cùng.** Điều này có nghĩa là nếu bạn khai báo một lớp trong Kotlin, bạn sẽ không thể kế thừa nó cho đến khi bạn biến nó thành `open` một cách rõ ràng.  **Tương tự, các phương thức và thuộc tính trong Kotlin theo mặc định cũng là cuối cùng** và chúng không thể bị ghi đè trong các lớp con cho đến khi chúng được khai báo là `open`.
**Khai báo lỗi**
```kotlin
class MyFinalClass {
    fun myFinalMethod() {
        println("This method cannot be overridden!")
    }
}

class MyChildClass : MyFinalClass() { // Error! Cannot inherit MyFinalClass
    override fun myFinalMethod() { // Error! Cannot override myFinalMethod
        println("I'm trying to override your method!")
    }
}
```
**Tuyên bố đúng cách**
```kotlin
open class MyBaseClass {
    open fun myMethod() {
        println("Basic implementation")
    }
}

class MyDerivedClass : MyBaseClass() {
    override fun myMethod() {
        println("Overridden implementation")
    }
}
```
Bạn có thể thắc mắc tại sao Kotlin lại áp dụng cách tiếp cận như vậy. Câu trả lời rất đơn giản: cách tiếp cận này góp phần tạo ra mã an toàn hơn, dễ dự đoán hơn. Xét cho cùng, nếu một lớp hoặc phương thức có thể được kế thừa hoặc ghi đè tùy ý, điều đó có thể dẫn đến những hậu quả không mong muốn.

### 'cuối cùng' sau 'mở'

Điều quan trọng cần lưu ý là bạn có thể sử dụng `final` cho các phương thức hoặc thuộc tính được ghi đè để ngăn chúng bị xác định lại thêm. Hãy lấy một ví dụ:

```kotlin
open class MyBaseClass {
    open fun myMethod() {
        println("Basic implementation")
    }
}

open class MyIntermediateClass : MyBaseClass() {
    final override fun myMethod() {
        println("An overridden implementation that cannot be redefined further")
    }
}

class MyDerivedClass : MyIntermediateClass() {
    override fun myMethod() { // Error! Cannot override myMethod
        println("I'm trying to override your method!")
    }
}
```

## Công cụ sửa đổi hiển thị cho thành viên

Công cụ sửa đổi mức độ hiển thị là các từ khóa đặc biệt xác định phần nào trong mã của bạn được phép sử dụng. Có bốn công cụ sửa đổi quyền truy cập trong Kotlin: **riêng tư**, **được bảo vệ**, **nội bộ** và **công khai**.

- Từ khóa `public` được sử dụng để thông báo cho compiler rằng thứ gì đó sẽ có sẵn ở mọi nơi
- Nếu bạn đánh dấu một khai báo là `private`, nó sẽ chỉ hiển thị bên trong tệp chứa khai báo.
- `protected` giống với `private`, ngoại trừ việc nó có thể được nhìn thấy trong các lớp con.
- Nếu bạn đánh dấu nó là `internal`, nó sẽ hiển thị ở mọi nơi trong cùng một mô-đun.

## Khả năng hiển thị của các hàm tạo trong một lớp

Bạn cũng có thể chỉ định một công cụ sửa đổi cho hàm tạo: ví dụ: đặt hàm tạo chính của lớp ở chế độ riêng tư. Hãy nhớ thêm từ khóa `constructor` rõ ràng:

```kotlin
class Student private constructor(val name: String) {
    var age: Int = 0

    constructor(name: String, _age: Int) : this(name) {
        age = _age
    }
}

val anna: Student = Student("Anna")     // Error Cannot access 'constructor(name: String): Student': it is private in '/Student'.
val mark: Student = Student("Mark", 23) // ok
```