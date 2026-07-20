# Sự kiện trong Compose

Sự kiện là bất kỳ thông tin đầu vào nào được gõ trên màn hình, mọi thay đổi văn bản và về cơ bản mọi tương tác của người dùng hoặc thông báo hệ thống thực hiện bất kỳ thay đổi nào đối với ứng dụng

Chúng ta có thể phân tách các sự kiện bằng cách
- **Sự kiện của người dùng** được tạo bởi các hành động như chạm vào màn hình hoặc nhấn nút.
- **Sự kiện hệ thống** là những thay đổi về phản hồi của mạng, mức pin, hướng màn hình hoặc thay đổi cấu hình.

## Sự kiện của người dùng

**1. Sự kiện nhấp chuột** được sử dụng trên các phần tử Compose,
- Bạn có thể sử dụng tham số onClick đã được xác định trước cho nút để chỉ định điều gì sẽ xảy ra khi người dùng nhấp vào phần tử Compose.
```kotlin
 Button(onClick = { /* Handle click event here */ }) {
        Text("Click me")
    }
```
- Và một cách khác với văn bản có thể nhấp được bằng `Modifier.clickable`.

```kotlin
 Text("Text title", Modifier.clickable {/* Handle click event here */})
```

- Cũng có thể `useModifier.combinedClickable` cho các lần nhấp đúp hoặc dài

```kotlin
 Text("Text title: $title", Modifier.combinedClickable(
        onClick = {/* Handle click event here */},
        onDoubleClick = {/* Handle click event here */},
        onLongClick = {/* Handle click event here */}
    ))
```

**2. Sự kiện cử chỉ** đề cập đến các tương tác mà người dùng thực hiện trên màn hình. 
Những tương tác này bao gồm nhiều hành động và chuyển động vật lý khác nhau, như chạm, vuốt, chụm và xoay, đồng thời chúng được dùng để điều khiển và tương tác với user interface.

Jetpack Compose cung cấp nhiều công cụ sửa đổi để xử lý liền mạch các tương tác cử chỉ đa dạng:

- Đối với thao tác nhấn và nhấn, hãy sử dụng các công cụ sửa đổi **có thể nhấp**, **combinedClickable**, **có thể chọn**, **có thể chuyển đổi** và **triStateToggleable**.

- Để cuộn, hãy sử dụng **horizontalScroll** hoặc **verticalScroll**.

- Để kéo, hãy sử dụng công cụ sửa đổi **có thể kéo** hoặc **có thể vuốt**.

- Đối với các cử chỉ cảm ứng đa điểm như xoay, xoay và thu phóng, hãy sử dụng công cụ sửa đổi **có thể biến đổi**.

> [!NOTE]
> Không giống như onTouchEvent(sự kiện MotionEvent) truyền thống trong Chế độ xem, Compose xử lý các sự kiện chạm bằng cách sử dụng PointerInputScope, tương tác nội bộ với MotionEvent của hệ thống.

Ví dụ `detectTapGesture()` không gọi trực tiếp `onTouchEvent()`, nó vẫn dựa vào cùng một thao tác chạm framework dưới mui xe. 

Khi người dùng đặt một hoặc nhiều ngón tay lên màn hình, điều này sẽ kích hoạt callback `onTouchEvent()`
trên chế độ xem nhận các sự kiện chạm, chẳng hạn như vị trí, áp lực, kích thước và việc thêm một ngón tay khác.

Tương tác cử chỉ bắt đầu bằng lần chạm đầu tiên của người dùng trên màn hình và tiếp tục khi hệ thống theo dõi vị trí của ngón tay hoặc các ngón tay. Nó kết thúc khi ngón tay cuối cùng được nhấc lên khỏi màn hình, đánh dấu sự kiện cuối cùng. Trong suốt quá trình tương tác này, `MotionEvent` được chuyển đến phương thức `onTouchEvent()` cung cấp thông tin chi tiết về từng sự kiện chạm. Ứng dụng có thể sử dụng dữ liệu từ `MotionEvent` để xác định xem một cử chỉ cụ thể đã được thực hiện hay chưa.

> [!CAUTION]
> Một hạn chế của Công cụ sửa đổi cử chỉ Compose là hiện không có cách nào để phát hiện các cử chỉ cụ thể mà không nuốt chúng. Điều này cần thiết cho các trường hợp sử dụng như ghi nhật ký sự kiện.
> Điều này là do tất cả các Công cụ sửa đổi đều gọi consumeDownChange(), đánh dấu sự kiện là đã tiêu thụ.
>Một cách giải quyết cho vấn đề này là tạo các hàm mở rộng PointerInputScope mới dựa trên các hàm mở rộng hiện có, dựa trên [bài đăng StackOverflow này](https://stackoverflow.com/questions/68877700/how-can-i-detect-a-click-with-the-view-behind-a-jetpack-compose-button).

**3. Có thể kéo được**: Nếu muốn một thành phần kết hợp có thể kéo được, bạn có thể sử dụng công cụ sửa đổi `draggable` cùng với `onDrag` callback.

```kotlin
 var offset by remember { mutableStateOf(0f) }

        Box(
            modifier = Modifier
                .offset { IntOffset(offset.roundToInt(), 0) }
                .draggable(
                    orientation = Orientation.Horizontal,
                    state = rememberDraggableState { delta ->
                        offset += delta
                    }
                ),
        )
```

**4. Có thể cuộn**: Để tạo vùng có thể cuộn, bạn có thể sử dụng công cụ sửa đổi verticalScroll hoặc `horizontalScroll` và cung cấp nội dung bên trong.


```kotlin
Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
            // Scrollable content
        }
```

5. **Có thể vuốt**: Để xử lý các cử chỉ vuốt, `Swipeable` không được dùng nữa nên bạn có thể sử dụng `AnchoredDraggable`.

```kotlin
 fun ExampleScreen(viewModel: ExampleViewModel) {
        val draggedDownAnchorTop = with(LocalDensity.current) { 200.dp.toPx() }
        val anchors = DraggableAnchors {
            AnchoredDraggableCardState.DRAGGED_DOWN at draggedDownAnchorTop
            AnchoredDraggableCardState.DRAGGED_UP at 0f
        }
 }
```

6. **Sự kiện nhập văn bản**: Ví dụ: để ghi lại dữ liệu đầu vào của người dùng, hãy sử dụng thành phần kết hợp `TextField` và lắng nghe các thay đổi bằng cách sử dụng `onValueChange` callback.

```kotlin
 var text by remember { mutableStateOf("") }

TextField(
    value = text,
    onValueChange = { value ->
        text = value
        // Handle text change event
    }
)
```

7. **Xử lý tiêu điểm**: Để xử lý các thay đổi tiêu điểm (ví dụ: khi trường văn bản tăng hoặc mất tiêu điểm), hãy sử dụng `onFocusChange` callback.


```kotlin
 var inputValue by remember { mutableStateOf("") } // Initialize inputValue with remember
        var isFocused by remember { mutableStateOf(false)}

            TextField(
            value = inputValue,
            onValueChange = { newValue ->
                inputValue = newValue
                // Handle text change event here if needed
            },
            modifier = Modifier.onFocusChanged { focusState ->
                isFocused = focusState.isFocused
                // Handle focus change event here if needed
            })
```
## Sự kiện hệ thống

Xử lý các sự kiện hệ thống là rất quan trọng để tạo ra một ứng dụng đáp ứng.
Những sự kiện này có thể bao gồm các thay đổi về kết nối, mức pin, thay đổi cấu hình (như hướng thiết bị) hoặc các sự kiện lifecycle của ứng dụng.

- **Sự kiện Lifecycle**: Sử dụng trình quan sát `Lifecycle` để phản ứng với những thay đổi trong trạng thái lifecycle của ứng dụng. Điều này rất cần thiết để bắt đầu hoặc dừng hoạt động dựa trên khả năng hiển thị của ứng dụng hoặc trạng thái lifecycle để bảo tồn tài nguyên và ngăn chặn rò rỉ.

- **Thay đổi cấu hình**: Việc xử lý các thay đổi cấu hình, chẳng hạn như thay đổi hướng, yêu cầu quản lý cẩn thận để duy trì trạng thái và tiến trình của người dùng. Sử dụng rememberSaveable hoặc ViewModel của Jetpack Compose để duy trì trạng thái qua các thay đổi cấu hình.

- **Thay đổi về kết nối**: Việc theo dõi các thay đổi về kết nối mạng cho phép ứng dụng của bạn phản hồi với khả năng truy cập mạng. Sử dụng `ConnectivityManager` với `NetworkCallback` để quan sát các thay đổi về trạng thái mạng và điều chỉnh hành vi ứng dụng của bạn cho phù hợp, chẳng hạn như tạm dừng tải xuống hoặc thông báo cho người dùng.










## Thẩm quyền giải quyết

- https://hyperskill.org/learn/step/43966
- https://proandroiddev.com/android-touch-system-part-5-how-gestures-work-in-jetpack-compose-ef7e74703b6a


