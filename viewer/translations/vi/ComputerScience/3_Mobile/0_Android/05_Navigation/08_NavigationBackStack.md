# Navigation Back Stack

**NavController chứa "back stack" chứa các điểm đến mà người dùng đã truy cập.**
Khi người dùng điều hướng đến các màn hình trong suốt ứng dụng của bạn, `NavController` sẽ thêm và xóa các đích đến và từ back stack.

## Hành vi cơ bản

Đây là những thông tin cốt lõi bạn nên xem xét về hoạt động của back stack:

- Điểm đến đầu tiên: Khi người dùng mở ứng dụng, `NavController` sẽ đẩy điểm đến đầu tiên lên trên cùng của back stack.
- Đẩy lên ngăn xếp: Mỗi cuộc gọi `NavController.navigate()` sẽ đẩy đích đã cho lên đầu ngăn xếp.
- Popping đích trên cùng: Tapping Up hoặc Back gọi lần lượt các phương thức `NavController.navigateUp()` và `NavController.popBackStack()`. 


### Quay lại một điểm đến cụ thể

Bạn cũng có thể sử dụng `popBackStack()` để điều hướng đến một đích cụ thể. Để làm như vậy, hãy sử dụng một trong các tình trạng quá tải của nó.
Những tình trạng quá tải này đưa người dùng đến đích được liên kết với mã định danh đã cho. **Điều quan trọng là họ đưa mọi thứ vào ngăn xếp phía trên đích đó.**

Những tình trạng quá tải này cũng cần một boolean `inclusive`. 
- `inclusive = true` đích được chỉ định trong lệnh gọi popUpTo, cùng với tất cả các đích được thêm sau nó, sẽ bị xóa khỏi back stack.
- `inclusive = false`: Chỉ các đích đến sau đích được chỉ định mới bị xóa, để lại chính đích đã chỉ định trên ngăn xếp.

Ví dụ: 
Hãy tưởng tượng đăng ký nhiều bước process: `Step1 -> Step2 -> Step3 -> Summary`. 
Sau khi người dùng hoàn tất đăng ký và đến màn hình Tóm tắt, chúng tôi muốn xóa tất cả các bước trước đó khỏi back stack. 
Điều này đảm bảo người dùng không thể quay lại để sửa đổi bất kỳ bước nào sau khi gửi.

```kotlin
navController.navigate("summary") {
    popUpTo("step1") { inclusive = true }
}
```

### Xử lý pop back không thành công

Khi `popBackStack()` trả về `false`, cuộc gọi tiếp theo tới `NavController.getCurrentDestination()` trả về `null`. 
Điều này có nghĩa là ứng dụng đã xuất hiện điểm đến cuối cùng ngoài back stack. Trong trường hợp này, người dùng chỉ nhìn thấy một màn hình trống.

Điều này có thể xảy ra trong các trường hợp sau:

- `popBackStack()` không lấy ra bất cứ thứ gì từ ngăn xếp.
- `popBackStack()` đã bật đích ra khỏi back stack và ngăn xếp hiện trống.

Để giải quyết vấn đề này, bạn phải điều hướng đến một điểm đến mới hoặc gọi `finish()` trên hoạt động của mình để kết thúc hoạt động đó. Đoạn mã sau đây chứng minh điều này:

```kotlin
if (!navController.popBackStack()) {
    // Call finish() on your Activity
    finish()
}
```

### Bật lên một điểm đến

Để xóa đích khỏi back stack khi điều hướng từ đích này sang đích khác, hãy thêm đối số `popUpTo()` vào lệnh gọi hàm `navigate()` được liên kết. 
Bạn có thể bao gồm một đối số cho tham số `inclusive` với giá trị `true` để cho biết rằng đích đến mà bạn đã chỉ định trong `popUpTo()` cũng sẽ bật ra back stack.

Để triển khai điều này theo chương trình, hãy chuyển `popUpTo()` đến `navigate()` như một phần của `NavOptions` với `inclusive` được đặt thành `true`. Tính năng này hoạt động ở cả Compose và Chế độ xem.

### Lưu trạng thái khi bật lên

Khi bạn sử dụng `popUpTo` để điều hướng đến một đích, bạn có thể tùy ý lưu back stack và trạng thái của tất cả các đích được hiển thị ngoài back stack.

Để thực hiện việc này theo chương trình, hãy chỉ định `saveState = true` khi thêm `popUpTo` vào tùy chọn điều hướng của bạn.

Bạn cũng có thể chỉ định `restoreState = true` trong tùy chọn điều hướng của mình để tự động khôi phục back stack và trạng thái được liên kết với đích đến.

## Tham chiếu đích bằng NavBackStackEntry

Bắt đầu với Navigation 2.2.0, bạn có thể tham chiếu đến `NavBackStackEntry` cho bất kỳ đích đến nào trên ngăn điều hướng bằng cách gọi `NavController.getBackStackEntry()`, chuyển nó đến đích ID. Nếu back stack chứa nhiều phiên bản của đích được chỉ định, `getBackStackEntry()` sẽ trả về phiên bản cao nhất từ ​​​​ngăn xếp.

`NavBackStackEntry` được trả về cung cấp `Lifecycle`, `ViewModelStore` và `SavedStateRegistry` ở cấp đích. Các đối tượng này có giá trị trong suốt thời gian tồn tại của đích trên back stack.

Bạn có thể quan sát `Lifecycle` của `NavBackStackEntry` giống như bạn quan sát `Lifecycle` của một đoạn hoặc hoạt động. Ngoài ra, `NavBackStackEntry` là `LifecycleOwner`, có nghĩa là bạn có thể sử dụng nó khi quan sát `LiveData` hoặc với các thành phần nhận biết lifecycle khác, như trong ví dụ sau:

```kotlin
myViewModel.liveData.observe(backStackEntry, Observer { myData ->
    // react to live data update
})
```

## Trả kết quả về Đích trước đó

Trong `Navigation` 2.3 trở lên, `NavBackStackEntry` cấp quyền truy cập vào `SavedStateHandle`. `SavedStateHandle` là bản đồ khóa-giá trị có thể được sử dụng để lưu trữ và truy xuất dữ liệu. Các giá trị này vẫn tồn tại cho đến khi process ngừng hoạt động, bao gồm cả các thay đổi về cấu hình và vẫn có sẵn thông qua cùng một đối tượng. **Điều này đặc biệt hữu ích như một cơ chế lấy lại dữ liệu từ đích sau khi dữ liệu được lấy ra khỏi ngăn xếp.**

Bán tại:


Để truyền dữ liệu trở lại Đích A từ Đích B, trước tiên hãy thiết lập Đích A để nghe kết quả trên `SavedStateHandle` của nó. Để làm như vậy, hãy truy xuất `NavBackStackEntry` bằng cách sử dụng `getCurrentBackStackEntry()` API rồi quan sát LiveData do `SavedStateHandle` cung cấp.

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    val navController = findNavController();
    // We use a String here, but any type that can be put in a Bundle is supported
    navController.currentBackStackEntry?.savedStateHandle?.getLiveData<String>("key")?.observe(
        viewLifecycleOwner) { result ->
        // Do something with the result.
    }
}
```

Ở Đích B, bạn phải `set` kết quả trên `SavedStateHandle` của Đích A bằng cách sử dụng `getPreviousBackStackEntry()` API.

```kotlin
navController.previousBackStackEntry?.savedStateHandle?.set("key", result)
```

>[!NOTE]
> Vì NavBackStackEntry sử dụng SavedStateHandle nên tất cả kết quả phải thuộc loại mà bạn có thể đặt trong Bundle. Để lưu kết quả của các loại tùy chỉnh không phải là Parcelable hoặc Serializable

## Chia sẻ dữ liệu liên quan đến UI- giữa các điểm đến với ViewModel

Navigation back stack lưu trữ `NavBackStackEntry` không chỉ cho từng đích riêng lẻ mà còn cho từng navigation graph gốc chứa đích riêng lẻ. Điều này cho phép bạn truy xuất `NavBackStackEntry` nằm trong phạm vi navigation graph. navigation graph trong phạm vi `NavBackStackEntry` cung cấp cách tạo `ViewModel` trong phạm vi navigation graph, cho phép bạn chia sẻ dữ liệu liên quan đến UI- giữa các đích đến của graph. Mọi đối tượng `ViewModel` được tạo theo cách này sẽ tồn tại cho đến khi `NavHost` được liên kết và `ViewModelStore` của nó bị xóa hoặc cho đến khi navigation graph được bật ra khỏi back stack.



Ví dụ sau đây cho thấy cách truy xuất `ViewModel` nằm trong phạm vi navigation graph:

```kotlin
val viewModel: MyViewModel
        by navGraphViewModels(R.id.my_graph)
```

Nếu bạn đang sử dụng Navigation 2.2.0 trở xuống, bạn cần cung cấp cho nhà máy của riêng mình để sử dụng Trạng thái đã lưu với ViewModels, như trong ví dụ sau:

```kotlin

val viewModel: MyViewModel by navGraphViewModels(R.id.my_graph) {
    SavedStateViewModelFactory(requireActivity().application, requireParentFragment())
}
```

## Hộp thoại và Backstack

Một hoặc nhiều đích đến của hộp thoại chỉ có thể tồn tại ở đầu back stack. 
Điều này là do khi người dùng điều hướng đến đích không phải là đích của hộp thoại, `NavController` sẽ tự động bật tất cả các đích đến của hộp thoại ra khỏi đầu ngăn xếp. 
Điều này đảm bảo rằng đích hiện tại luôn hiển thị đầy đủ so với các đích khác trên back stack.

## Điều hướng vòng

Hãy tưởng tượng ứng dụng của bạn có ba đích đến: A, B và C. Nó cũng có các hành động dẫn từ A đến B, B đến C và C quay lại A.

Do đó, việc điều hướng liên tục qua luồng trong sơ đồ sẽ khiến back stack của bạn chứa nhiều bộ mỗi đích: A, B, C, A, B, C, A, B, C.


Để tránh sự lặp lại trong back stack của bạn, hãy chỉ định `popUpTo()` và đưa vào lệnh gọi tới `NavController`.`navigate()` hoặc trong hành động điều hướng của bạn.

Trong trường hợp này, khi người dùng điều hướng từ đích C trở lại đích A, NavController cũng bật lên A. Điều này có nghĩa là nó xóa B và C khỏi ngăn xếp. Với `inclusive = true`, nó cũng bật chữ A đầu tiên, xóa ngăn xếp một cách hiệu quả.

## Nhiều ngăn xếp phía sau

Nếu ứng dụng của bạn bao gồm **Dưới Navigation** hoặc **Navigation Drawer**, nhiều hỗ trợ back stack cho phép người dùng của bạn chuyển đổi tự do giữa các luồng trong ứng dụng của bạn **mà không mất vị trí của họ trong bất kỳ luồng nào trong số đó.**

Lớp `NavigationUI` bao gồm các phương thức xử lý việc này một cách tự động nhưng bạn cũng có thể sử dụng các API cơ bản theo cách thủ công để triển khai tùy chỉnh hơn.

### Triển khai hỗ trợ theo cách thủ công với các API cơ bản

Nếu các phần tử do `NavigationUI` cung cấp không đáp ứng yêu cầu của bạn, bạn có thể sử dụng các API cơ bản để lưu và khôi phục ngăn xếp lùi thông qua một trong các bề mặt API khác do thành phần Navigation cung cấp.

### Navigation XML

Trong các phần tử Navigation XML, `<action>` trong navigation graph của bạn có thể sử dụng thuộc tính `app:popUpToSaveState` để lưu trạng thái của bất kỳ đích đến nào mà hành động xuất hiện bằng `app:popUpTo`. Họ cũng có thể sử dụng thuộc tính `app:restoreState` để khôi phục mọi trạng thái đã lưu trước đó cho đích được xác định trong thuộc tính `app:destination`.

```xml
<action
  android:id=”@+id/swap_stack”
  app:destination=”@id/second_stack”
  app:restoreState=”true”
  app:popUpTo=”@id/first_stack_start_destination”
  app:popUpToSaveState=”true” />
```

Bằng cách đó, hành động này sẽ lưu trạng thái của back stack hiện tại đồng thời khôi phục trạng thái đã lưu trước đó của đích back stack, nếu nó tồn tại.

### NavOptions

Lớp `NavOptions` cho phép bạn chuyển các tùy chọn điều hướng đặc biệt để lưu và khôi phục ngăn xếp lùi khi bạn điều hướng bằng `NavController`.

```kotlin
// Use the navigate() method that takes a navOptions DSL Builder
navController.navigate(selectedBottomNavRoute) {
  launchSingleTop = true
  restoreState = true
  popUpTo(navController.graph.findStartDestination().id) {
    saveState = true
  }
}
```