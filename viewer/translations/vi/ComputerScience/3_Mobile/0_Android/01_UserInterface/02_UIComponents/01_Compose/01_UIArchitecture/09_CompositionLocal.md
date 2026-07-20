#Composition Local


Jetpack Compose được thiết kế bằng cách sử dụng phương pháp khai báo, cho phép tạo bố cục UI trực quan và có thể tái sử dụng cao. Tuy nhiên, một thách thức nảy sinh khi thông tin được cung cấp ở phần gốc của bố cục lại cần thiết ở cuối nút. Không có vấn đề gì với các cấu trúc UI đơn giản, nhưng hãy xem xét một tình huống như hình bên dưới, trong đó bạn cần xây dựng một bố cục rất phức tạp bao gồm hơn mười cấp độ của các lệnh gọi Composable function khác nhau.

![](/resources/composition_local.avif)

Trong trường hợp như vậy, bạn sẽ cần chuyển tiếp thông tin cần thiết từ gốc đến cuối và tất cả các chức năng Composable nằm ở giữa cũng phải truyền thông tin này, ngay cả khi chúng không thực sự sử dụng thông tin đó. Cách tiếp cận này làm phức tạp toàn bộ tập hợp hàm Composable, khiến chúng trở nên phức tạp hơn và chứa nhiều thông tin không liên quan. Do đó, nó có khả năng làm giảm khả năng bảo trì mã của bạn.

Để giải quyết vấn đề này, **Compose cung cấp CompositionLocal cho phép bạn tạo các đối tượng được đặt tên trong phạm vi cây có thể được sử dụng như một cách ngầm để đưa luồng dữ liệu qua cây UI, cho phép truy cập vào thông tin cần thiết bất kỳ lúc nào và ở bất kỳ cấp độ nào của nút bất cứ khi nào cần như hình bên dưới:**

![](/resources/composition_local_provider.avif)


Trong nhiều trường hợp, **CompositionLocal** được sử dụng để truyền thông tin tương đối "tĩnh" và không thay đổi nhiều sau khi được tạo. Một ví dụ quen thuộc có thể là đối tượng MaterialTheme, đối tượng này hỗ trợ đảm bảo tính nhất quán giữa các thành phần Compose UI của bạn.

Ví dụ:

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


Trong quá trình triển khai nội bộ của MaterialTheme, nó xác định tất cả các khía cạnh của chủ đề, bao gồm màu sắc, alpha, chỉ báo, hình dạng và kiểu chữ. Do đó, tất cả các thành phần Jetpack Compose Material UI được sử dụng trong MaterialTheme Composable sẽ áp dụng nhất quán các thuộc tính của chủ đề. Tính đồng nhất này được duy trì bất kể cách sử dụng của nhà phát triển vì họ có thể truy cập thông tin chủ đề qua **CompositionLocal**.

Mặt khác, việc sử dụng quá mức **CompositionLocal** có thể dẫn đến khó khăn trong việc gỡ lỗi và duy trì mã của bạn. Do đó, việc sử dụng nó một cách thận trọng và tránh phụ thuộc quá nhiều vào nó trong cơ sở mã của bạn là rất quan trọng. Nếu bạn muốn tìm hiểu thêm về **CompositionLocal**, hãy xem Dữ liệu phạm vi cục bộ với **CompositionLocal**.


Để cung cấp giá trị mới cho CompositionLocal, hãy sử dụng CompositionLocalProvider và infix function liên kết khóa CompositionLocal với một giá trị. Lambda nội dung của CompositionLocalProvider sẽ nhận giá trị được cung cấp khi truy cập thuộc tính hiện tại của CompositionLocal. Khi một giá trị mới được cung cấp, Compose sẽ tổng hợp lại các phần của Composition đọc CompositionLocal.


## Tạo CompositionLocal

Có hai API để tạo CompositionLocal:

- `compositionLocalOf`: Việc thay đổi giá trị được cung cấp trong recomposition chỉ làm mất hiệu lực nội dung đọc giá trị hiện tại của nó.

- `staticCompositionLocalOf`: Không giống như compositionLocalOf, các lần đọc staticCompositionLocalOf không được Compose theo dõi. Việc thay đổi giá trị sẽ khiến toàn bộ nội dung lambda trong đó CompositionLocal được cung cấp được kết hợp lại, thay vì chỉ những vị trí đọc giá trị hiện tại trong Composition.

Nếu giá trị được cung cấp cho CompositionLocal rất khó thay đổi hoặc sẽ không bao giờ thay đổi, hãy sử dụng staticCompositionLocalOf để nhận được lợi ích về hiệu suất.

<details>
  <summary style="color: orange;">
  <b>
  Ví dụ
  </b>
  </summary>
  
  <p>

 Hệ thống thiết kế của ứng dụng có thể được đưa ra quan điểm về cách nâng cao các thành phần kết hợp bằng cách sử dụng bóng cho thành phần UI. Vì các độ cao khác nhau của ứng dụng sẽ lan truyền khắp cây UI nên chúng tôi sử dụng CompositionLocal. Vì giá trị CompositionLocal được lấy có điều kiện dựa trên chủ đề hệ thống nên chúng tôi sử dụng compositionLocalOf API:

 ```kotlin
 // LocalElevations.kt file

data class Elevations(val card: Dp = 0.dp, val default: Dp = 0.dp)

// Define a CompositionLocal global object with a default
// This instance can be accessed by all composables in the app
val LocalElevations = compositionLocalOf { Elevations() }
```


  </p>
</details>

## Cung cấp giá trị cho CompositionLocal

Thành phần kết hợp CompositionLocalProvider liên kết các giá trị với các phiên bản CompositionLocal cho hệ thống phân cấp nhất định. Để cung cấp giá trị mới cho CompositionLocal, hãy sử dụng infix function được cung cấp để liên kết khóa CompositionLocal với một giá trị như sau:

```kotlin
// MyActivity.kt file

class MyActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            // Calculate elevations based on the system theme
            val elevations = if (isSystemInDarkTheme()) {
                Elevations(card = 1.dp, default = 1.dp)
            } else {
                Elevations(card = 0.dp, default = 0.dp)
            }

            // Bind elevation as the value for LocalElevations
            CompositionLocalProvider(LocalElevations provides elevations) {
                // ... Content goes here ...
                // This part of Composition will see the `elevations` instance
                // when accessing LocalElevations.current
            }
        }
    }
}
```

## Tiêu thụ CompositionLocal

CompositionLocal.current trả về giá trị được cung cấp bởi CompositionLocalProvider gần nhất cung cấp giá trị cho CompositionLocal đó:

```kotlin
@Composable
fun SomeComposable() {
    // Access the globally defined LocalElevations variable to get the
    // current Elevations in this part of the Composition
    Card(elevation = LocalElevations.current.card) {
        // Content
    }
}
```

## Các lựa chọn thay thế cần xem xét

CompositionLocal có thể là giải pháp quá mức cho một số trường hợp sử dụng. Nếu trường hợp sử dụng của bạn không đáp ứng các tiêu chí được chỉ định trong phần Quyết định có nên sử dụng CompositionLocal hay không, một giải pháp khác có thể phù hợp hơn cho trường hợp sử dụng của bạn.

### Truyền tham số rõ ràng

Nói rõ ràng về các phần phụ thuộc của thành phần kết hợp là một thói quen tốt. Chúng tôi khuyên bạn **chỉ nên chuyển các thành phần kết hợp những gì chúng cần**. Để khuyến khích việc tách rời và tái sử dụng các thành phần kết hợp, mỗi thành phần kết hợp phải chứa ít thông tin nhất có thể.


```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    MyDescendant(myViewModel.data)
}

// Don't pass the whole object! Just what the descendant needs.
// Also, don't  pass the ViewModel as an implicit dependency using
// a CompositionLocal.
@Composable
fun MyDescendant(myViewModel: MyViewModel) { /* ... */ }

// Pass only what the descendant needs
@Composable
fun MyDescendant(data: DataToDisplay) {
    // Display data
}
```

### Đảo ngược quyền kiểm soát

Một cách khác để tránh chuyển các phần phụ thuộc không cần thiết vào một thành phần kết hợp là đảo ngược quyền kiểm soát. Thay vì phần tử con nhận một phần phụ thuộc để thực thi một số logic, phần tử cha sẽ thực hiện điều đó.

<details>
  <summary style="color: orange;">
  <b>
  Ví dụ
  </b>
  </summary>
  
  <p>

Xem ví dụ sau trong đó phần tử con cần kích hoạt yêu cầu tải một số dữ liệu

```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    MyDescendant(myViewModel)
}

@Composable
fun MyDescendant(myViewModel: MyViewModel) {
    Button(onClick = { myViewModel.loadData() }) {
        Text("Load data")
    }
}
```

Tùy theo trường hợp, MyDescendant có thể phải chịu nhiều trách nhiệm. Ngoài ra, việc chuyển MyViewModel làm phần phụ thuộc sẽ khiến MyDescendant ít có khả năng tái sử dụng hơn vì giờ đây chúng đã được ghép nối với nhau. Hãy xem xét giải pháp thay thế không chuyển sự phụ thuộc vào phần tử con và sử dụng sự đảo ngược các nguyên tắc điều khiển khiến tổ tiên chịu trách nhiệm thực thi logic:

```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    ReusableLoadDataButton(
        onLoadClick = {
            myViewModel.loadData()
        }
    )
}

@Composable
fun ReusableLoadDataButton(onLoadClick: () -> Unit) {
    Button(onClick = onLoadClick) {
        Text("Load data")
    }
}
```

Tương tự, @Composable **lambda nội dung có thể được sử dụng theo cách tương tự để nhận được những lợi ích tương tự**:


```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    ReusablePartOfTheScreen(
        content = {
            Button(
                onClick = {
                    myViewModel.loadData()
                }
            ) {
                Text("Confirm")
            }
        }
    )
}

@Composable
fun ReusablePartOfTheScreen(content: @Composable () -> Unit) {
    Column {
        // ...
        content()
    }
}
```


  </p>
</details>