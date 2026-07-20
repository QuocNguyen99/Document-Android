# Nhà xây dựng

Bạn đã biết cách khai báo các lớp đơn giản với các thuộc tính đơn giản. Bây giờ chúng ta hãy tìm hiểu về một loại thành viên khác của lớp: hàm tạo.

## Hàm tạo mặc định

Các nhà xây dựng là các thành viên của lớp khởi tạo một đối tượng mới của lớp.

Mỗi lớp cần phải có một hàm tạo, vì vậy nếu nó không được xác định rõ ràng, compiler sẽ tự động tạo một hàm tạo chính mà không có đối số, chỉ tạo một đối tượng và không có bất kỳ logic nào bên trong.

## Hàm tạo chính

Thường thì bạn biết các thuộc tính của đối tượng trước khi tạo nó. Để làm cho mã của bạn ngắn gọn hơn, bạn có thể đặt các thuộc tính trong hàm tạo: chỉ cần làm cho hàm tạo nhận được các đối số bạn cần.
Hàm tạo chính là công cụ phù hợp cho việc đó. Nó không chứa bất kỳ mã nào, nó chỉ khởi tạo một thể hiện của một lớp và các thuộc tính của nó.

Thông thường, để định nghĩa hàm tạo, bạn nên đặt từ khóa hàm tạo trước các tham số của nó. **Hàm tạo chính của Kotlin cho phép bạn bỏ qua từ khóa.**

## Khai báo thuộc tính
Bạn có thể đặt các khai báo thuộc tính đơn giản bên trong hàm tạo chính.
Để khai báo thuộc tính chỉ đọc, hãy đặt từ khóa `val` trong ngoặc đơn trước tên đối số.
Đối với thuộc tính mutable, hãy sử dụng từ khóa `var`.

## Đối số mặc định và được đặt tên

Các giá trị mặc định trong hàm tạo chính được đặt theo cách tương tự như trong nội dung lớp. Bạn khai báo thuộc tính bằng từ khóa `val` hoặc `var` và đặt giá trị mặc định sau toán tử gán:
```kotlin
class Size(var width: Int = 1, var height: Int = 1) {
    val area: Int = width * height
}
```

## Bắt đầu

Hàm tạo chính không thể chứa bất kỳ mã nào: chúng chỉ đặt giá trị của thuộc tính lớp dựa trên các đối số được truyền.

- Đôi khi, chúng ta muốn thiết lập một số thuộc tính của mình dựa trên giá trị của thuộc tính khác hoặc các nguồn thông tin khác.
Trong những trường hợp như vậy, chúng tôi sẽ sử dụng các khối khởi tạo, có tiền tố là từ khóa `init`:

```kotlin
class Size(_width: Int, _height: Int) {
    var width: Int = 0
    var height: Int = 0

    init {
        width = if (_width >= 0) _width else {
            println("Error, the width should be a non-negative value")
            0
        }
        height = if (_height >= 0) _height else {
            println("Error, the height should be a non-negative value")
            0
        }
    }
}
```

- Từ khóa `init` biểu thị một khối mã đóng vai trò là phần mở rộng của hàm tạo chính
Ví dụ: **mã bên dưới in thông báo sau khi các thuộc tính đối tượng đã được đặt trong hàm tạo chính**:

```kotlin
class Size(val width: Int, val height: Int) {
    init {
        println("Initializer block that prints the width ($width) and the height ($height)")
    }
}
```

- Có thể có một số khối khởi tạo trong thân lớp. 

Trong trường hợp này, các bộ khởi tạo thuộc tính và các khối `init` được thực thi theo thứ tự xuất hiện của chúng:

```kotlin
class Size(_width: Int, _height: Int) {
    // 1: the width property is initialized
    val width = _width

    // 2: 1st init block is executed
    init {
        println("First initializer block that prints the width $width")
    }

    // 3: the height property is initialized
    val height = _height

    // 4: 2nd init block is executed
    init {
        println("Second initializer block that prints the height $height")
    }

    // 5: the area property is initialized
    val area = width * height
}
```

## Chức năng mở rộng

cú pháp để định nghĩa một hàm mở rộng giống như định nghĩa một hàm đơn giản.
Chỉ cần viết **name** của **class** mà bạn muốn mở rộng và thêm **dấu chấm** trước tên hàm. Lớp được mở rộng được gọi là **loại receiver**.

>[!NOTE]
> Trong Kotlin, loại receiver là một tham số đặc biệt của hàm lambda giúp nó có khả năng truy cập trực tiếp vào các thành viên (thuộc tính và phương thức) của đối tượng receiver tương ứng, 
> không có bất kỳ vòng loại nào.


Bạn có thể truy cập vào trường của một đối tượng trong hàm mở rộng gần như dễ dàng như trong hàm thành viên. Đối tượng đó được gọi là **đối tượng receiver**.

>[!NOTE]
> Trong Kotlin, đối tượng receiver là một phiên bản đối tượng mở rộng chức năng của nó bằng hàm.


```kotlin
class Client(val name: String, val age: Int)

fun Client.getInfo() = "$name $age" // Client is the receiver type


val client = Client("John", 32)
print(client.getInfo()) // client is the receiver object
```

>[!NOTE]
> Lưu ý, nếu nhà phát triển ẩn một số thông tin và mã của bạn không lấy được thì chức năng mở rộng cũng không thể truy cập được. Vì vậy, nó hoạt động giống một hàm đơn giản hơn, không phải hàm thành viên

## Hàm tạo phụ

Để khai báo một hàm tạo phụ, hãy viết từ khóa `constructor` bên trong thân lớp và đặt các tham số của hàm tạo trong dấu ngoặc đơn sau từ khóa.

## Nhiều hàm tạo

Việc tạo một số hàm tạo cho một lớp cũng gần như đơn giản như chỉ tạo một lớp, nhưng có một hạn chế cụ thể mà bạn cần lưu ý. Mỗi hàm tạo phụ phải có một **chữ ký** duy nhất. Bạn không thể sử dụng **chữ ký** giống nhau cho hàm tạo chính hoặc bất kỳ hàm tạo nào khác

**Chữ ký của hàm tạo bao gồm số, loại và thứ tự của các tham số**. Để tạo một hàm tạo hợp lệ, bạn cần đảm bảo rằng nó có một danh sách tham số duy nhất.

```kotlin
class Person {
    var name: String
    var age: Int

    // Primary constructor
    constructor(name: String, age: Int) {
        this.name = name
        this.age = age
    }

    // Secondary constructor with a different signature
    constructor(name: String) : this(name, 18) // Default age = 18

    // Another secondary constructor with a different parameter type
    constructor(age: Int) : this("Unknown", age)

    fun printInfo() {
        println("Name: $name, Age: $age")
    }
}
```

> [!CAUTION]
> Lưu ý rằng bạn không thể sử dụng từ khóa `val` và `var` trong hàm tạo phụ.

## Phái đoàn nhà xây dựng

Nếu một lớp có một hàm tạo chính thì mỗi hàm tạo phụ cần gọi hàm tạo chính đó, trực tiếp hoặc gián tiếp thông qua (các) hàm tạo phụ khác. **Điều này được gọi là ủy quyền**.

Việc ủy ​​quyền cho một hàm tạo khác của cùng lớp được thực hiện bằng từ khóa `this` được đặt sau các đối số của hàm tạo và trước phần thân của hàm tạo:

```kotlin
class Size(val width: Int, val height: Int) {
    var area: Int = width * height

    constructor(width: Int, height: Int, outerSize: Size) : this(width, height) {
        outerSize.area -= this.area
        println("Updated outer object's area is equal to ${outerSize.area}")
    }
}
```

> [!IMPORTANT]
> Ủy quyền cho hàm tạo chính trở thành câu lệnh đầu tiên của hàm tạo phụ, do đó các thuộc tính được khởi tạo trước khi mã hàm tạo phụ được thực thi. 
> Các khối khởi tạo, nếu có, cũng được thực thi trước hàm tạo phụ. Nếu một lớp không có hàm tạo chính, việc ủy ​​quyền sẽ diễn ra ngầm.

### Thực thi hàm tạo

Hãy xem ví dụ và xem mã lớp được thực thi theo thứ tự nào:

```kotlin
class Size(val width: Int, val height: Int) {
    var area: Int = width * height

    init {
        println("Object with area equal to $area is created")
    }

    constructor(width: Int, height: Int, outerSize: Size) : this(width, height) {
        outerSize.area -= this.area
        println("Updated outer object's area is equal to ${outerSize.area}")
    }
}

fun main() {
    val outerObject = Size(5, 8)
    val innerObject = Size(2, 3, outerObject)
}
```
Đầu ra:
```bash
Object with area equal to 40 is created
Object with area equal to 6 is created
Updated outer object's area is equal to 34
```

## Ghi đè hàm tạo

Sử dụng inheritance và polymorphism, chúng ta có thể mở rộng các hàm tạo siêu lớp trong các lớp con.

### Nguyên tắc cơ bản của ghi đè

Trong ngữ cảnh của object-oriented programming (OOP), **ghi đè** là một cơ chế cho phép một lớp con cung cấp việc triển khai một phương thức đã được xác định trong siêu lớp của nó.

### Ghi đè hàm tạo trong Kotlin

Như đã đề cập trước đó, các hàm tạo không thể bị ghi đè trong Kotlin. Tuy nhiên, bạn có thể định nghĩa hàm tạo trong các lớp con sử dụng hoặc **mở rộng** hàm tạo của siêu lớp.


Khi khai báo một lớp con, chúng ta có thể sử dụng các từ khóa `open`, `final` và `override` để điều khiển inheritance và polymorphism.

- `open`: cho phép các lớp con kế thừa hoặc ghi đè các hàm, thuộc tính.
- `final`: ngăn chặn các lớp con ghi đè các chức năng hoặc thuộc tính.
- `override`: được lớp con sử dụng để ghi đè các hàm hoặc thuộc tính của lớp cha.

```kotlin
open class Person(open val name: String)

class Employee(override val name: String, val id: Int) : Person(name)  // We override the property name.
```

### Ghi đè hàm tạo trong thực tế

Mặc dù các hàm tạo không thể được ghi đè trực tiếp trong Kotlin, bạn vẫn có thể sử dụng các hàm tạo của siêu lớp khi xác định các lớp con, đây là một thành phần quan trọng của inheritance trong OOP.

### Inheritance và hàm tạo phụ

Một lớp dẫn xuất có thể sử dụng một hoặc nhiều lớp đó để khởi tạo lớp cơ sở bằng cách triển khai nhiều hàm tạo.

```kotlin
open class Base(val beta: Int, val gamma: Int, var message: String = "") {
    constructor(beta: Int, message: String = "") : this(beta, 0, message)
}

class Derived(val alpha: Int, beta: Int, gamma: Int, message: String = "") : Base(beta, gamma, message) {
    constructor(alpha: Int, beta: Int, message: String = "") : this(alpha, beta, 0, message)
}

Base(10)                    // beta is set
Base(10, 20)                // beta and gamma are set
Base(10, 20, "My message")  // beta, gamma, and a message are set
Base(10, "My message")      // beta and a message are set

Derived(0, 10)
Derived(0, 10, 20)
Derived(0, 10, 20, "My message")
Derived(0, 10, "My message")
```

Tất nhiên, nếu chúng ta muốn hạn chế các cách mà lớp `Derived` của chúng ta có thể được khởi tạo, thì chúng ta nên sử dụng thêm các hàm tạo phụ.

```kotlin
open class Base(val beta: Int, val gamma: Int = 0, var message: String = "")

class Derived : Base {
    val alpha: Int

    constructor(alphaConstr: Int, beta: Int) : super(beta) {
        alpha = alphaConstr
    }

    constructor(alphaConstr: Int, beta: Int, gamma: Int) : super(beta, gamma) {
        alpha = alphaConstr
    }

    constructor(alphaConstr: Int, beta: Int, gamma: Int, message: String) : super(beta, gamma, message) {
        alpha = alphaConstr
    }

    constructor(alphaConstr: Int, beta: Int, message: String) : super(beta, message = message) {
        alpha = alphaConstr
    }
}
```

### Inheritance và init

Trong trường hợp một lớp có hàm tạo chính, một số khối `init` và một số hàm tạo phụ, thì thứ tự thực hiện như sau:

- Hàm tạo chính, ngay cả khi hàm tạo phụ được gọi. Cái chính được gọi đầu tiên thông qua từ khóa `this`;
- Tất cả các khối `init`, tuần tự theo thứ tự xuất hiện;
- Khối hàm tạo thứ hai, trong trường hợp hàm tạo này được gọi.
- Hàm tạo chính của lớp cơ sở, ngay cả khi hàm tạo phụ của lớp cơ sở được gọi thông qua lớp dẫn xuất;
- Các khối `init` lớp cơ sở, tuần tự theo thứ tự chúng xuất hiện;
- Khối hàm tạo thứ cấp của lớp cơ sở, trong trường hợp hàm tạo này được gọi;
- Hàm tạo chính của lớp dẫn xuất, ngay cả khi hàm tạo phụ của lớp dẫn xuất được gọi;
- Các khối `init` lớp dẫn xuất, tuần tự theo thứ tự xuất hiện;
- Khối xây dựng phụ của lớp dẫn xuất, trong trường hợp hàm tạo này được gọi.

Đoạn mã sau là một ví dụ ở trên

```kotlin
open class Base(val message: String, val email: String) {
    init { println("Base class init") }
    constructor(email: String) : this("No message", email) { println("Base class secondary") }
}

class Derived(email: String) : Base(email) {
    init { println("Derived class init") }
    constructor() : this("example.com") { println("Derived class secondary") }
}

fun main() {
    val myDerived = Derived()
}
```
Đầu ra: 

```bash
Base class init
Base class secondary
Derived class init
Derived class secondary
```

## Ghi đè thuộc tính

> [!NOTE]
> Cơ chế chính hoạt động đối với các thuộc tính cũng như đối với các phương thức. 

Khi khai báo lại các thuộc tính từ siêu lớp trong lớp dẫn xuất, chúng phải được đặt trước từ khóa ghi đè và có loại tương thích.

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Triangle : Shape() {
    override val vertexCount = 3
}
```
Một thuộc tính được khai báo có thể được ghi đè bằng thuộc tính có bộ khởi tạo hoặc thuộc tính có phương thức `get`. 

> [!CAUTION]
> Được phép ghi đè thuộc tính `val` bằng thuộc tính `var`, nhưng không được phép ghi đè thuộc tính ngược lại. 
> Điều này là do thực tế là thuộc tính `val` vốn đã bao gồm phương thức `get` và khi được ghi đè dưới dạng `var`, phương thức `set` cũng được khai báo trong lớp dẫn xuất

```kotlin
interface Shape {
    val vertexCount: Int
}


class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```
