# Quy ước mã hóa

Có một thực tế là các lập trình viên có thể dành nhiều thời gian hơn để đọc mã do người khác viết hơn là tạo nó từ đầu. Đó là lý do tại sao việc viết rõ ràng và chính xác là rất quan trọng. 

## Tên tệp nguồn

**Sử dụng kiểu chữ hoa lạc đà với chữ cái đầu tiên viết hoa** (còn được gọi là kiểu Pascal), ví dụ: `ProcessDeclarations.kt`.

> [!TIP]
> Nếu tệp Kotlin chứa một lớp hoặc interface duy nhất (có thể có các khai báo cấp cao nhất có liên quan), tên của nó phải giống với tên của lớp, có thêm phần mở rộng .kt.
> Nó áp dụng cho tất cả các loại lớp và interface. Nếu một tệp chứa nhiều lớp hoặc chỉ các khai báo cấp cao nhất, hãy chọn một tên mô tả nội dung tệp chứa và đặt tên tệp tương ứng.

**Tên của tệp phải mô tả chức năng của mã trong tệp. Vì vậy, bạn nên tránh sử dụng những từ vô nghĩa như `Util` trong tên tệp.**

## Bố cục lớp

Nội dung của một lớp nên theo thứ tự sau:

1. Khai báo thuộc tính và khối khởi tạo

2. Hàm tạo phụ

3. Khai báo phương thức

4. Companion object

> [!TIP]
> Đặt các lớp lồng nhau bên cạnh mã sử dụng các lớp đó. Nếu các lớp được dự định sử dụng bên ngoài và không được tham chiếu bên trong lớp, hãy đặt chúng ở cuối, sau companion object.

## Bố cục triển khai interface

Khi triển khai một interface, hãy giữ các thành viên triển khai theo thứ tự giống như các thành viên của interface (nếu cần, xen kẽ với các phương thức riêng tư bổ sung được sử dụng để triển khai).

## Quy tắc đặt tên

Quy tắc đặt tên gói và lớp trong Kotlin khá đơn giản:

- Tên các gói luôn viết thường và không sử dụng dấu gạch dưới (org.example.project). Nói chung, bạn không nên sử dụng tên nhiều từ nhưng nếu thực sự cần sử dụng nhiều từ, bạn có thể ghép chúng lại với nhau hoặc sử dụng **trường hợp lạc đà** (org.example.myProject).

- Tên lớp, đối tượng bắt đầu bằng chữ in hoa và sử dụng kiểu chữ lạc đà:

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### Tên hàm

Tên của hàm, thuộc tính và biến cục bộ bắt đầu bằng chữ cái viết thường và sử dụng kiểu chữ hoa lạc đà và không có dấu gạch dưới:

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```
**Ngoại lệ**: các hàm xuất xưởng được sử dụng để tạo phiên bản của các lớp có thể có cùng tên với kiểu trả về trừu tượng:

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### Tên thuộc tính

Tên của các hằng số (thuộc tính được đánh dấu bằng `const` hoặc thuộc tính val cấp cao nhất hoặc đối tượng không có hàm get tùy chỉnh chứa dữ liệu immutable sâu) **nên sử dụng tên được phân tách bằng chữ hoa (chữ hoa rắn hét)**:

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```
Tên của các thuộc tính đối tượng hoặc cấp cao nhất chứa các đối tượng có hành vi hoặc dữ liệu mutable nên **sử dụng tên trường hợp lạc đà**:

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

Tên của các thuộc tính chứa tham chiếu đến các đối tượng đơn lẻ có thể sử dụng kiểu đặt tên giống như khai báo đối tượng:

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

> [!NOTE]
> Đối với hằng số enum, OK phải sử dụng tên được phân tách bằng chữ hoa (chữ con rắn hét) (màu lớp enum { RED, GREEN }) hoặc tên chữ hoa lạc đà, tùy thuộc vào cách sử dụng.


> [!CAUTION]
> Jetpack Compose framework phát triển MUST đặt tên sâu sắc cho các hằng số immutable tuân theo quy ước object declaration được phép của PascalCase như được ghi lại ở đây để thay thế cho mọi cách sử dụng CAPITALS_AND_UNDERSCORES. Các giá trị lớp Enum MUST cũng được đặt tên bằng PascalCase như được ghi lại trong cùng một phần.
### Tên cho thuộc tính hỗ trợ

Nếu một lớp có hai thuộc tính giống nhau về mặt khái niệm nhưng một thuộc tính là một phần của API công khai và một thuộc tính khác là chi tiết triển khai, hãy sử dụng dấu gạch dưới làm tiền tố cho tên của thuộc tính riêng tư:

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### Chọn tên hay

**Tên của một lớp thường là một danh từ hoặc một cụm danh từ giải thích lớp đó là gì**: `List`, `PersonReader`.

**Tên của một phương thức thường là một động từ hoặc một cụm động từ cho biết phương thức đó làm gì**: `close`, `readPersons`. Tên cũng phải gợi ý liệu phương thức có đang biến đổi đối tượng hay trả về một đối tượng mới hay không. Ví dụ: `sort` đang sắp xếp collection tại chỗ, trong khi `sorted` đang trả về một bản sao đã được sắp xếp của collection.

Các tên phải nêu rõ mục đích của thực thể là gì, vì vậy tốt nhất nên tránh sử dụng các từ vô nghĩa (Trình quản lý, Trình bao bọc) trong tên.

Ví dụ:

**Đừng**

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

**LÀM**

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



Khi sử dụng từ viết tắt làm một phần của tên khai báo, hãy viết hoa nếu nó bao gồm hai chữ cái (IOStream); chỉ viết hoa chữ cái đầu tiên nếu nó dài hơn (XmlFormatter, HttpInputStream).

## Định dạng

### Thụt lề

Sử dụng bốn khoảng trắng để thụt lề. Không sử dụng các tab.

Đối với dấu ngoặc nhọn, đặt dấu ngoặc nhọn mở ở cuối dòng nơi bắt đầu cấu trúc và dấu ngoặc nhọn đóng trên một dòng riêng biệt được căn chỉnh theo chiều ngang với cấu trúc mở.

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

### Tiêu đề lớp

Các lớp có một vài tham số hàm tạo chính có thể được viết trên một dòng:

```kotlin
class Person(id: Int, name: String)
```

Các lớp có tiêu đề dài hơn phải được định dạng sao cho mỗi tham số của hàm tạo chính nằm trên một dòng riêng biệt có thụt lề. Ngoài ra, dấu ngoặc đơn đóng phải nằm trên một dòng mới. Nếu bạn sử dụng inheritance, lệnh gọi hàm tạo siêu lớp hoặc danh sách các interface đã triển khai phải nằm trên cùng dòng với dấu ngoặc đơn:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

Đối với nhiều interface, lệnh gọi hàm tạo siêu lớp phải được đặt trước và sau đó mỗi interface phải được đặt ở một dòng khác nhau:

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

Đối với các lớp có danh sách siêu kiểu dài, hãy đặt dấu ngắt dòng sau dấu hai chấm và căn chỉnh tất cả các tên siêu kiểu theo chiều ngang:

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

### Chức năng

Nếu chữ ký hàm không vừa trên một dòng, hãy sử dụng cú pháp sau:

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

### Câu lệnh luồng điều khiển


Trong câu lệnh When, nếu một nhánh có nhiều hơn một dòng, hãy cân nhắc việc tách nó khỏi các khối chữ liền kề bằng một dòng trống:

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

### Gói các cuộc gọi nối tiếp

Khi kết thúc các cuộc gọi theo chuỗi, hãy đặt ký tự `.` hoặc `?`. toán tử ở dòng tiếp theo, với một dấu thụt lề duy nhất:

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

### Lambda

Trong biểu thức lambda, nên sử dụng khoảng trắng xung quanh dấu ngoặc nhọn cũng như xung quanh mũi tên phân tách các tham số khỏi phần nội dung. Nếu cuộc gọi chỉ nhận một lambda, hãy chuyển nó ra ngoài dấu ngoặc đơn bất cứ khi nào có thể.

```kotlin
list.filter { it > 10 }
```

Nếu gán nhãn cho lambda, không đặt khoảng cách giữa nhãn và dấu ngoặc nhọn mở:

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

Khi khai báo tên tham số trong lambda nhiều dòng, hãy đặt tên trên dòng đầu tiên, theo sau là mũi tên và dòng mới:

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```
Nếu danh sách tham số quá dài không vừa trên một dòng, hãy đặt mũi tên trên một dòng riêng:

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### Dấu phẩy ở cuối

Dấu phẩy ở cuối là ký hiệu dấu phẩy sau mục cuối cùng trong chuỗi phần tử:

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

Việc sử dụng dấu phẩy ở cuối có một số lợi ích:

- Nó làm cho sự khác biệt trong kiểm soát phiên bản trở nên rõ ràng hơn – vì tất cả sự tập trung đều tập trung vào giá trị đã thay đổi.

- Dễ dàng thêm và sắp xếp lại các phần tử – không cần thêm hoặc xóa dấu phẩy nếu bạn thao tác với các phần tử.

- Nó đơn giản hóa việc tạo mã, ví dụ như đối với các bộ khởi tạo đối tượng. Phần tử cuối cùng cũng có thể có dấu phẩy.

### Phân tách chương trình thành các hàm

Phân rã chức năng là process phân tách một vấn đề thành nhiều chức năng. Mỗi chức năng thực hiện một nhiệm vụ cụ thể mà chúng ta có thể thực hiện liên tiếp để có được kết quả mình cần. Khi xem xét một vấn đề, chúng ta cần xác định các hành động sẽ được lặp lại nhiều lần hoặc nói cách khác là thực hiện riêng lẻ. Đây là cách chúng tôi có được các hàm mong muốn dễ đọc, dễ hiểu, tái sử dụng, kiểm tra và gỡ lỗi hơn.