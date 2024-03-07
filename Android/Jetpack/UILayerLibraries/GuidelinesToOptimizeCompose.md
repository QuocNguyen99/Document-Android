# Jetpack Compose Guidelines to Optimize Your App Performance

### Jetpack Compose Phases

Jetpack Compose renders a frame following the three distinct phases:

- Composition: This is the first phase of the rendering. Compose run composable functions and analyze your UI information.
- Layout: Compose measure and commutates UI information on where to place the UI elements, for each node in the layout tree.
- Drawing: UI elements will be drawn on a Canvas.

![](../../../resources/composePhase.avif)

Most Composable functions follow the phases above always in the same order.

Let’s assume that you need to update the UI elements, such as the size, and color of your layout. Since the Drawing phase is already completed, Compose needs to run the phases from the first to update with the new value; this process is called Recomposition:


![](../../../resources/composePhase2.avif)

## 1. Aim to Write Stable Classes

Jetpack Compose has its dedicated runtime and it decides which Composable function should be recomposed when their inputs or states change.

**To optimize runtime performance, Jetpack Compose relies on being able to infer if a state that is being read has changed.**

Fundamentally, **there are three stability types below:**

- Unstable: Chứa dữ liệu có thể thay đổi mà không thông báo cho Composition khi có sự thay đổi.
- Stable: Chứa dữ liệu có thể thay đổi và thông báo cho Composition khi có sự thay đổi.
- Immutable: Chứa dữ liệu không thay đổi, Composition có thể xem xét dữ liệu này là ổn định.

Ví dụ về lớp ổn định và Composable ổn định:

```kotlin
data class InherentlyStableClass(val text: String)

@Composable
fun StableComposable(
    stableClass: InherentlyStableClass
) {
    Text(
        text = stableClass.text
    )
}
```

Now, let's generate compiler reports for the example above and analyze the results:

```
stable class InherentlyStableClass {
  stable val text: String
  <runtime stability> = Stable
}

restartable skippable scheme("[androidx.compose.ui.UiComposable]") fun StableComposable(
  stable stableClass: InherentlyStableClass
)
```

Các báo cáo của trình biên dịch sẽ tạo ra kết quả ở trên cho hàm có khả năng kết hợp StableComposable.

Điều này cho chúng ta biết điều gì?

Trước hết, bạn thấy rằng vì lớp dữ liệu có tất cả các tham số (trong trường hợp này là một tham số) được đánh dấu là ổn định nên độ ổn định khi chạy của nó cũng được coi là ổn định.


Khi sử dụng lớp dữ liệu ổn định và truyền vào Composable ổn định, Compose có thể nhận biết khi nào trạng thái đã thay đổi. Kết quả là Composable được đánh dấu là:

Restartable: Composable có thể khởi động lại mà không gây ra việc khởi động lại các phạm vi cha của nó.
Skippable: Composable có thể được bỏ qua khi không cần phải recompose nếu tất cả các tham số sử dụng là trạng thái không thay đổi.

Ví dụ về lớp không ổn định và Composable không ổn định:

```kotlin
data class InherentlyUnstableClass(var text: String)

@Composable
fun UnstableComposable(
    unstableClass: InherentlyUnstableClass
) {
    Text(
        text = unstableClass.text
    )
}
```

Now, you generate a Compose Compiler report again:

```
unstable class InherentlyUnstableClass {
	stable
	var text: String
	<runtime stability> = Unstable
}

restartable scheme("[androidx.compose.ui.UiComposable]") fun UnstableComposable(
  unstable unstableClass: InherentlyUnstableClass
)
```

Các lớp trạng thái và Composables có cùng một nhiệm vụ, nhưng không phải lúc nào cũng hiệu quả như nhau. Mặc dù 90% nội dung của chúng giống nhau, nhưng vì ví dụ sử dụng một lớp không ổn định, chúng ta đã mất khả năng bỏ qua Composable này khi cần thiết.

Đối với các Composables nhỏ không thực hiện nhiều công việc ngoài việc gọi các Composables khác, điều này có thể không phải là một tình huống lo lắng. Tuy nhiên, đối với các Composables lớn và phức tạp hơn, điều này có thể gây ra một lượng tác động đáng kể đến hiệu suất.

Lưu ý: Các Composables không trả về Unit sẽ không thể bị bỏ qua hoặc khởi động lại. Việc này là hiểu được vì chúng là người tạo giá trị và nên buộc các phần tử cha của chúng phải tái tạo khi có thay đổi.

>[!TIP]
>Khi sử dụng lớp dữ liệu không ổn định và truyền vào Composable không ổn định, Compose không thể nhận biết khi nào trạng thái đã thay đổi. Kết quả là Composable không được đánh dấu là skippable, điều này có thể gây ra mất hiệu suất trong các trường hợp Composable phức tạp


## 2. Rules for Writing classes


Trong đoạn trên, chúng ta đang nói về việc đảm bảo tính ổn định cho các lớp dữ liệu trong Jetpack Compose. Đây là một phần quan trọng để đảm bảo hiệu suất và độ ổn định của ứng dụng.

### 1. Không sử dụng vars trong các thuộc tính của các lớp chứa trạng thái:

Đối với tính ổn định, nên tránh sử dụng các thuộc tính có kiểu var bên trong các lớp dữ liệu chứa trạng thái.
Các thuộc tính có kiểu var có thể thay đổi giá trị mà không thông báo cho Compose, làm cho các Composable sử dụng chúng trở nên không ổn định.

Example:
Do :

```kotlin
data class InherentlyStableClass(val text: String)
```

Don't:

```kotlin
data class InherentlyUnstableClass(var text: String)
```

### 2. Các thuộc tính private vẫn ảnh hưởng đến tính ổn định:

Tại thời điểm này, vẫn chưa chắc đây là lựa chọn thiết kế hay lỗi,Dù các thuộc tính private được đánh dấu là ổn định, nhưng cả lớp vẫn được đánh dấu là không ổn định.
Ví dụ:

```kotlin
data class InherentlyStableClass(
    val publicStableProperty: String,
    private var privateUnstableProperty: String
)
```
The compiler report will mark this class as unstable:
```
unstable class InherentlyStableClass {
  stable val publicStableProperty: String
  stable var privateUnstableProperty: String
  <runtime stability> = Unstable
}
```

Looking at the results, it's fairly obvious that the compiler struggles here. It marks both individual properties as stable, even though one is not, but marks the whole class as unstable.

### 3.Không sử dụng các lớp thuộc một module bên ngoài để tạo trạng thái

Tiếc rằng, Compose chỉ có thể suy luận tính ổn định cho các lớp, giao diện, và đối tượng xuất phát từ một module được biên dịch bởi Trình biên dịch Compose. **Điều này có nghĩa là bất kỳ lớp nào có nguồn gốc bên ngoài (object level 2 in class) sẽ được đánh dấu là không ổn định, bất kể tính ổn định thực sự của nó.**

Giả sử bạn có lớp sau đây xuất phát từ một module bên ngoài và do đó không ổn định:

```kotlin
class Car(
    val numberOfDoors: Int,
    val hasRadio: Boolean,
    val isCoolCar: Boolean,
    val goesVroom: Boolean
)
```
Một cách phổ biến để xây dựng trạng thái sử dụng nó sẽ là như sau:
```kotlin
data class RegisteredCarState(
    val registration: String,
    val car: Car
)
```
Tuy nhiên, điều này gây rắc rối. Bây giờ bạn đã làm cho lớp trạng thái của mình không ổn định và do đó không thể bị bỏ qua. Điều này có thể gây ra vấn đề về hiệu suất.

May mắn thay, có nhiều cách để vượt qua vấn đề này.

Nếu bạn chỉ cần một vài thuộc tính của Car để tạo RegisteredCarState, bạn có thể làm phẳng nó như sau:

```kotlin
data class RegisteredCarState(
    val registration: String,
    var numberOfDoors: Int,
    var hasRadio: Boolean
)
```

Điều này có thể không phù hợp trong các trường hợp bạn cần toàn bộ đối tượng với tất cả các thuộc tính của nó.

Trong những trường hợp như vậy, bạn có thể tạo ra một phiên bản ổn định cục bộ như sau:

```kotlin
class CarState(
    val numberOfDoors: Int,
    val hasRadio: Boolean,
    val isCoolCar: Boolean,
    val goesVroom: Boolean
)
```
Hai đối tượng trên là hoàn toàn giống nhau, nhưng CarState là ổn định.

Do người dùng có thể cần chuyển đổi giữa hai lớp này tùy thuộc vào lớp kiến trúc nào mà họ đang làm việc với, bạn nên cung cấp các hàm ánh xạ dễ dàng đi cả hai hướng như sau:

```kotlin
fun Car.toCarState(): CarState
fun CarState.toCar(): Car
```

### 4. Không mong đợi tính bất biến từ các bộ sưu tập

Những thứ như List, Set, và Map có vẻ như là bất biến ban đầu, nhưng thực tế chúng không phải vậy và Trình biên dịch sẽ đánh dấu chúng là không ổn định.

Hiện tại, có hai phương án thay thế, phương án trực tiếp hơn bao gồm sử dụng các bộ sưu tập bất biến của Kotlin. Tuy nhiên, những cái này vẫn đang trong giai đoạn thử nghiệm và có thể không thực sự khả thi.

Giải pháp khác, một giải pháp kỹ thuật và không được khuyến nghị chính thức nhưng được cộng đồng sử dụng, là bọc các danh sách của bạn và đánh dấu lớp bọc là @Immutable.

```kotlin

@Immutable
data class WrappedList(
    val list: List<String> = listOf()
)

```
Ở đây, trình biên dịch vẫn đánh dấu thuộc tính cá nhân là không ổn định nhưng đánh dấu toàn bộ lớp bọc là ổn định.

Hiện tại, không có một giải pháp nào trong hai giải pháp trên là lý tưởng.

### 5. Flows are unstable

Mặc dù chúng có vẻ ổn định vì có thể quan sát được nhưng `Flow` không notify composition khi chúng phát ra các giá trị mới. Điều này khiến chúng inherently unstable (không ổn định từ bản chất). Chỉ sử dụng chúng nếu thực sự cần thiết.

### 6.Các Composable được inlined không thể được khởi động lại hoặc bỏ qua khi tái tạo.

Tương tự như các hàm được inlined khác, điều này có thể mang lại lợi ích về hiệu suất. Một số Composables phổ biến như Column, Row và Box đều được inlined. Do đó, đây không phải là một lời khuyên chống lại việc inlining Composables, chỉ là một gợi ý bạn nên chú ý khi inlining Composables hoặc sử dụng Composables được inlined và nhận biết cách chúng ảnh hưởng đến việc tái tạo của phạm vi cha.

## 3. Hoist state properly

Hoisting state là việc tạo ra các Composable không có trạng thái. Công thức rất đơn giản:

- Tất cả các trạng thái cần thiết phải được truyền từ Composable's caller.
- Tất cả các sự kiện phải truyền lên phía trên đến nguồn của trạng thái.
ví dụ :

```kotlin
@Composable
fun CustomButton(text: String, onClick: () -> Unit) {
    Button(onClick = onClick) {
    Text(text = text)
  }
}
```

Tiếp theo, đặt nó trong setContent.

```kotlin
setContent {
  var count by remember {
    mutableStateOf(0)
  }

  CustomButton(text = "Clicked $count times") {
    count++
  }
}
```
Nhờ việc hoist state, Composable của chúng ta hoạt động tốt, nó tuân theo luồng một chiều và dễ kiểm thử hơn.

Tuy nhiên, điều này không làm cho chúng ta hoàn toàn an toàn, vì chúng ta có thể dễ dàng sử dụng sai mẫu này trong các tình huống phức tạp hơn.

## 4. Không đọc trạng thái từ phạm vi quá cao

Giả sử bạn có một trình lưu trữ trạng thái phức tạp hơn một chút:

```kotlin
class StateHoldingClass {
  var counter by mutableStateOf(0)
  var whatAreWeCounting by mutableStateOf("Days without having to write XML.")
}
```
Và nó được sử dụng như sau:

```kotlin
@Composable
fun CustomButton(count: Int, onClick: () -> Unit) {
  Button(onClick = onClick) {
    Text(text = count.toString())
  }
}
```

Trong kịch bản giả định của chúng ta, trình lưu trữ trạng thái này được đặt trong một ViewModel, điều này là một thực hành phổ biến, và được đọc như sau:

```kotlin
setContent {
  val viewModel = ViewModel()

  Column {
    Text("This is a cool column I have")
    CustomButton(count = viewModel.stateHoldingClass.counter) {
      viewModel.stateHoldingClass.counter++
    }
  }
}
```

Ở cái nhìn đầu tiên, điều này có vẻ hoàn toàn ổn, bạn có thể nghĩ rằng vì thuộc tính StateHoldingClass.counter được sử dụng làm tham số cho CustomButton nên chỉ CustomButton mới được tái tạo, tuy nhiên điều này không đúng.

Biến count này như một state được đọc bên trong `Column`, có nghĩa là toàn bộ Column bây giờ phải được tái tạo. Nhưng nó không dừng lại ở đó. Vì Column là một hàm inline, điều này có nghĩa là nó sẽ kích hoạt lại recomposition của parent scope

May mắn bạn có một cách dễ dàng để tránh điều này, câu trả lời là giảm đọc trạng thái.

Hãy viết lại Composable của chúng ta như sau:

```kotlin
@Composable
fun CustomButton(stateHoldingClass: StateHoldingClass, onClick: () -> Unit) {
  Button(onClick = onClick) {
    Text(text = stateHoldingClass.counter.toString())
  }
}
```
Và thay đổi call site thành:

```kotlin
setContent {
  val viewModel = ViewModel()

  Column {
    Text("This is a cool column I have")
    CustomButton(stateHoldingClass = viewModel.stateHoldingClass) {
      viewModel.stateHoldingClass.counter++
    }
  }
}
```

**Bây giờ, việc đọc trạng thái xảy ra bên trong CustomButton, điều này có nghĩa là chúng ta chỉ tái tạo nội dung của Composable đó. Cả Column và phạm vi cha của nó đều không cần phải tái tạo không cần thiết trong tình huống này!**

## 5. Avoid running expensive calculations unnecessarily

Ví dụ hãy tạo một Composable như sau:

```kotlin
@Composable
fun ConcertPerformers(venueName: String, performers: PersistentList<String>) {
  val sortedPerformers = performers.sortedDescending()

  Column {
    Text(text = "The following performers are performing at $venueName tonight:")

    LazyColumn {
      items(items = sortedPerformers) { performer ->
        PerformerItem(performer = performer)
      }
    }
  }
}
```

Đây là một Composable đơn giản, nó hiển thị tên của một địa điểm, cùng với các nghệ sĩ đang biểu diễn tại địa điểm đó. Nó cũng muốn sắp xếp danh sách đó để người đọc dễ dàng tìm thấy nghệ sĩ mà họ quan tâm.

Tuy nhiên, nó có một điểm yếu chính. Nếu tên địa điểm thay đổi, nhưng danh sách các nghệ sĩ vẫn giữ nguyên, danh sách sẽ phải được sắp xếp lại. Đây là một hoạt động có thể rất tốn kém. May mắn thay, việc chỉ chạy nó khi cần thiết khá dễ dàng.


```kotlin
@Composable
fun ConcertPerformers(venueName: String, performers: PersistentList<String>) {
  val sortedPerformers = remember(performers) {
    performers.sortedDescending()
  }

  Column {
    Text(text = "The following performers are performing at $venueName tonight:")

    LazyColumn {
      items(items = sortedPerformers) { performer ->
        PerformerItem(performer = performer)
      }
    }
  }
}
```
Trong ví dụ trên, bạn đã sử dụng remember sử dụng performers như một key để tính toán danh sách được sắp xếp. Nó sẽ tính toán lại chỉ khi danh sách các nghệ sĩ thay đổi, giảm bớt sự tái tạo không cần thiết.

Nếu bạn có quyền truy cập vào đối tượng State<T> ban đầu, bạn có thể nhận được các lợi ích bổ sung bằng cách suy ra trạng thái trực tiếp từ nó, như trong ví dụ dưới đây (lưu ý sự thay đổi về chữ ký hàm):

```kotlin
@Composable
fun ConcertPerformers(venueName: String, performers: State<PersistentList<String>>) {
  val sortedPerformers = remember {
    derivedStateOf { performers.value.sortedDescending() }
  }

  Column {
    Text(text = "The following performers are performing at $venueName tonight:")

    LazyColumn {
      items(items = sortedPerformers.value) { performer ->
        PerformerItem(performer = performer)
      }
    }
  }
}
```
Ở đây, Compose không chỉ bỏ qua các tính toán không cần thiết, mà còn thông minh đủ để bỏ qua việc tái tạo phạm vi cha vì bạn chỉ đang thay đổi một thuộc tính được đọc cục bộ và không tái tạo toàn bộ hàm với các tham số mới.


## 6. Defer reads as long as possible
This section is a **simplification of the example** provided in the [official documentation](https://developer.android.com/jetpack/compose/performance) seen in Defer [reads as long as possible](https://developer.android.com/jetpack/compose/performance/bestpractices#defer-reads).


Bạn sẽ tạo một Composable nhỏ được thiết kế để được thực hiện bằng cách trượt ra:
```kotlin
@Composable
fun SlidingComposable(scrollPosition: Int) {
  val scrollPositionInDp = with(LocalDensity.current) { scrollPosition.toDp() }

  Card(
    modifier = Modifier.offset(scrollPositionInDp),
    backgroundColor = Color.Cyan
  ) {
    Text(
      text = "Hello I slide out"
    )
  }
}
```

Tương tự như trong ví dụ ban đầu, bạn đã liên kết nó với vị trí cuộn. Nhưng vì LazyColumn không sử dụng ScrollState, bạn sẽ sửa đổi một chút Composables của mình như sau:

```kotlin
@Composable
fun ConcertPerformers(
  scrollState: ScrollState,
  venueName: String,
  performers: PersistentList<String>,
  modifier: Modifier = Modifier
) {
  Column(modifier = modifier) {
    Text(
      modifier = Modifier.background(color = Color.LightGray),
      text = "The following performers are performing at $venueName tonight:"
    )

    Column(
      Modifier
        .weight(1f)
        .verticalScroll(scrollState)
    ) {
        for (item in performers) {
          PerformerItem(performer = item)
        }
      }
    }
}

@Composable
fun PerformerItem(performer: String) {
  Card(
    modifier = Modifier
      .padding(vertical = 10.dp)
      .background(
        color = Color.LightGray,
      )
      .wrapContentHeight()
      .fillMaxWidth()
    ) {
      Text(
        modifier = Modifier.padding(10.dp),
        text = performer
      )
   }
}
```

Bây giờ, bạn có thể xây dựng bố cục này như sau:

```kotlin
setContent {
  val scrollState = rememberScrollState()

  Column(
    Modifier.fillMaxSize()
  ) {
    SlidingComposable(scrollPosition = scrollState.value)

    ConcertPerformers(
      modifier = Modifier.weight(1f),
      scrollState = scrollState,
      venueName = viewModel.venueName,
      performers = viewModel.concertPerformers.value
    )
  }
}
```
Bằng cách này, bạn gặp phải vấn đề tương tự như bạn đã gặp trước đây. Đọc state ở scope quá cao và tái tạo mọi thứ bên trong setContent.  Bạn có thể muốn giải quyết nó theo cách tương tự như bạn đã làm trước đây, bằng cách truyền toàn bộ ScrollState như một tham số, nhưng có một cách rất tiện lợi khác.

Bạn có thể tạo một lambda để trì hoãn việc đọc trạng thái:


```kotlin
@Composable
fun SlidingComposable(scrollPositionProvider: () -> Int) {
  val scrollPositionInDp = with(LocalDensity.current) { scrollPositionProvider().toDp() }

  Card(
    modifier = Modifier.offset(scrollPositionInDp),
    backgroundColor = Color.Cyan
  ) {
    Text(
      text = "Hello I slide out"
    )
  }
}
```

Lambda scrollPositionProvider không thay đổi, chỉ kết quả thay đổi khi một cuộc gọi xảy ra. Điều này có nghĩa là việc đọc trạng thái hiện diễn ra bên trong SlidingComposable và bạn không gây ra việc tái tạo phạm vi cha.

Nhưng chờ đã, còn một bước tối ưu hóa bổ sung nữa có sẵn!

Compose vẽ UI theo các giai đoạn:

- Composition (chạy các Composables của bạn)
- Layout (đo lường các Composables và xác định vị trí của chúng)
- Drawing (Vẽ các phần tử lên màn hình)
Bỏ qua bất kỳ giai đoạn nào - khi có thể - sẽ giảm thiểu chi phí. Trong ví dụ của chúng tôi, bạn vẫn gây ra tái tạo, điều này có nghĩa là bạn đi qua tất cả ba bước. Tuy nhiên, vì bạn chưa thay đổi sự sắp xếp và vẫn vẽ các phần tử giống nhau trên màn hình, bạn nên bỏ qua bước này hoàn toàn.

```kotlin
@Composable
fun SlidingComposable(scrollPositionProvider: () -> Int) {

  Card(
    modifier = Modifier.offset {
      IntOffset(x = scrollPositionProvider(), 0)
    },
      backgroundColor = Color.Cyan
  ) {
    Text(
      text = "Hello I slide out"
    )
  }
}
```

Thay đổi lớn ở đây là gì? Modifier.offset(offset: Density.() -> IntOffset) được gọi trong layout phase, vì vậy bạn có thể hoàn toàn bỏ qua giai đoạn composition bằng cách sử dụng nó; điều này, lần lượt, cung cấp một lợi ích hiệu suất đáng kể.