#Jetpack Compose Tính ổn định

Bạn đã bao giờ đo lường hiệu suất của thành phần kết hợp và phát hiện ra rằng nó đang kết hợp lại nhiều mã hơn bạn mong đợi chưa? *“Tôi tưởng Compose có mục đích bỏ qua các thành phần kết hợp một cách thông minh khi trạng thái không thay đổi?”* bạn có thể hỏi. Hoặc khi đọc mã Compose, bạn có thể thấy các lớp được chú thích bằng `@Stable` hoặc `@Immutable` và tự hỏi chúng có ý nghĩa gì? Những khái niệm này có thể được giải thích bằng độ ổn định của Compose.

## TL,DR

- Compose xác định tính ổn định của từng tham số trong các thành phần kết hợp của bạn để tìm hiểu xem có thể bỏ qua tham số đó hay không trong recomposition.
- Nếu bạn nhận thấy thành phần kết hợp của mình không bị bỏ qua và điều này gây ra vấn đề về hiệu suất, thì trước tiên, bạn nên kiểm tra các nguyên nhân rõ ràng gây ra sự mất ổn định như thông số `var`.
- Chúng tôi có thể sử dụng báo cáo compiler để xác định mức độ ổn định đang được suy ra về các lớp của bạn và chúng tôi có thể sử dụng [chỉ số Composable](https://chrisbanes.me/posts/composable-metrics/) hoặc thư viện của bên thứ ba như [Mendable](https://github.com/jayasuryat/mendable)
- Các lớp Collection như `List`, `Set` và `Map` luôn được xác định là không ổn định vì không đảm bảo chúng là immutable. Thay vào đó, bạn có thể sử dụng [collection Kotlinx immutable](https://github.com/Kotlin/kotlinx.collections.immutable) hoặc chú thích các lớp của mình dưới dạng `@Immutable` hoặc `@Stable`.

- Các lớp từ các mô-đun trong đó Compose compiler không chạy luôn được xác định là không ổn định. Thêm dependency vào việc soạn runtime và đánh dấu chúng là ổn định trong mô-đun của bạn hoặc gói các lớp trong các lớp mô hình UI nếu cần.
- Mọi Composable có nên bỏ qua không? **KHÔNG.**

##Recomposition

> [!NOTE]
> Theo văn bản chính thức
"Recomposition là process để gọi lại các hàm có khả năng kết hợp của bạn khi đầu vào thay đổi. Điều này xảy ra khi đầu vào của hàm thay đổi. Khi Compose kết hợp lại dựa trên đầu vào mới, nó chỉ gọi các hàm hoặc lambda có thể đã thay đổi và bỏ qua phần còn lại. Bằng cách bỏ qua tất cả các hàm hoặc lambda không có tham số thay đổi, Compose có thể biên soạn lại một cách hiệu quả.”

Compose sẽ kích hoạt recomposition khi trạng thái ảnh chụp nhanh thay đổi và bỏ qua mọi thành phần kết hợp chưa thay đổi. Điều quan trọng là thành phần kết hợp sẽ chỉ bị bỏ qua nếu Compose có thể chắc chắn rằng không có thông số nào của thành phần kết hợp được cập nhật. Ngược lại, nếu Compose không thể chắc chắn thì nó sẽ luôn được kết hợp lại khi thành phần kết hợp gốc của nó được kết hợp lại. Nếu Compose không làm điều này thì sẽ rất khó chẩn đoán lỗi khi recomposition không kích hoạt. Sẽ tốt hơn nhiều nếu đúng và kém hiệu quả hơn một chút so với sai nhưng nhanh hơn một chút.

### Sử dụng đối tượng immutable

Đầu tiên, giả sử chúng ta định nghĩa lớp Liên hệ là immutable data class, vì vậy nó không thể thay đổi nếu không tạo một đối tượng mới:

```kotlin
data class Contact(val name: String, val number: String)
```


Khi nói đến thành phần kết hợp `ContactDetails`, Compose sẽ bỏ qua việc kết hợp lại thành phần đó. Điều này là do nó có thể thấy rằng không có tham số nào, trong trường hợp này là `contact`, đã thay đổi. Mặt khác, `ToggleButton`, đầu vào đã thay đổi và do đó nó được kết hợp lại một cách chính xác.


### Sử dụng đối tượng mutable

Còn nếu lớp Liên hệ của chúng ta được định nghĩa như vậy thì sao?

```kotlin
data class Contact(var name: String, var number: String)
```

Giờ đây, lớp `Contact` **của chúng tôi không còn là immutable** nữa, các thuộc tính của nó có thể bị thay đổi mà Compose không hề biết. Compose sẽ không còn bỏ qua thành phần kết hợp `ContactDetails` nữa vì lớp này hiện được coi là "không ổn định" (xem thêm chi tiết về ý nghĩa của điều này bên dưới). Do đó, bất cứ khi nào lựa chọn được thay đổi, `ContactRow` cũng sẽ soạn lại.


### Triển khai trong Compose compiler

Bây giờ chúng ta đã biết lý thuyết về những gì Compose đang cố gắng xác định, hãy cùng xem nó thực sự xảy ra như thế nào trong thực tế.

1. Các chức năng có thể bỏ qua và/hoặc khởi động lại:

**Có thể bỏ qua**
- khi được gọi trong recomposition, **compose có thể bỏ qua hàm nếu tất cả các tham số đều bằng giá trị trước đó của chúng.**

**Có thể khởi động lại** 
- Chức năng này đóng vai trò như một “phạm vi” nơi recomposition có thể bắt đầu (**Nói cách khác, chức năng này có thể được sử dụng làm điểm truy cập để Compose có thể bắt đầu thực thi lại mã cho recomposition sau khi thay đổi trạng thái**).

2. Loại có thể là immutable hoặc ổn định:

**Immutable** 
- Chỉ ra một loại mà giá trị của bất kỳ thuộc tính nào sẽ không bao giờ thay đổi sau khi đối tượng được xây dựng và tất cả các phương thức đều trong suốt về mặt tham chiếu. Tất cả các kiểu nguyên thủy (String, Int, Float, v.v.) đều được coi là immutable.

**Ổn định** 
- Cho biết loại là mutable, nhưng Compose runtime sẽ được thông báo nếu và khi bất kỳ thuộc tính công khai hoặc hành vi phương thức nào mang lại kết quả khác với lệnh gọi trước đó.

**Khi Compose compiler được chạy trên mã của bạn, nó sẽ xem xét mọi chức năng và loại cũng như gắn thẻ bất kỳ chức năng nào phù hợp với các định nghĩa này**. Compose xem xét các loại được chuyển vào thành phần kết hợp để xác định khả năng có thể bỏ qua của thành phần kết hợp đó. Điều quan trọng cần lưu ý là các tham số không nhất thiết phải là immutable, chúng có thể là mutable miễn là Compose runtime được thông báo về tất cả các thay đổi. Đối với hầu hết các loại, sẽ khó tuân theo quy tắc này. Tuy nhiên, Compose cung cấp các lớp mutable, như `MutableState` và `SnapshotStateMap`/`List`, xử lý việc này cho bạn. Do đó, việc sử dụng các loại này cho thuộc tính mutable của bạn sẽ cho phép lớp của bạn duy trì hợp đồng `@Stable`. Trong thực tế, nó sẽ trông giống như sau

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

@Stable
class MyStateHolder {
  var isLoading by mutableStateOf(false)
}
```

Khi trạng thái Compose thay đổi, **Compose tìm kiếm hàm có thể khởi động lại gần nhất trên tất cả các điểm trong cây nơi các đối tượng trạng thái đó được đọc.**

Lý tưởng nhất là đây sẽ là tổ tiên trực tiếp để chạy lại mã nhỏ nhất có thể. Tại đây recomposition khởi động lại. Khi thực thi lại mã, mọi hàm có thể bỏ qua sẽ bị bỏ qua nếu tham số của chúng không thay đổi. Chúng ta hãy xem lại ví dụ trước đó của chúng tôi

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

data class Contact(val name: String, val number: String)

fun ContactRow(contact: Contact, modifier: Modifier = Modifier) {
  var selected by remember { mutableStateOf(false) }
  Row(modifier) {
    ContactDetails(contact)
    ToggleButton(selected, onToggled = { selected = !selected })
  }
}
```

Ở đây, khi lựa chọn được thay đổi, hàm “có thể khởi động lại”/phạm vi composition gần nhất với nơi trạng thái thực sự được đọc là `ContactRow`.

Bạn có thể thắc mắc tại sao `Row` không được chọn làm phạm vi có thể khởi động lại gần nhất? `Row` (cũng như nhiều thành phần kết hợp nền tảng khác như `Column` và `Box`) thực chất là một hàm nội tuyến.

Vì vậy `ContactRow` là phạm vi cao nhất tiếp theo và do đó `ContactRow` sẽ thực thi lại. Thành phần kết hợp đầu tiên mà nó nhìn thấy là `Row`, như đã nêu chi tiết, đây không phải là phạm vi có thể khởi động lại, điều này cũng có nghĩa là nó không thể bỏ qua và luôn được thực thi lại trên recomposition.

Thành phần kết hợp tiếp theo là `ContactDetails`, `ContactDetails` đã được gắn thẻ là có thể bỏ qua vì lớp `Contact` đã được suy ra là **immutable**, do đó, mã được tạo bởi Compose compiler sẽ kiểm tra xem có bất kỳ thành phần nào trong số này không các tham số của thành phần kết hợp đã thay đổi. Vì liên hệ vẫn giữ nguyên nên ContactDetails bị bỏ qua.


Tiếp theo, `ToggleButton`. `ToggleButton` có thể bỏ qua nhưng trong trường hợp này không thành vấn đề, một trong các tham số của nó, được chọn, đã thay đổi và do đó nó được thực thi lại. Điều đó đưa chúng ta đến phần cuối của chức năng/phạm vi có thể khởi động lại và recomposition kết thúc.

### Kết luận
- Mục tiêu là có mã compiler tối ưu mà bạn viết tự nhiên để đạt hiệu quả.
Bỏ qua các hàm có thể kết hợp là một thành phần quan trọng để thực hiện điều đó, nhưng đó cũng là thứ cần phải an toàn 100%, nếu không sẽ rất khó chẩn đoán lỗi. Vì lý do này, các yêu cầu để một hàm bị bỏ qua là rất cao.

- **Chúng tôi đang nỗ lực cải thiện khả năng suy luận về khả năng bỏ qua của compiler nhưng sẽ luôn có những tình huống mà compiler không thể giải quyết được.**


- Hiểu cách hoạt động của các chức năng bỏ qua trong tình huống này có thể giúp bạn cải thiện hiệu suất của mình nhưng điều này chỉ nên được xem xét trong trường hợp bạn gặp vấn đề về hiệu suất đo được do độ ổn định.

- Một thành phần kết hợp không thể bỏ qua có thể không có tác dụng gì nếu thành phần kết hợp đó có dung lượng nhẹ hoặc bản thân nó chỉ chứa các thành phần kết hợp có thể bỏ qua.


## Gỡ lỗi tính ổn định

Làm cách nào để biết liệu các thành phần kết hợp của bạn có bị bỏ qua hay không? Bạn có thể thấy nó trong `Layout Inspector`! `Android Studio Dolphin` bao gồm hỗ trợ cho Compose trong `Layout Inspector`, nó cũng sẽ hiển thị cho bạn số lần các thành phần kết hợp của bạn được kết hợp lại và bị bỏ qua.

Nhưng bạn sẽ làm gì khi không thể phát hiện ra điều gì sai trái rõ ràng?

## Báo cáo Compose Compiler

compiler soạn thảo có thể đưa ra kết quả suy luận về độ ổn định của nó để kiểm tra. Bằng cách sử dụng kết quả này, bạn có thể xác định thành phần kết hợp nào có thể bỏ qua và thành phần nào không. 

> [!WARNING]
> Bạn chỉ nên sử dụng kỹ thuật này nếu bạn thực sự đang gặp vấn đề về hiệu suất liên quan đến độ ổn định. Việc cố gắng làm cho toàn bộ UI của bạn có thể bỏ qua là một hành động tối ưu hóa quá sớm và có thể dẫn đến những khó khăn trong việc bảo trì trong tương lai. Trước khi tối ưu hóa để đảm bảo độ ổn định, hãy đảm bảo bạn đang tuân theo các phương pháp hay nhất dành cho hiệu suất Compose chính thức.

Báo cáo compiler compiler không được bật theo mặc định. Chúng được kích hoạt thông qua cờ compiler, thiết lập chính xác khác nhau tùy thuộc vào dự án của bạn nhưng đối với hầu hết các dự án, bạn có thể dán tập lệnh sau vào tệp `build.gradle` gốc của mình.

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

subprojects {
 tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
  kotlinOptions {
    if (project.findProperty("composeCompilerReports") == "true") {
      freeCompilerArgs += [
        "-P",
        "plugin:androidx.compose.compiler.plugins.kotlin:reportsDestination=" +
        project.buildDir.absolutePath + "/compose_compiler"
        ]
      }
      if (project.findProperty("composeCompilerMetrics") == "true") {
        freeCompilerArgs += [
          "-P",
          "plugin:androidx.compose.compiler.plugins.kotlin:metricsDestination=" +
          project.buildDir.absolutePath + "/compose_compiler"
        ]
      }
    }
  }
}
```

Để gỡ lỗi tính ổn định của các thành phần kết hợp, bạn có thể chạy tác vụ như sau:

```bash
./gradlew assembleRelease -PcomposeCompilerReports=true
```

> [!WARNING]
> Đảm bảo luôn chạy tính năng này trên bản phát hành để đảm bảo kết quả chính xác.

Tác vụ này sẽ xuất ra ba tập tin.

`<modulename>-classes.txt` — Báo cáo về tính ổn định của các lớp trong mô-đun này.

`<modulename>-composables.txt` — Báo cáo về khả năng khởi động lại và khả năng bỏ qua của các thành phần kết hợp trong mô-đun này.

`<modulename>-composables.csv` — Phiên bản csv của tệp văn bản trên để nhập vào bảng tính hoặc xử lý qua tập lệnh.

Thay vào đó, nếu bạn chạy tác vụ `composeCompilerMetrics`, bạn sẽ nhận được số liệu thống kê tổng thể về số lượng thành phần kết hợp trong dự án của mình và các thông tin tương tự khác. Điều này không được đề cập trong bài đăng này vì nó không hữu ích cho việc gỡ lỗi.

Mở tệp `composables.txt` và bạn sẽ thấy tất cả các hàm có thể kết hợp của mình cho mô-đun đó và mỗi hàm sẽ được đánh dấu xem chúng có thể khởi động lại, có thể bỏ qua và tính ổn định của các tham số của chúng hay không.

Ví dụ :


```txt
restartable skippable scheme(“[androidx.compose.ui.UiComposable]”) fun SnackCollection(
   stable snackCollection: SnackCollection
   stable onSnackClick: Function1<Long, Unit>
   stable modifier: Modifier? = @static Companion
   stable index: Int = @static 0
   stable highlight: Boolean = @static true
)
```

Thành phần kết hợp SnackCollection này hoàn toàn có thể khởi động lại, có thể bỏ qua và ổn định. Đây thường là những gì bạn muốn, khi có thể, mặc dù không bắt buộc (chi tiết hơn ở cuối bài viết).

Tuy nhiên, chúng ta hãy xem một ví dụ khác.

```txt
restartable scheme(“[androidx.compose.ui.UiComposable]”) fun HighlightedSnacks(
   stable index: Int
   unstable snacks: List<Snack>
   stable onSnackClick: Function1<Long, Unit>
   stable modifier: Modifier? = @static Companion
)
```

Thành phần kết hợp `HighlightedSnacks` không thể bỏ qua — bất cứ khi nào thành phần này được gọi trong recomposition, thành phần này cũng sẽ kết hợp lại, ngay cả khi không có tham số nào của nó thay đổi.

Điều này xảy ra do tham số không ổn định, `snacks`.

Bây giờ chúng ta có thể chuyển sang tệp `classes.txt` để kiểm tra tính ổn định của `Snack`.


```txt
unstable class Snack {
   stable val id: Long
   stable val name: String
   stable val imageUrl: String
   stable val price: Long
   stable val tagline: String
   unstable val tags: Set<String>
   <runtime stability> = Unstable
}
```

Để tham khảo, đây là cách khai báo Snack

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

data class Snack(
  val id: Long,
  val name: String,
  val imageUrl: String,
  val price: Long,
  val tagline: String = "",
  val tags: Set<String> = emptySet()
)
```

`Snack` không ổn định. Nó có hầu hết các thông số ổn định nhưng bộ thẻ được coi là không ổn định. Nhưng tại sao lại thế này? `Set` có vẻ là immutable, nó không phải là `MutableSet`.

Thật không may, `Set` (cũng như `List` và các lớp collection tiêu chuẩn khác, sẽ sớm có thêm thông tin về điều đó) được định nghĩa là giao diện trong Kotlin, điều này có nghĩa là việc triển khai cơ bản vẫn có thể là mutable. Ví dụ, bạn có thể viết

Biến không đổi, kiểu khai báo của nó không phải là mutable nhưng cách triển khai của nó vẫn là mutable. Compose compiler không thể chắc chắn về tính bất biến của lớp này vì nó chỉ nhìn thấy kiểu được khai báo và do đó tuyên bố nó là không ổn định. Bây giờ chúng ta hãy xem làm thế nào chúng ta có thể làm cho điều này ổn định.

## Ổn định sự không ổn định

- Tạo tất cả các thuộc tính var `val`, và tất cả các thuộc tính đó thuộc loại immutable.

- Nếu điều này là không thể thì bạn sẽ phải sử dụng trạng thái Compose cho bất kỳ thuộc tính mutable nào. Điều này có nghĩa là trong thực tế, mọi thuộc tính mutable phải được hỗ trợ bởi trạng thái Compose, ví dụ: `mutableStateOf(…)`.


## Collection Kotlinx Immutable

Phiên bản 1.2 của Compose compiler bao gồm hỗ trợ cho Collection Kotlinx Immutable. Các collection này được đảm bảo là immutable và sẽ được compiler suy ra như vậy.

Việc chuyển khai báo thẻ sang như sau sẽ làm cho lớp `Snack` ổn định.

```kotlin
val tags: ImmutableSet<String> = persistentSetOf()
```

## Chú thích bằng Stable hoặc Immutable

Các lớp cũng có thể được chú thích bằng `@Stable` hoặc `@Immutable` dựa trên các quy tắc trên.

> [!CAUTION]
> Điều rất quan trọng cần lưu ý là đây là hợp đồng tuân theo các quy tắc tương ứng cho chú thích. Nó không tự tạo ra lớp Immutable/Ổn định. Chú thích sai một lớp có thể khiến recomposition bị hỏng.


**Chú thích một lớp sẽ ghi đè những gì compiler suy ra về lớp của bạn**, theo cách này, nó tương tự như toán tử `!!` trong Kotlin. Bạn nên hết sức cẩn thận khi sử dụng các chú thích này vì việc ghi đè hành vi compiler có thể khiến bạn gặp phải các lỗi không lường trước được nếu bạn hiểu sai. Nếu có thể làm cho lớp của bạn ổn định mà không cần chú thích, bạn nên cố gắng đạt được sự ổn định theo cách đó.

Các tham số gặp phải vấn đề tương tự như các lớp khi nói đến loại collection, **Danh sách luôn được xác định là không ổn định, ngay cả khi đó là collection thuộc loại ổn định**. Bạn cũng không thể đánh dấu một tham số riêng lẻ là ổn định cũng như không thể chú thích một thành phần kết hợp để luôn có thể bỏ qua.


Ví dụ :

Việc chú thích ví dụ Snack sẽ được thực hiện như sau

```kotlin
@Immutable
data class Snack(
  val id: Long,
  val name: String,
  val imageUrl: String,
  val price: Long,
  val tagline: String = "",
  val tags: Set<String> = emptySet()
)
```


Dù chọn phương thức nào thì lớp Snack sẽ được suy ra là Stable.

Tuy nhiên, khi quay lại thành phần kết hợp HighlightedSnacks, HighlightedSnacks vẫn không được đánh dấu là có thể bỏ qua:

```txt
unstable snacks: List<Snack>
```

Vậy bạn có thể làm gì?

- Sử dụng kotlinx immutable collection, thay vì Danh sách.

```kotlin
  @Composable
  private fun HighlightedSnacks(
    index: Int,
-   snacks: List<Snack>,
+   snacks: ImmutableList<Snack>,
    onSnackClick: (Long) -> Unit,
    modifier: Modifier = Modifier
  )
```

- Nếu bạn không thể sử dụng immutable collection, bạn có thể gói danh sách trong một lớp ổn định có chú thích trong trường hợp đơn giản nhất để đánh dấu danh sách đó là immutable cho Compose compiler.

```kotlin
@Immutable
data class SnackCollection(
  val snacks: List<Snack>
)
```

```kotlin
  @Composable
  private fun HighlightedSnacks(
    index: Int,
-   snacks: List<Snack>
+   snacks: SnackCollection,
    onSnackClick: (Long) -> Unit,
    modifier: Modifier = Modifier
  )
```

Sau khi thực hiện một trong hai cách này, thành phần kết hợp HighlightedSnacks hiện có thể bỏ qua và khởi động lại được.

```txt
restartable skippable scheme(“[androidx.compose.ui.UiComposable]”) fun HighlightedSnacks(
   stable index: Int
   stable snacks: ImmutableList<Snack>
   stable onSnackClick: Function1<Long, Unit>
   stable modifier: Modifier? = @static Companion
)
```

`HighlightedSnacks` bây giờ sẽ bỏ qua recomposition khi không có đầu vào nào của nó thay đổi.

## Nhiều mô-đun

Một vấn đề phổ biến khác mà bạn có thể gặp phải liên quan đến kiến ​​trúc đa mô-đun. Compose compiler sẽ chỉ có thể suy ra liệu một lớp có ổn định hay không nếu tất cả các loại không nguyên thủy mà nó tham chiếu được đánh dấu rõ ràng là ổn định hoặc trong một mô-đun cũng được xây dựng bằng Compose compiler. Nếu data layer của bạn nằm trong một mô-đun riêng biệt với lớp UI, [đây là phương pháp được đề xuất](https://developer.android.com/topic/architecture), đây có thể là sự cố bạn sẽ gặp phải. Để giải quyết vấn đề này, bạn có thể:
- Kích hoạt Compose compiler trên mô-đun data layer của bạn hoặc gắn thẻ các lớp của bạn với `@Stable` hoặc `@Immutable` nếu thích hợp.
- Điều này sẽ liên quan đến việc thêm dependency Compose vào data layer của bạn, **tuy nhiên, nó sẽ chỉ là dependency để soạn runtime chứ không phải cho Compose-UI.**
- Gói các lớp data layer của bạn trong các lớp trình bao bọc cụ thể UI bên trong mô-đun UI của bạn.

## Có nên bỏ qua mọi Composable không?

Không. Việc theo đuổi khả năng bỏ qua hoàn toàn cho mọi thành phần kết hợp trong ứng dụng của bạn là một hành động tối ưu hóa quá sớm. Có nhiều tình huống khác mà việc có thể bỏ qua sẽ không mang lại bất kỳ lợi ích thực sự nào và sẽ chỉ dẫn đến việc khó duy trì mã. Ví dụ:

- Một thành phần kết hợp không được kết hợp lại thường xuyên hoặc hoàn toàn không được kết hợp lại.
- Một thành phần kết hợp mà bản thân nó chỉ gọi các thành phần kết hợp có thể bỏ qua.


