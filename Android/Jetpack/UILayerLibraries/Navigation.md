# System Navigation

## Principle of navigation

    Navigation between different screens and apps is a core part of the user experience.

### Fixed start destination

    Every app you build has a fixed start destination. This is the first screen the user sees when they launch your app from the launcher.

**Note:** An app might have a one-time setup or series of login screens. These [conditional screens](https://developer.android.com/topic/libraries/architecture/navigation/navigation-conditional) should not be considered start destinations because users see these screens only in certain cases.

### Navigation state is represented as a stack of destinations

    When your app is first launched, a [new task](https://developer.android.com/guide/components/activities/tasks-and-back-stack) is created for the user, and app displays its start destination. This becomes the base destination of what is known as the _back stack_ and is the basis for your app’s navigation state.

### Up and Back are identical within your app's task

    Nút Quay lại xuất hiện trong thanh điều hướng hệ thống ở cuối màn hình và được sử dụng để điều hướng theo trình tự thời gian đảo ngược thông qua lịch sử của các màn hình mà người dùng đã làm việc gần đây. Khi bạn nhấn nút Quay lại, đích hiện tại sẽ bật ra khỏi đầu ngăn xếp sau, sau đó bạn điều hướng đến đích trước đó.

Nút Lên xuất hiện trong thanh ứng dụng ở đầu màn hình. Trong tác vụ của ứng dụng, các nút Lên và Quay lại hoạt động giống hệt nhau.

### The Up button never exits your app

    Nếu người dùng đang ở đích bắt đầu của ứng dụng thì nút Lên sẽ không xuất hiện vì nút Lên không bao giờ thoát khỏi ứng dụng. Tuy nhiên, nút Quay lại được hiển thị và thoát khỏi ứng dụng.

### Deep linking simulates manual navigation

    When deep linking to a destination within your app’s task, any existing back stack for your app’s task is removed and replaced with the deep-linked back stack.

VN : Nghĩa là trong khi sử dụng ứng dụng, back stack hiện tại sẽ bị thay thế nếu deep link dẫn đến một màng hình cụ thể nào đó, lúc đó back stack của deep link sẽ thay thế back stack cũ

# Jetpack's Navigation

Navigation đề cập đến các tương tác cho phép người dùng điều hướng qua, vào và thoát khỏi các phần nội dung khác nhau trong ứng dụng của bạn. Navigation của Android Jetpack giúp bạn triển khai điều hướng, từ các lần nhấp vào nút đơn giản đến các mẫu phức tạp hơn, chẳng hạn như thanh ứng dụng và ngăn điều hướng



The Navigation component consists of three key parts that are described below:

* Navigation graph: An XML resource chứa tất cả thông tin liên quan đến điều hướng ở một vị trí tập trung. Điều này bao gồm tất cả các khu vực nội dung riêng lẻ trong ứng dụng của bạn, được gọi là destination, cũng như các đường dẫn có thể có mà người dùng có thể đi qua ứng dụng của bạn.
* `NavHost`: An empty container that displays destinations from your navigation graph. The Navigation component contains a default `NavHost` implementation, [`NavHostFragment`](https://developer.android.com/reference/androidx/navigation/fragment/NavHostFragment), that displays fragment destinations.
* `NavController`: Một đối tượng quản lý điều hướng ứng dụng trong `NavHost`. sắp xếp việc hoán đổi nội dung đích trong NavHost khi người dùng di chuyển trong ứng dụng của bạn.

Khi bạn điều hướng qua ứng dụng của mình, bạn nói với NavController rằng bạn muốn điều hướng dọc theo một đường dẫn cụ thể trong biểu đồ điều hướng của bạn hoặc trực tiếp đến một đích cụ thể. Sau đó, NavController hiển thị đích thích hợp trong NavHost



The Navigation component provides a number of other benefits, including the following:

* Handling fragment transactions.
* Handling Up and Back actions correctly by default.
* Providing standardized resources for animations and transitions.
* Implementing and handling deep linking.
* Including Navigation UI patterns, such as navigation drawers and bottom navigation, with minimal additional work.
* [Safe Args](https://developer.android.com/guide/navigation/navigation-pass-data#Safe-args) - a Gradle plugin that provides type safety when navigating and passing data between destinations.
* `ViewModel` support - you can scope a `ViewModel` to a navigation graph to share UI-related data between the graph's destinations.
