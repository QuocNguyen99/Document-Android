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

Navigation refers to the interactions that let users navigate across, into, and back out from the different pieces of content within your app.

Android Jetpack's Navigation component includes the Navigation library, Safe Args Gradle plug-in, and tooling to help you implement app navigation. The Navigation component handles diverse navigation use cases, from straightforward button clicks to more complex patterns, such as app bars and the navigation drawer.


## Key concepts
The following table provides an overview of the key concepts in navigation and the main types that you use to implement them.

| Concept     | Purpose                                                                                                                                     | Type                                  |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------|
| **Host**    | A UI element that contains the current navigation destination. That is, when a user navigates through an app, the app essentially swaps destinations in and out of the navigation host. | - Compose: `NavHost`<br> - Fragments: `NavHostFragment` |
| **Graph**   | A **data structure** that defines all the navigation destinations within the app and how they connect together.                                  | `NavGraph`                            |
| **Controller** | The central coordinator for managing navigation between destinations. The controller offers methods for navigating between destinations, handling deep links, managing the back stack, and more. | `NavController`                       |
| **Destination** | A node in the navigation graph. When the user navigates to this node, the host displays its content.                                        | `NavDestination` <br>Typically created when constructing the navigation graph. |
| **Route**      | Uniquely identifies a destination and any data required by it. You can navigate using routes. Routes take you to destinations.            | Any serializable data type.           |

## Benefits and features

The Navigation component provides a number of other benefits, including the following:

* **Animations and transitions**: Provides standardized resources for animations and transitions.
* **Deep linking**: Implements and handles deep links that take the user directly to a destination.
* **UI patterns**: Supports patterns such as navigation drawers and bottom navigation with minimal additional work.
* **Type safety**: Includes support for passing data between destinations with type safety.
* **ViewModel support**: Enables scoping a ViewModel to a navigation graph to share UI-related data between the graph's destinations.
* **Fragment transactions**: Fully supports and handles fragment transactions.
* **Back and up**: Handles back and up actions correctly by default.

> [!WARNING]
> Android 13 introduces predictive back navigation, which works with the Navigation component for Android devices. Implement predictive back navigation in your app as soon as possible. Otherwise, users might experience unexpected behavior in a future Android release.
