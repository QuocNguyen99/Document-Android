# Nhập an toàn vào Kotlin DSL và Navigation

## Args an toàn

Thành phần Navigation có plugin Gradle có tên là Safe Args, giúp tạo các lớp trình tạo và đối tượng đơn giản để điều hướng an toàn loại và truy cập vào mọi đối số liên quan. Safe Args được khuyên dùng để điều hướng và truyền dữ liệu vì nó đảm bảo an toàn về loại.

Sau khi bạn bật Safe Args, mã được tạo của bạn sẽ chứa các loại lớp và phương thức an toàn sau đây cho từng hành động cũng như với từng đích gửi và nhận.

- Một lớp được tạo cho mỗi đích nơi hành động bắt nguồn. Tên của lớp này là tên của điểm đến ban đầu được gắn thêm từ "Chỉ đường". Ví dụ: nếu đích ban đầu là một đoạn có tên `SpecifyAmountFragment` thì lớp được tạo ra có tên là `SpecifyAmountFragmentDirections`.

- Một lớp được tạo cho đích nhận. Tên của lớp này là tên của đích được thêm từ "Args". Ví dụ: nếu đoạn đích có tên là `ConfirmationFragment` thì lớp được tạo ra có tên là `ConfirmationFragmentArgs`. Sử dụng phương thức `fromBundle()` của lớp này để truy xuất các đối số.

Ví dụ:

```kotlin
override fun onClick(v: View) {
   val amountTv: EditText = view!!.findViewById(R.id.editTextAmount)
   val amount = amountTv.text.toString().toInt()
   val action = SpecifyAmountFragmentDirections.confirmationAction(amount)
   v.findNavController().navigate(action)
}
```

Trong mã cho đích nhận, hãy sử dụng phương thức getArguments() để truy xuất gói và sử dụng nội dung của nó.

```kotlin
val args: ConfirmationFragmentArgs by navArgs()

override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    val tv: TextView = view.findViewById(R.id.textViewAmount)
    val amount = args.amount
    tv.text = amount.toString()
}
```

## Từ Navigation 2.8.0


Bạn có thể sử dụng các API an toàn loại tích hợp sẵn để cung cấp loại an toàn trong thời gian biên dịch cho navigation graph của mình. 
Chúng có sẵn kể từ Navigation 2.8.0.
Các API này tương đương với những gì Safe Args cung cấp cho biểu đồ điều hướng được xây dựng bằng XML.

## Xác định tuyến đường
Để sử dụng các tuyến đường an toàn kiểu trong Compose, trước tiên bạn cần xác định các lớp hoặc đối tượng có thể tuần tự hóa đại diện cho các tuyến đường của mình.

- **Đối tượng**: Sử dụng đối tượng cho các tuyến đường không có đối số.
- **Lớp**: Sử dụng một lớp hoặc data class cho các tuyến có đối số.
- `KClass<T>`: Sử dụng nếu bạn không cần truyền đối số, chẳng hạn như lớp không có tham số hoặc lớp trong đó tất cả tham số đều có giá trị mặc định
Ví dụ: Hồ sơ::lớp

Đối với các đối số tùy chọn, hãy tạo các trường có thể rỗng với giá trị mặc định.
Trong cả hai trường hợp, đối tượng hoặc lớp phải có khả năng tuần tự hóa.

ví dụ:
```kotlin
// Define a home route that doesn't take any arguments
@Serializable
object Home

// Define a profile route that takes an ID
@Serializable
data class Profile(val id: String)
```

Xây dựng graph của bạn

```kotlin
NavHost(navController, startDestination = Home) {
     composable<Home> {
         HomeScreen(onNavigateToProfile = { id ->
             navController.navigate(Profile(id)) // Navigate to type safe route
         })
     }
     // composable() takes a type parameter. That is, composable<Profile>.
     // Defining the destination type is a more robust approach than passing a route string as in composable("profile").
     composable<Profile> { backStackEntry ->  
        // For the profile route, the toRoute() extension method recreates the 
        // Profile object from the NavBackStackEntry and its arguments.
        // Then read the args.
         val profile: Profile = backStackEntry.toRoute()
         ProfileScreen(profile.id)
     }
}
```

