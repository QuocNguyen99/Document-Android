# Cái nút 

Jetpack Compose cung cấp cho chúng ta năm loại nút chính, mỗi loại phù hợp cho một nhiệm vụ hơi khác nhau:

- **Nút đầy**: `Button` Đây là loại nút mặc định! Nó có nghĩa là có một tác động trực quan táo bạo. Sử dụng nó cho các hành động chính - những việc như "Gửi", "Tải xuống" hoặc "Thêm vào giỏ hàng".

- **Nút âm đầy**: `FilledTonalButton` Nút này có hình dáng tương tự như nút đầy nhưng có biến thể màu sắc tinh tế hơn. Đó là nút nhấn mạnh ở mức trung bình; có thể được sử dụng khi nút có mức độ ưu tiên thấp hơn cần được nhấn mạnh hơn một chút.

- **Nút nâng cao**: `ElevatedButton` Loại nút này nổi bật với bóng đổ tinh tế, tuyệt vời khi bạn cần tách một nút trên màn hình bận rộn một cách trực quan. Chia sẻ các vai trò tương tự bằng một nút đã được lấp đầy.

- **Nút viền ngoài**: `OutlinedButton` Nút viền ngoài, giống như tên cho thấy, có đường viền (viền) xung quanh với màu tô trong suốt. Nó rất hữu ích cho các hành động phụ. Những nội dung như "Hủy", "Quay lại" hoặc "Chỉnh sửa". Các nút có đường viền ẩn xuống một cách trực quan trong giao diện, tạo ra hệ thống phân cấp rõ ràng khi được sử dụng cùng với các nút có tông màu hoặc nâng cao.

- **Nút văn bản**: `TextButton` Đây là một nút tối giản, chỉ có văn bản không có nền hoặc đường viền, lý tưởng cho các hành động hoặc địa điểm ít quan trọng hơn mà bạn muốn có cảm giác ít giống nút hơn, như liên kết điều hướng.

Thành phần kết hợp yêu cầu hai đối số:

- `onClick: () -> Unit`: Hàm lambda này xác định hành động sẽ thực thi khi nhấp vào nút.

- `content: @Composable RowScope.() -> Unit`: Đây là slot chứa nội dung của nút. Thông thường, phần này sẽ chứa thành phần kết hợp `Text` cùng với văn bản của nút.
Như loại của lambda chỉ ra, các thành phần kết hợp được đặt ở đây sẽ được sắp xếp thành một hàng.

> [!NOTE]
> Đây là một thông tin thú vị: Về cơ bản, tất cả các loại nút khác được liệt kê ở trên đều gọi Nút mặc định, cung cấp các đối số khác nhau để đạt được giao diện độc đáo của chúng.


> [!NOTE]
> Bạn có nhận thấy rằng nút đơn giản của chúng tôi ở phần trước có văn bản màu trắng mặc dù chúng tôi không đặt nút đó không?.
> Ngoài ra, tại sao nút lại có nền màu tím? Điều này gián tiếp nhờ vào đối số mặc định `ButtonDefaults.buttonColors()` được truyền cho tham số màu sắc.
> Phương pháp `buttonColors()` đặt màu vùng chứa của nút thành màu chính của chủ đề và màu của nội dung thành màu onPrimary của chủ đề.
> Trong dự án Android Studio mới, đây lần lượt là màu tím và trắng.

## Nút biểu tượng

Có hai loại nút biểu tượng chính: nút biểu tượng **tiêu chuẩn** và nút biểu tượng **chứa**. 

Đầu tiên là các nút Biểu tượng cung cấp một cách nhỏ gọn và rõ ràng để thể hiện các hành động trong ứng dụng.
Chúng lý tưởng cho các hành động phụ hoặc những nơi có không gian hạn chế, như thanh công cụ.

Giống như các nút trước đó, `IconButton` yêu cầu một lambda `onClick` và một lambda nội dung thường có nghĩa là lấy một thành phần kết hợp `Icon`:

```kotlin
IconButton(onClick = { /*TODO*/ }) {
    Icon(Icons.Default.Settings, contentDescription = "Settings")
}
```

![văn bản thay thế](/resources/compose_icon_button.png)

Loại thứ hai là: 

`FilledIconButton` có nền hoặc đường viền; điển hình là các biến thể đầy đủ, đầy âm sắc và phác thảo. Lưu ý rằng các nút biểu tượng có hình tròn theo mặc định.

![văn bản thay thế](/resources/compose_filled_icon_button.png)

Để tạo biến thể **âm đầy** và **có viền**, chúng tôi lần lượt sử dụng các thành phần kết hợp `FilledTonalIconButton` và OutlinedIconButt`on

## Nút hành động nổi (FAB)

Nút hành động nổi (FAB) là các nút đặc biệt được thiết kế để thu hút sự chú ý đến (các) hành động quan trọng nhất trên màn hình.

Jetpack Compose cung cấp hai loại FAB chính

### 1. FAB tiêu chuẩn

Sử dụng thành phần kết hợp `FloatingActionButton` để tạo FAB tiêu chuẩn:

Có hai biến thể của FAB tiêu chuẩn có kích thước khác nhau.
`SmallFloatingActionButton` và `LargeFloatingActionButton` có cùng tham số với FAB tiêu chuẩn.

```kotlin
@Composable
fun FloatingActionButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    shape: Shape = FloatingActionButtonDefaults.shape,
    containerColor: Color = FloatingActionButtonDefaults.containerColor,
    contentColor: Color = contentColorFor(containerColor),
    elevation: FloatingActionButtonElevation = FloatingActionButtonDefaults.elevation(),
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
    content: @Composable () -> Unit,
)
```


### 2. FAB mở rộng

FAB mở rộng, như tên cho thấy, là FAB có thêm không gian cho văn bản.

```kotlin
@Composable
fun ExtendedFloatingActionButton(
    text: @Composable () -> Unit,
    icon: @Composable () -> Unit,
    onClick: () -> Unit,
    expanded: Boolean = true,
    // ...other customization options...
)

// or

@Composable
fun ExtendedFloatingActionButton(
    onClick: () -> Unit,
    // ...other customization options...
    content: @Composable RowScope.() -> Unit,
)
```


















