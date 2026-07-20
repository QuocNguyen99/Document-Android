# Navigation với Compose

Thành phần Navigation cung cấp hỗ trợ cho các ứng dụng Jetpack Compose. Bạn có thể điều hướng giữa các thành phần kết hợp trong khi tận dụng cơ sở hạ tầng và tính năng của thành phần Navigation.

**Khi triển khai điều hướng trong ứng dụng, hãy triển khai máy chủ điều hướng, graph và bộ điều khiển.**

## Tạo NavHost và Graph

Trong Compose, hãy sử dụng thành phần kết hợp NavHost để tạo navigation graph của bạn. Hãy xem xét ví dụ sau:

```kotlin
val navController = rememberNavController()

NavHost(navController = navController, startDestination = "profile") {
    composable("profile") { Profile( /* ... */ ) }
    composable("friendslist") { FriendsList( /* ... */ ) }
    // Add more destinations similarly.
}
```

- Lệnh gọi đến thành phần kết hợp NavHost chuyển NavController và một chuỗi tuyến đường tương ứng với đích bắt đầu.
- Lambda được chuyển tới `NavHost` cuối cùng gọi `NavController.creatGraph()` và trả về `NavGraph`.
- Các lệnh gọi tới `NavGraphBuilder.composable()` sẽ thêm đích vào `NavGraph` thu được.
- Trong trường hợp này, đích đến là các thành phần kết hợp Hồ sơ và FriendsList. Chuỗi lộ trình "hồ sơ" và "danh sách bạn bè" trở thành chìa khóa xác định hai điểm đến.
> [!NOTE]
> Tuyến đường là một chuỗi xác định đường dẫn đến thành phần kết hợp của bạn. Bạn có thể coi nó như một chìa khóa tương ứng với một đích đến cụ thể. Mỗi điểm đến đều có một lộ trình riêng.



## Tạo NavController

Để tạo NavController khi sử dụng Jetpack Compose, hãy gọi `rememberNavController()`:

```kotlin
val navController = rememberNavController()
```


Bạn nên tạo `NavController` ở mức cao trong hệ thống phân cấp tổng hợp của mình. Nó cần phải đủ cao để tất cả các thành phần kết hợp cần tham chiếu đến nó đều có thể làm như vậy.

Làm như vậy cho phép bạn sử dụng `NavController` làm single source of truth để cập nhật các thành phần kết hợp bên ngoài màn hình của bạn. Điều này tuân theo các nguyên tắc của [state hoisting.](../UIArchitecture/ManagingState.md)

## Điều hướng đến một thành phần kết hợp

Để điều hướng đến một thành phần kết hợp trong navigation graph, hãy sử dụng `NavController.navigate(route)`. Với tình trạng quá tải này, `navigate()` nhận một đối số `String` duy nhất. Đây là tuyến đường. Nó phục vụ như là chìa khóa cho một điểm đến.

```kotlin
navController.navigate("friendslist")
```
Để điều hướng bằng chuỗi `route`, **trước tiên bạn cần tạo `NavGraph` sao cho mỗi đích được liên kết với `route`**. Đối với các thành phần kết hợp, bạn thực hiện việc này bằng hàm composable().

## Điều hướng bằng đối số

Navigation Compose cũng hỗ trợ truyền đối số giữa các đích có thể kết hợp. Để thực hiện việc này, bạn cần thêm phần giữ chỗ đối số vào tuyến đường của mình, tương tự như cách bạn thêm đối số vào deep link khi sử dụng thư viện điều hướng cơ sở:

```kotlin
NavHost(startDestination = "profile/{userId}") {
    ...
    composable("profile/{userId}") {...}
}
```
Theo mặc định, tất cả đối số được phân tích cú pháp dưới dạng chuỗi. Tham số `arguments` của `composable()` chấp nhận danh sách các đối tượng `NamedNavArgument`. Bạn có thể nhanh chóng tạo `NamedNavArgument` bằng phương pháp `navArgument()` rồi chỉ định chính xác `type` của nó:


```kotlin
NavHost(startDestination = "profile/{userId}") {
    ...
    composable(
        "profile/{userId}",
        arguments = listOf(navArgument("userId") { type = NavType.StringType })
    ) {...}
}
```

**Bạn nên trích xuất các đối số từ NavBackStackEntry có sẵn trong lambda của hàm composable().**

```kotlin
composable("profile/{userId}") { backStackEntry ->
    Profile(navController, backStackEntry.arguments?.getString("userId"))
}
```

Để chuyển đối số đến đích, bạn cần thêm đối số đó vào tuyến khi bạn thực hiện lệnh gọi `navigate`:

```kotlin
navController.navigate("profile/user1234")
```

## Truy xuất dữ liệu phức tạp khi điều hướng

Chúng tôi khuyên bạn không nên chuyển qua các đối tượng dữ liệu phức tạp khi điều hướng mà thay vào đó hãy chuyển thông tin cần thiết tối thiểu, chẳng hạn như mã định danh duy nhất hoặc dạng ID khác, làm đối số khi thực hiện hành động điều hướng:

```kotlin
// Pass only the user ID when navigating to a new destination as argument
navController.navigate("profile/user1234")
```

**Các đối tượng phức tạp phải được lưu trữ dưới dạng dữ liệu trong single source of truth, chẳng hạn như data layer.** Sau khi đến đích sau khi điều hướng, bạn có thể tải thông tin cần thiết từ single source of truth bằng cách sử dụng ID đã chuyển. Để truy xuất các đối số trong `ViewModel` chịu trách nhiệm truy cập data layer, hãy sử dụng `SavedStateHandle` của `ViewModel`:


```kotlin
class UserViewModel(
    savedStateHandle: SavedStateHandle,
    private val userInfoRepository: UserInfoRepository
) : ViewModel() {

    private val userId: String = checkNotNull(savedStateHandle["userId"])

    // Fetch the relevant user information from the data layer,
    // ie. userInfoRepository, based on the passed userId argument
    private val userInfo: Flow<UserInfo> = userInfoRepository.getUserInfo(userId)

// …

}
```


**Phương pháp này giúp ngăn ngừa mất dữ liệu trong quá trình thay đổi cấu hình và mọi sự không nhất quán khi đối tượng được đề cập đang được cập nhật hoặc bị thay đổi.**

### Thêm đối số tùy chọn

Navigation Compose cũng hỗ trợ các đối số điều hướng tùy chọn. Đối số tùy chọn khác với đối số bắt buộc theo hai cách:

- Chúng phải được đưa vào bằng cú pháp tham số truy vấn ("?argName={argName}")
- Họ phải có bộ defaultValue hoặc có nullable = true (ngầm đặt giá trị mặc định thành null)

Điều này có nghĩa là **tất cả các đối số tùy chọn phải được thêm rõ ràng** vào hàm composable() dưới dạng danh sách:

Bây giờ, ngay cả khi không có đối số nào được chuyển đến đích, defaultValue, "user1234", sẽ được sử dụng thay thế.

## Liên kết sâu

Navigation Compose cũng hỗ trợ các liên kết sâu ẩn có thể được xác định như một phần của hàm composable(). Tham số deepLinks của nó chấp nhận danh sách các đối tượng NavDeepLink có thể được tạo nhanh chóng bằng phương thức navDeepLink():

```kotlin
val uri = "https://www.example.com"

composable(
    "profile?id={id}",
    deepLinks = listOf(navDeepLink { uriPattern = "$uri/{id}" })
) { backStackEntry ->
    Profile(navController, backStackEntry.arguments?.getString("id"))
}
```

**Các liên kết sâu này cho phép bạn liên kết một loại URL**, hành động hoặc kịch câm cụ thể với một thành phần kết hợp. Theo mặc định, các liên kết sâu này không hiển thị với các ứng dụng bên ngoài. Để cung cấp các liên kết sâu này ra bên ngoài, bạn phải thêm các phần tử `<intent-filter>` thích hợp vào tệp manifest.xml của ứng dụng. Để bật deep link trong ví dụ trước, bạn nên thêm phần sau vào bên trong phần tử `<activity>` của tệp kê khai:

```kotlin
<activity …>
  <intent-filter>
    ...
    <data android:scheme="https" android:host="www.example.com" />
  </intent-filter>
</activity>
```

Navigation tự động liên kết sâu vào thành phần kết hợp đó khi deep link được kích hoạt bởi một ứng dụng khác.

<details>
  <summary style="color: orange;">
  <b>
Bạn cũng có thể sử dụng các liên kết sâu tương tự này để xây dựng PendingIntent với deep link thích hợp từ một thành phần kết hợp
  </b>
  </summary>
  
  <p>
  
```kotlin
val id = "exampleId"
val context = LocalContext.current
val deepLinkIntent = Intent(
    Intent.ACTION_VIEW,
    "https://www.example.com/$id".toUri(),
    context,
    MyActivity::class.java
)

val deepLinkPendingIntent: PendingIntent? = TaskStackBuilder.create(context).run {
    addNextIntentWithParentStack(deepLinkIntent)
    getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT)
}
```

  </p>
</details>

## Navigation lồng nhau

Để tạo navigation graph lồng nhau bằng Compose, hãy sử dụng hàm `NavGraphBuilder.navigation()`. Bạn sử dụng `navigation()` giống như các hàm `NavGraphBuilder.composable()` và `NavGraphBuilder.dialog()` khi thêm đích đến vào graph.

Sự khác biệt chính là việc điều hướng tạo ra graph lồng nhau thay vì đích mới. Sau đó, bạn gọi thành phần kết hợp và hộp thoại trong lambda điều hướng để thêm đích đến vào graph lồng nhau.

<details>
  <summary style="color: orange;">
  <b>
  Ví dụ   
  </b>
  </summary>
  
  <p>
  
```kotlin
NavHost(navController, startDestination = "title_screen") {
    composable("title_screen") {
        TitleScreen(
            onPlayClicked = { navController.navigate("register") },
            onLeaderboardsClicked = { /* Navigate to leaderboards */ }
        )
    }
    composable("register") {
        RegisterScreen(
            onSignUpComplete = { navController.navigate("gameInProgress") }
        )
    }
    navigation(startDestination = "match", route = "gameInProgress") {
        composable("match") {
            MatchScreen(
                onStartGame = { navController.navigate("in_game") }
            )
        }
        composable("in_game") {
            InGameScreen(
                onGameWin = { navController.navigate("results_winner") },
                onGameLose = { navController.navigate("game_over") }
            )
        }
        composable("results_winner") {
            ResultsWinnerScreen(
                onNextMatchClicked = {
                    navController.navigate("match") {
                        popUpTo("match") { inclusive = true }
                    }
                },
                onLeaderboardsClicked = { /* Navigate to leaderboards */ }
            )
        }
        composable("game_over") {
            GameOverScreen(
                onTryAgainClicked = {
                    navController.navigate("match") {
                        popUpTo("match") { inclusive = true }
                    }
                }
            )
        }
    }
}
```

  </p>
</details>

Để điều hướng trực tiếp đến đích lồng nhau, hãy sử dụng `route` như cách bạn làm với bất kỳ đích nào khác. Điều này là do các tuyến đường là một khái niệm toàn cầu mà bất kỳ màn hình nào cũng có thể điều hướng đến:

```kotlin
navController.navigate("match")
```

> [!NOTE]
> Bạn có thể xác định phạm vi các tuyến đường có sẵn bằng cách kiểm soát khả năng hiển thị phương thức của các API an toàn loại. Để biết thêm thông tin, hãy xem [Nhập an toàn trong Kotlin DSL và Navigation Compose.](https://developer.android.com/guide/navigation/design/type-safety#type-safety)

### Tích hợp với thanh điều hướng phía dưới

Bằng cách xác định `NavController` ở cấp cao hơn trong hệ thống phân cấp tổng hợp của mình, bạn có thể kết nối Navigation với các thành phần khác, chẳng hạn như thành phần điều hướng phía dưới. Việc làm này cho phép bạn điều hướng bằng cách chọn các biểu tượng ở thanh dưới cùng.

Để liên kết các mục trong thanh điều hướng phía dưới với các tuyến trong navigation graph của bạn, bạn nên xác định sealed class, chẳng hạn như `Screen` được thấy ở đây, chứa tuyến đường và tài nguyên Chuỗi ID cho các đích đến.

```kotlin
sealed class Screen(val route: String, @StringRes val resourceId: Int) {
    object Profile : Screen("profile", R.string.profile)
    object FriendsList : Screen("friendslist", R.string.friends_list)
}
```

Sau đó đặt các mục đó vào danh sách mà `BottomNavigationItem` có thể sử dụng:

```kotlin
val items = listOf(
   Screen.Profile,
   Screen.FriendsList,
)
```
Trong thành phần kết hợp `BottomNavigation` của bạn, hãy lấy `NavBackStackEntry` hiện tại bằng cách sử dụng hàm `currentBackStackEntryAsState()`. Mục này cung cấp cho bạn quyền truy cập vào `NavDestination` hiện tại. Sau đó, trạng thái đã chọn của mỗi `BottomNavigationItem` có thể được xác định bằng cách so sánh tuyến của mục đó với tuyến của đích hiện tại và đích chính của nó để xử lý các trường hợp khi bạn đang sử dụng điều hướng lồng nhau bằng hệ thống phân cấp `NavDestination`.

Tuyến đường của mục cũng được sử dụng để kết nối lambda `onClick` với cuộc gọi đến `navigate` để việc nhấn vào mục sẽ điều hướng đến mục đó. Bằng cách sử dụng cờ `saveState` và `restoreState`, trạng thái và back stack của mục đó được lưu và khôi phục chính xác khi bạn hoán đổi giữa các mục điều hướng phía dưới.

```kotlin
val navController = rememberNavController()
Scaffold(
  bottomBar = {
    BottomNavigation {
      val navBackStackEntry by navController.currentBackStackEntryAsState()
      val currentDestination = navBackStackEntry?.destination
      items.forEach { screen ->
        BottomNavigationItem(
          icon = { Icon(Icons.Filled.Favorite, contentDescription = null) },
          label = { Text(stringResource(screen.resourceId)) },
          selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
          onClick = {
            navController.navigate(screen.route) {
              // Pop up to the start destination of the graph to
              // avoid building up a large stack of destinations
              // on the back stack as users select items
              popUpTo(navController.graph.findStartDestination().id) {
                saveState = true
              }
              // Avoid multiple copies of the same destination when
              // reselecting the same item
              launchSingleTop = true
              // Restore state when reselecting a previously selected item
              restoreState = true
            }
          }
        )
      }
    }
  }
) { innerPadding ->
  NavHost(navController, startDestination = Screen.Profile.route, Modifier.padding(innerPadding)) {
    composable(Screen.Profile.route) { Profile(navController) }
    composable(Screen.FriendsList.route) { FriendsList(navController) }
  }
}
```




