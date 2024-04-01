# Compose

When discussing Jetpack Compose, our focus often gravitates toward Compose UI. However, it's essential to note that Jetpack Compose technically comprises three primary components:

1. Compose Compiler: Compose Compiler đóng vai trò là một thành phần quan trọng trong Jetpack Compose, được viết bằng Kotlin và được tập trung vào Kotlin Multiplatform. Khác biệt với các công cụ xử lý chú thích truyền thống như KAPT và KSP, plugin Compose Compiler trực tiếp tương tác với FIR (Frontend Intermediate Representation). Cách tiếp cận độc đáo này giúp plugin phân tích mã nguồn tĩnh trong quá trình biên dịch với nhiều thông tin hơn, chỉnh sửa mã nguồn Kotlin động và cuối cùng tạo ra bytecode Java. Đơn giản, các chú thích từ các thư viện Compose, như @Composable, hợp tác một cách phức tạp với một loạt các nhiệm vụ được thực hiện ngầm bởi Compose Compiler.

2. Compose Runtime: The Compose Runtime serves as the cornerstone of Compose's model and state management. This library operates by memoizing the state of compositions using a slot table, a concept derived from the gap buffer data structure. Under the hood (Bên trong đó), this runtime undertakes various crucial tasks. It handles essential features we commonly use in project development, including managing side-effects, preserving values with remember, triggering recomposition, storing CompositionLocal, and constructing Compose Layout nodes.

3. Compose UI: Compose UI, a vital component of Jetpack Compose, encompasses a suite of UI libraries empowering developers to craft layouts by emitting UI through Composable functions. Compose UI libraries offer a variety of components facilitating the construction of Compose layout trees. These layout trees, once created, are consumed by the Compose Runtime. Leveraging the capabilities of Kotlin Multiplatform, JetBrains released a stable of Compose Multiplatform, and now you can build the same layout with the same Compose UI libraries for each different platform, such as Android, iOS, desktop, and web assembly.


In this article, we’ll focus on Compose UI, State, Side-effects, CompositionLocal, and migration strategies to Jetpack Compose. 
Instead, we won't dive into the intricacies of the Compose compiler and runtime as they involve a substantial amount of internal workflows.

## Compose UI

As we discussed in the previous section, Compose UI is an integral component of Jetpack Compose, a comprehensive suite of components designed to simplify the creation of Compose layout trees, with a focus on Compose Multiplatform compatibility.

You can create UI layouts in a declarative manner, which means you can write layouts in Kotlin logically, enabling you to maintain your UI layouts without the need for imperative manipulation of frontend views. This approach facilitates the development of highly reusable and intuitive UI layouts.

In this section, you will delve into essential concepts for utilizing Compose UI libraries, including theming, Modifiers, creating layouts, implementing lists, and animations.

### Theming

Jetpack Compose makes it easy to implement a design system, ensuring your app maintains a consistent appearance by offering predefined themes

Compose UI provides two primary theming libraries: the implementation of Material Design 2 and Material Design 3. These theming libraries offer a variety of essential design components, including buttons, cards, switches, bottom sheets, and more, all of which reflect the respective theme styles internally.

You can maintain a consistent appearance for your application by utilizing these UI components within the MaterialTheme Composable, as demonstrated in the sample below:


```kotlin

MaterialTheme(
    colors = // ...
    typography = // ...
    shapes = // ...
) {
    // content details
}
```

If your application's UI specifications diverge from Google's material design guidelines, you have the flexibility to implement your own custom design systems, akin to the MaterialTheme composable.


### Modifier

The Modifier in Jetpack Compose is a crucial component for UI development. It provides developers with the flexibility to alter and enhance the properties of Composable elements, such as adjusting width/height, padding size, background color, adding a click callback, and so on. The complete list of Compose modifier functions is available at [List of Compose Modifiers](https://developer.android.com/jetpack/compose/modifiers-list).

Modifiers are standard Kotlin objects and stateless, so you can simply create a modifier by chaining a builder class like the below:

```kotlin

@Composable
private fun Greeting(name: String) {
    Row(modifier = Modifier.padding(12.dp)) {
        Text(text = "Hello,")
        Text(text = name)
    }
}

```

Most Compose UI components include a modifier parameter, enabling users to customize properties and control their styles. Similarly, when creating your own Composable functions, it's beneficial to expose the modifier parameter. This practice allows for modifying the styling directly at the call site, offering greater flexibility and customization in your UI design.

```kotlin

@Composable
public fun Header(modifier: Modifier = Modifier) {
    Row(modifier = modifier.fillMaxWidth()) {
        ..
    }
}

```

From the example provided, it's evident that you can pass a modifier to the Header Composable function. This approach allows for external control of the component's styles, enabling you to adapt and apply different styles based on varying requirements. This flexibility in styling outside the function enhances the customization and adaptability of your UI components.


### Lists and Grids

It's rare to encounter an application that doesn't utilize lists or grids to effectively display items to users. In traditional XML-based Android development, creating performant and efficient lists often involved considerable challenges, particularly with RecyclerView. This approach required managing complex usages and customizations.

Conversely, Jetpack Compose simplifies the implementation of lists and grids. It offers a more straightforward approach, enabling highly reusable components for each item. Composable functions in Jetpack Compose are inherently independent, offering a high degree of reusability and reducing the complexity typically associated with list and grid implementations.


```kotlin

@Composable
fun MessageList(messages: List<Message>) {
    Column(modifier = Modifier.verticalScroll()) {
        messages.forEach { message ->
            MessageItem(message)
        }
    }
}

@Composable
fun MessageItem(message: Message) {
  .. 
}

```

You can also implement a horizontal list by using the Row Composable function.

While the Column and Row Composables in Jetpack Compose render all items simultaneously, they may not be suitable for displaying a large number of items due to performance concerns. For such scenarios, Compose UI recommends using LazyColumn and LazyRow for lists or LazyVerticalGrid and LazyHorizontalGrid for grids. These components efficiently handle large datasets by only rendering visible items, optimizing performance and resource usage.

**Lazy lists and grids in Jetpack Compose, such as LazyColumn, serve a similar purpose to the traditional RecyclerView, offering enhanced performance compared to standard Column or Row Composables. Here's an example demonstrating the use of LazyColumn**:

```kotlin
@Composable
fun MessageList(messages: List<Message>) {
    LazyColumn {
        items(messages) { message ->
            MessageItem(message)
        }
    }
}

@Composable
fun MessageItem(message: Message) {
  .. 
}
```

You've successfully created a list in Jetpack Compose without the complexity of RecyclerView.Adapter and RecyclerView.ViewHolder, and remarkably, it took less than 15 lines of code! This simplicity and efficiency highlight one of the most appealing aspects of using Jetpack Compose for Android UI development.

### Animation

Animation serves as a highlight of UI design, offering enriched user experiences. Traditionally, in XML-based layouts, creating sophisticated animations posed significant challenges. This complexity stemmed from the need to navigate through intricate Android view systems and handle measurements, coupled with the use of complex animation APIs like ValueAnimator and ObjectAnimator.

Jetpack Compose simplifies this process by offering a dedicated animation library. This library features a variety of user-friendly APIs, making the implementation of dynamic animations much more straightforward compared to the traditional XML-based layouts:

- AnimatedVisibility: This Composable function facilitates the animation of its content's appearance and disappearance. By default, content appears with a fade-in and expansion effect, and disappears with a fade-out and shrink effect. However, these transitions can be tailored to your preferences by specifying custom EnterTransition and ExitTransition parameters.

- Corssfade: Crossfade provides an animation transition between two Composable functions using a crossfade effect. This feature is particularly valuable for creating smooth and visually appealing transitions between different screens.

- AnimatedContent: The AnimatedContent composable dynamically animates its content based on changes in a given target state, adhering to specified animation spec parameters. This functionality is especially useful for creating animations between two distinct Composable functions.

- animate*AsState: The animate*AsState functions represent the most straightforward animation APIs in Jetpack Compose for animating a single value. To use them, you simply specify the target or end value. The API then automatically initiates the animation, transitioning smoothly from the current value to the provided target value. You can use the following animate*AsState functions, which produce different value types: animateDpAsState, animateFloatAsState, animateIntAsState, animateOffsetAsState, animateSizeAsState, and animateValueAsState.

## State

In programming, the term "state" refers to the in-memory representation of information at a specific moment, which dictates the program's behavior. This concept is predominantly associated with user interactions, influencing how the program responds and operates based on various inputs and actions performed by the user.


Let's consider a scenario where you have a button on a screen designed to fetch user information from a network. In this context, the state of the operation can be represented as a progression from Idle to Loading and finally to Completed. This sequence starts with Idle (nothing happened), moves to Loading (data is being fetched from the network upon clicking the button), and culminates in Completed (successful receipt of the payload from the network).

As the state changes, the UI's role is primarily to observe these changes from a state manager (also known as a view model or similar state machine) and adjust its layout accordingly. In essence, the state is deeply intertwined with the UI, with the latter responding dynamically to the former's alterations.

In Jetpack Compose, the Compose Runtime library offers specialized [state APIs](https://developer.android.com/jetpack/compose/state), enabling efficient management of UI states within Compose.

### State and Recomposition

Before delving into the concept of recomposition, it's important to understand the three primary phases in Jetpack Compose

![](../../../resources/state_and_recomposition.avif)

Now, you might be curious about how to update the UI layout that has already been rendered through those three primary phases. To address this, Jetpack Compose introduces a mechanism for redrawing, starting from the first phase (composition, technically, your Composable nodes notifies to the composition about the UI changes), to updating your UI layout in response to state changes. **This process is known as recomposition.**

As mentioned earlier, most mobile applications maintain states, which are in-memory representations of your data model. It's essential for your UI to be updated in response to changes in these states. To facilitate this, Jetpack Compose offers two primary methods to trigger recomposition, ensuring that the UI reflects the latest state changes:

- Input Changes: This is the most fundamental method for triggering recomposition in your Composable functions. The Compose runtime uses the equals function to detect changes in your arguments. If equals returns false, the runtime interprets this as a change in the input data. Consequently, it initiates a recomposition to update your UI representation in line with these data changes.

For example:

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}

@Composable
fun MyApp() {
    var name by remember { mutableStateOf("World") }

    Column {
        Greeting(name = name)
        Button(onClick = { name = "Android" }) {
            Text("Change Name")
        }
    }
}
```
>[!TIP]
>Trong ví dụ này, khi nhấn vào nút "Change Name", giá trị của biến name thay đổi từ "World" sang "Android", dẫn đến sự thay đổi trong đối số đầu vào của hàm Greeting. Compose runtime sẽ phát hiện sự thay đổi này và khởi động quá trình recomposition để cập nhật giao diện người dùng.


- Observing State Changes: Jetpack Compose offers an effective mechanism to trigger recomposition by monitoring state changes using the State API provided by the Compose runtime library. Typically, this is used in conjunction with the remember Composable function. This approach helps in preserving state objects in memory and restoring them during recomposition, thereby ensuring that the UI reflects the current state.

For example:

```kotlin

@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }

    Column {
        Text(text = "Count: $count")
        Button(onClick = { count++ }) {
            Text("Increment")
        }
    }
}

```

>[!TIP]
>Trong ví dụ này, chúng ta sử dụng mutableStateOf để theo dõi trạng thái của biến count. Khi nút "Increment" được nhấn, giá trị của count tăng lên. Compose runtime tự động phát hiện sự thay đổi trong trạng thái này và kích hoạt quá trình recomposition để cập nhật giao diện người dùng.


**While recomposition is a necessary mechanism in Jetpack Compose, it does incur a performance cost as it restarts the Compose phases. If you're looking to optimize the performance of your app developed with Jetpack Compose**, read the article [Guidelines to Optimize Your App Performance](../../) . This resource offers valuable tips and best practices for improving your Compose app performance.


## Stateful vs Stateless

Trong thế giới của Jetpack Compose, các hàm Composable thường được mô tả là có thể có trạng thái (Stateful) hoặc không trạng thái (Stateless), dựa trên cách chúng quản lý trạng thái.

- Trạng thái (Stateful): Như đã thảo luận trước đó, một hàm Composable được coi là 'có trạng thái' khi nó sử dụng hàm `remember`. Phương pháp này cho phép hàm lưu trữ một đối tượng trong bộ nhớ, hiệu quả duy trì trạng thái của nó qua nhiều lần recompositions. Hàm `remember` đảm bảo rằng trạng thái vẫn được duy trì nguyên vẹn ngay cả khi hàm Composable được gọi lại nhiều lần.

- Không có trạng thái (Stateless): Ngược lại, một hàm Composable được gọi là 'Không có trạng thái' khi nó không sử dụng hàm `remember` và thay vào đó nhận trạng thái của nó thông qua các đối số. Trong tình huống này, hàm không giữ bất kỳ trạng thái nội bộ nào; nó hoàn toàn phụ thuộc vào dữ liệu được truyền vào, làm cho nó dễ dàng dự đoán và tái sử dụng hơn trong một số tình huống cụ thể.

Hiểu sự phân biệt giữa các Composable có trạng thái và không trạng thái là rất quan trọng để phát triển giao diện người dùng một cách hiệu quả và hiệu quả trong Jetpack Compose, ảnh hưởng đến cách trạng thái được xử lý và duy trì trong ứng dụng.

Lựa chọn giữa các hàm Composable có trạng thái và không trạng thái phụ thuộc vào yêu cầu cụ thể của bạn, nhưng nói chung, nên hướng về việc tạo ra các Composable không trạng thái. Cơ sở lý do cho lời khuyên này nằm ở tính bảo trì và tái sử dụng:

- Bảo trì: Mặc dù các Composables có trạng thái có vẻ tiện lợi khi sử dụng tại điểm gọi, chúng có thể làm mờ hiểu biết về các trạng thái và hành vi bên trong của chúng. Sự thiếu minh bạch này có thể làm cho việc dự đoán cách hành vi của Composable sẽ làm trong các tình huống khác nhau trở nên khó khăn, dẫn đến khó khăn có thể xảy ra trong việc bảo trì.

- Tái sử dụng: Các Composables không trạng thái, dựa vào quản lý trạng thái bên ngoài, thường được tái sử dụng hơn qua các phần ứng dụng khác nhau. Chúng hoạt động giống như các hàm thuần túy, nơi đầu ra có thể dự đoán dựa trên đầu vào, và chúng không duy trì bất kỳ trạng thái nội bộ nào có thể ảnh hưởng đến hành vi của chúng một cách không mong muốn.

Tóm lại, lựa chọn các Composables không trạng thái có thể dẫn đến một cơ sở mã sạch sẽ, module hóa hơn nơi các thành phần dễ dàng kiểm tra, bảo trì và tái sử dụng trong các ngữ cảnh khác nhau. Chuyển đổi các hàm Composables có trạng thái của bạn thành các hàm không trạng thái có thể được thực hiện một cách hiệu quả thông qua một kỹ thuật được biết đến là 'state hoisting' (nâng cao trạng thái).

### State Hoisting

State hoisting trong Jetpack Compose là một phương pháp được sử dụng để chuyển đổi một hàm Composable có trạng thái thành một hàm Stateless bằng cách chuyển quản lý trạng thái đến điểm gọi. Cơ bản, ý tưởng cốt lõi của state hoisting bao gồm việc thay thế biến trạng thái, thường được quản lý bên trong hàm remember, bằng hai tham số trong hàm Composable.

Quá trình này hiệu quả chuyển trách nhiệm duy trì trạng thái từ hàm Composable đến người gọi của nó, từ đó khiến cho hàm trở nên không trạng thái. Như minh họa trong hình bên dưới, hàm Composable MyTestField hoạt động theo cách không trạng thái. Nó nhận trạng thái của mình trực tiếp từ điểm gọi và sau đó truyền lại sự kiện đến cùng một điểm gọi đó.

![](../../../resources/state_hosting.avif)


Tiếp theo, chúng ta sẽ đối chiếu các hàm Composable có trạng thái và không trạng thái bằng các đoạn mã mẫu, trong khi tham khảo hình ảnh ở trên để hiểu rõ hơn. Xem xét một trường hợp làm việc với một ô văn bản tùy chỉnh được đặt tên là MyTextField để xử lý đầu vào người dùng. Nếu bạn muốn thực hiện MyTextField như một hàm Composable có trạng thái, dưới đây là một ví dụ về cách thực hiện:

```kotlin
@Composable
fun HomeScreen() {
  MyTextField()
}

@Composable
fun MyTextField() {
  val (value, onValueChanged) = remember { mutableStateOf("") }

  TextField(value = value, onValueChange = onValueChanged)
}
```

Trong đoạn mã ví dụ trên, bạn có thể quan sát rằng MyTextField duy trì trạng thái của nó bằng cách sử dụng hàm remember Composable để lưu trữ trạng thái trong bộ nhớ và theo dõi các thay đổi đầu vào. Cài đặt này làm cho MyTextField trở thành một hàm Composable có trạng thái, vì nó quản lý trạng thái bên trong của nó.

Ở đây có điểm mạnh và điểm yếu. Điểm gọi (HomeScreen) không cần quản lý trạng thái cho MyTextField, giúp đơn giản hóa việc triển khai. Tuy nhiên, điều này cũng có nghĩa là việc hiểu và kiểm soát hành vi của MyTextField từ bên ngoài trở nên khó khăn hơn. Kết quả là, việc tái sử dụng MyTextField trong các ngữ cảnh khác nhau có thể khó khăn do trạng thái được quản lý bên trong.

Bây giờ, hãy xem xét một ví dụ khác thực hiện cùng nhiệm vụ, như được thể hiện trong ví dụ dưới đây:

```kotlin
@Composable
fun HomeScreen() {
  val (value, onValueChanged) = remember { mutableStateOf("") } 
  // this line above equal to val valueState = remember { mutableStateOf("") }
  // val value = valueState.value
  // val onValueChanged = valueState.setValue

  MyTextField(
    value = value,
    onValueChanged = onValueChanged
  )
}

@Composable
fun MyTextField(
  value: String,
  onValueChanged: (String) -> Unit
) {
  TextField(value = value, onValueChange = onValueChanged)
}
```

Trong ví dụ này, hàm Composable MyTextField được thiết kế để phản ánh các thay đổi trong giá trị thông qua các đối số của nó, với điểm gọi (HomeScreen) quản lý tất cả các trạng thái cho MyTextField. Mặc dù phương pháp này có thể dẫn đến mã dài hơn so với ví dụ có trạng thái trước đó, nhưng nó mang lại một ưu điểm rõ ràng: khả năng tái sử dụng cải thiện của MyTextField Composable trong các trường hợp sử dụng khác nhau.

Phương pháp này được biết đến là "State Hoisting", tức là việc nâng cao hoặc 'nâng cao' quản lý trạng thái từ người được gọi (trong trường hợp này là MyTextField) đến người gọi (như HomeScreen). Điều này có nghĩa là trạng thái được quản lý ở mức cao hơn trong cấu trúc, cho phép quản lý trạng thái linh hoạt và kiểm soát hơn.

Dựa vào ví dụ không trạng thái ở trên, hãy khám phá một trường hợp sử dụng khác nữa. Hãy tưởng tượng bạn muốn tạo một ô văn bản không cho phép người dùng nhập bất kỳ chữ số nào. Tình huống này minh họa sự linh hoạt và sự thích ứng của phương pháp không trạng thái. Sau đó, bạn có thể thực hiện như ví dụ dưới đây:

```kotlin
@Composable
fun HomeScreen() {
  val (value, onValueChanged) = remember { mutableStateOf("") }
  val processedValue by remember(value) { derivedStateOf { value.filter { !it.isDigit() } } }

  MyTextField(
    value = processedValue,
    onValueChanged = onValueChanged
  )
}

@Composable
fun MyTextField(
  value: String,
  onValueChanged: (String) -> Unit
) {
  TextField(value = value, onValueChange = onValueChanged)
}
```

Hơn nữa, bạn có thể tiếp tục sử dụng hàm Composable MyTextField theo nhiều cách khác nhau, phù hợp với nhu cầu cụ thể của bạn. Sự linh hoạt này nên làm sáng tỏ tại sao state hoisting cải thiện khả năng tái sử dụng của các hàm Composable của bạn, vì nó cho phép kiểm soát và tùy chỉnh bên ngoài hành vi của thành phần trong các ngữ cảnh đa dạng.

## Side-Effects

Bây giờ, hãy thảo luận về khái niệm Side-Effects. Trong thế giới lập trình, Side-Effects thường đề cập đến các tình huống ngoài ý muốn hoặc bất ngờ phát sinh do những thay đổi được thực hiện ở một phần của chương trình ảnh hưởng đến phần khác. Những tác động này thường không rõ ràng ngay lập tức, khiến chúng khó có thể dự đoán và quản lý.

Trong Jetpack Compose, một trong những tình huống phổ biến nhất mà các hiện tượng Side-Effects có thể xảy ra là bên trong một hàm Composable. Khác với các hàm tiêu chuẩn, các hàm Composable có thể được gọi lại để cập nhật giao diện người dùng do các kích hoạt khác nhau, chẳng hạn như việc recomposition. Do đó, thực hiện logic miền trực tiếp bên trong các hàm Composable có thể rủi ro, vì nó có thể dẫn đến hành vi không mong muốn hoặc không nhất quán trong giao diện người dùng do các lần gọi lại này.

Ví dụ, giả sử bạn muốn tạo một kết hợp của  text và text field, và bạn muốn hiển thị một thông báo toast với một thông báo mặc định lần đầu tiên nó xuất hiện. Bạn có thể tạo một cài đặt đơn giản như ví dụ sau:

```kotlin
@Composable
fun HomeScreen(defaultValue: String = "Hello, Compose!") {
  Column {
    val (value, onValueChanged) = remember { mutableStateOf(defaultValue) }

    val context = LocalContext.current
    Toast.makeText(context, defaultValue, Toast.LENGTH_SHORT).show()

    Text(text = value)

    TextField(value = value, onValueChange = onValueChanged)
  }
}
```

Tuy nhiên, khi chạy mã này, bạn có thể nhận thấy một vấn đề. Mỗi khi bạn sửa đổi đầu vào của ô văn bản, thông báo mặc định ("Xin chào, Compose!") lại xuất hiện dưới dạng một thông báo toast. Điều này xảy ra vì các thay đổi trạng thái cho ô văn bản kích hoạt recomposition, từ đó cập nhật giao diện Compose và vô tình gây ra việc hiển thị thông báo toast một cách lặp đi lặp lại.

Hiện tượng này được gọi là "Side-Effects", nó tham chiếu đến việc xuất hiện các hành vi không mong muốn được kích hoạt bên trong chương trình. Tuy nhiên, thường cần thiết cho giao diện người dùng tương tác với logic domain, như lấy dữ liệu mạng, truy vấn cơ sở dữ liệu và thực hiện các hoạt động quan trọng khác. Tương tác này là rất quan trọng trong hầu hết các ứng dụng để đảm bảo giao diện người dùng phản ánh trạng thái và dữ liệu hiện tại được xử lý bởi hệ thống nền.

Để giải quyết thách thức của các hiện tượng Side-Effects, Jetpack Compose giới thiệu một khái niệm được biết đến là "effect handler.". Phương pháp này được thiết kế đặc biệt để quản lý và kiểm soát các [hiện tượng Side-Effects trong Compose framework](https://developer.android.com/jetpack/compose/side-effects), đảm bảo rằng các tương tác và cập nhật giao diện người dùng xảy ra một cách kiểm soát và dự đoán với các API dưới đây:

- SideEffect: SideEffect là một hàm cho phép bạn thực hiện các hàm không phải là Composable sau mỗi lần cập nhật giao diện thành công. Nó được sử dụng để thực hiện các hành động sau khi giao diện được cập nhật, nhưng không đảm bảo rằng các hành động này sẽ xảy ra trước khi giao diện được cập nhật.
- LaunchedEffect: LaunchedEffect là một hàm cho phép bạn thực hiện các suspend function một cách an toàn từ bên trong một hàm Composable. Nó bắt đầu từ giai đoạn sơ khởi hóa ban đầu và nếu nó bị loại bỏ khỏi compostion, phạm vi coroutine của nó sẽ tự động bị hủy bỏ. Bằng cách cung cấp một khóa duy nhất, bạn có thể kiểm soát thực hiện các hành động dựa trên các điều kiện khác nhau.
- DisposableEffect: DisposableEffect là một hàm cho phép bạn thực hiện các hàm không phải là Composable và có khả năng hủy bỏ hoặc loại bỏ các nhiệm vụ đang diễn ra khi chúng rời khỏi compostion. Điều này giúp ngăn chặn các vấn đề như rò rỉ tài nguyên hoặc xử lý dư thừa trong ứng dụng của bạn.

## CompositionLocal

Jetpack Compose được thiết kế theo phương pháp khai báo, cho phép tạo ra các layout giao diện người dùng rất có thể tái sử dụng và trực quan. Tuy nhiên, một thách thức phát sinh khi thông tin được cung cấp ở gốc của layout cần được sử dụng ở cuối cùng của node. Không có vấn đề gì với các cấu trúc giao diện người dùng đơn giản, nhưng hãy xem xét một tình huống như hình dưới đây khi bạn cần xây dựng một layout phức tạp với hơn mười cấp độ các lời gọi hàm Composable khác nhau.


![](../../../resources/composition_local.avif)

Trong tình huống như vậy, bạn cần chuyển thông tin cần thiết từ gốc đến cuối, và tất cả các hàm Composable nằm ở giữa cũng phải truyền thông tin này, ngay cả khi chúng không thực sự sử dụng nó. Phương pháp này làm phức tạp toàn bộ tập hợp các hàm Composable, khiến chúng trở nên rộng lớn hơn và chịu tải với thông tin không liên quan. Do đó, nó có thể giảm khả năng bảo dưỡng của mã của bạn.

Để giải quyết vấn đề này, Jetpack Compose giới thiệu cơ chế CompositionLocal. Nó cho phép truyền dữ liệu một cách ngầm xuống cây Compose, cho phép truy cập thông tin cần thiết bất cứ lúc nào và ở bất kỳ cấp độ nào của node khi cần như hình dưới đây:

![](../../../resources/composition_local_provider.avif)

Trong nhiều tình huống, CompositionLocal được sử dụng để truyền thông tin tương đối "tĩnh" mà không thay đổi nhiều khi được tạo. Một ví dụ quen thuộc có thể là đối tượng MaterialTheme, giúp đảm bảo tính nhất quán trên các thành phần giao diện người dùng Compose của bạn. Hãy xem cách triển khai của nó.

```kotlin
@Composable
fun MaterialTheme(
    ..
) {
    ..
    CompositionLocalProvider(
        LocalColors provides rememberedColors,
        LocalContentAlpha provides ContentAlpha.high,
        LocalIndication provides rippleIndication,
        LocalRippleTheme provides MaterialRippleTheme,
        LocalShapes provides shapes,
        LocalTextSelectionColors provides selectionColors,
        LocalTypography provides typography
    ) {
        ..
    }
}
```

Trong cài đặt nội bộ của MaterialTheme, nó định nghĩa tất cả các khía cạnh của chủ đề, bao gồm màu sắc, alpha, chỉ dẫn, hình dạng và kiểu chữ. Do đó, tất cả các thành phần giao diện người dùng Material Jetpack Compose được sử dụng trong hàm Composable MaterialTheme sẽ áp dụng một cách nhất quán các thuộc tính của chủ đề. Sự nhất quán này được duy trì bất kể mô hình sử dụng của các nhà phát triển, vì họ có thể truy cập thông tin chủ đề thông qua CompositionLocal.

Mặt khác, việc sử dụng quá mức CompositionLocal có thể dẫn đến khó khăn trong việc gỡ lỗi và duy trì mã của bạn. Do đó, việc sử dụng nó một cách thông minh và tránh phụ thuộc quá mức vào nó trong mã nguồn của bạn là rất quan trọng.