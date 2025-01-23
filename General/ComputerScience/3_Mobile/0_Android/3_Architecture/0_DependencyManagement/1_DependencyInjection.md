# Dependency Injection in Android

Exploring Dependency Injection (DI) in Android development offers a deep dive into the architectural composition of Android apps and the significant role DI plays in streamlining the development process. This article is designed to clarify DI's essentials, supported by real-world applications and examples, for those new to the concept or seeking to deepen their understanding. The focus is on demystifying DI to highlight its importance as a tool in the Android developer's toolkit.

## Understanding Dependency Injection

Dependency Injection (DI) might sound complex, but it's actually a straightforward concept that makes coding easier and cleaner, especially in Android apps using Kotlin. Let's break it down: Imagine you're assembling a computer. Instead of manufacturing each component yourself—like the processor, memory, or graphics card—you select and acquire these components from various suppliers. That's what DI does with objects in programming. It's all about giving an object the things it needs (dependencies) from the outside rather than having it create those things itself.

Consider you're working on an app with a class `UserDataRepository` used to fetch user data. To do so, it requires an object `LocalDataSource` to get the data. Instead of creating `LocalDataSource` inside `UserDataRepository`, we tell `UserDataRepository` to expect a `LocalDataSource` from the outside when it's being created. Here's what it looks like in code:

```kotlin
class UserDataRepository(private val localDataSource: LocalDataSource) {
    // Here, UserDataRepository uses localDataSource to do its job
}
```

This way, `UserDataRepository` doesn't need to know where `LocalDataSource` comes from or how it's made. It just knows it needs a `LocalDataSource` to work.

## Types of DI:

There are a few types of Dependency Injection commonly used:

- **Constructor Injection**: The dependencies are passed to the class constructor, as shown in the UserDataRepository example. This is the most common form of DI.

- **Field Injection**: Sometimes, you can't use the constructor to give the object what it needs. In Android, this happens a lot with screens (Activities) and screen parts (Fragments). So, you set up the needed parts directly into the object's fields (variables) after it's been created.

```kotlin
class UserDataRepository {
    lateinit var localDataSource: LocalDataSource
    // UserDataRepository now has a localDataSource it can use
}

// Inject localDataSource into userDataRepository
val userDataRepository = UserDataRepository()
userDataRepository.localDataSource = LocalDataSource()
```

- **Method Injection**: In some cases, you might want to give or change the parts an object needs using a method, especially if these needs can change over time or you want to set them up at a specific moment.

```kotlin
class UserDataRepository {
    private lateinit var localDataSource: LocalDataSource

    fun setLocalDataSource(localDataSource: LocalDataSource) {
        this.localDataSource = localDataSource
    }

    // UserDataRepository can now use the provided localDataSource
}
```
Each type of injection has its specific use cases and advantages. Constructor injection is often preferred for its straightforwardness and for promoting the use of immutable dependencies. Field and method injections offer flexibility in scenarios where constructor injection is not feasible.

## Understanding DI Graph

In Android development, it's essential to have a clear and efficient way to organize the parts of your application. This organization can be visualized as a Dependency Injection (DI) Graph, which helps manage the dependencies between different components of your app. Let's break down this concept, focusing on the roles of `LocalDataStore`, `Repository`, `ViewModel`, and `Activity`.

Image with graph like [this](https://developer.android.com/static/images/training/dependency-injection/2-application-graph.png)

- **LocalDataStore** - The LocalDataStore is where your app's data lives. Think of it as the foundation of a house, but for your app's data. It directly interacts with the database or any local storage system to fetch or save data.

- **Repository** (e.g., UserDataRepository) - Acts as a central point for data management, interfacing with LocalDataStore and other sources like network APIs. It aggregates data from these varied sources, ensuring the ViewModel remains abstracted from data origin complexities and conflict resolutions. The Repository simplifies data access for the rest of the app, serving as a unified source of truth.

- **ViewModel** (e.g., UserProfileViewModel) - The ViewModel is where the data gets shaped into something the app's screens can use. It takes the data from the Repository, possibly does some additional processing, and makes it ready for the UI. The ViewModel's job is to handle all the logic that the UI (Activity) will display, ensuring that the Activity remains simple and focused on presenting the UI.

- **Activity** (e.g., UserProfileActivity)- The Activity is the component that displays the UI to the user. It uses the ViewModel to get the data it needs to present. The Activity should be as simple as possible, focusing only on UI logic, like responding to user inputs and displaying data provided by the ViewModel.

## Handling an App Screen Without Dependency Injection

In the scenario where an app screen operates without Dependency Injection (DI), the emphasis is on the `Activity` itself creating its necessary dependencies, including those required by the `ViewModel`.
Without Dependency Injection (DI), managing an Android app's components becomes more direct but less flexible. Managing dependencies within app components, such as Activities, is often done directly and without the use of advanced techniques like Dependency Injection (DI).
This approach, while straightforward, can lead to challenges in code maintainability and scalability. Let's explore how a typical `UserProfileActivity` might be set up in this scenario and the implications of managing dependencies directly.

```kotlin
class UserProfileActivity: AppCompatActivity() { 

    // ViewModel initialization without DI, using a ViewModel factory
    private val viewModel: UserProfileViewModel by viewModels { 
        UserProfileViewModelFactory(UserDataRepository(LocalDataSource()))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // UI setup code...
    }
}
```
Here, `UserProfileActivity` directly creates and manages its dependencies. While this approach is easy to understand, it results in code that is highly interconnected, which can pose challenges in maintaining and scaling the application.

The `UserProfileViewModel` acts as a bridge between the UI and data logic. It is usually created using a ViewModel factory:

```kotlin
class UserProfileViewModel(private val userDataRepository: UserDataRepository) : ViewModel() {
    // ViewModel logic
}

class UserProfileViewModelFactory(private val userDataRepository: UserDataRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass === UserProfileViewModel::class.java) {
            return UserProfileViewModel(userDataRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```
## Challenges:
- **Coupling**: The Activity is closely tied to all the underlying layers (ViewModel, Repository, LocalDataStore), making the code less modular.

- **Difficulty in Testing**: Testing the Activity requires setting up all its dependencies, complicating the testing process.

- **Scalability**: As the app grows, this tightly coupled setup makes it harder to manage and update different components.

In essence, without DI, each component within an app screen must directly manage its dependencies, leading to increased complexity and reduced maintainability.

## Managing dependencies with a DI Containers

DI Containers stand out as a powerful tool to tackle common challenges in managing dependencies within Android applications. These containers act as centralized hubs, taking over the responsibility of creating and providing dependencies. This approach significantly reduces the complexity associated with directly linking components to their dependencies, promoting cleaner, more maintainable code.

```kotlin
class AppContainer {
    private val localDataSource = LocalDataSource()
    val userDataRepository = UserDataRepository(localDataSource)
}

class MyApp : Application() {
    val appContainer = AppContainer()
}
```
With an `AppContainer`, dependencies are not instantiated within the components themselves but are provided by the container. This method simplifies dependency management and enha

The `Application` class in Android serves as the base class for maintaining global application state. We use it to store Dependency Injection (DI) containers because it's created before any activity, service, or receiver objects (except content providers), making it an ideal place to initialize shared resources like DI containers. This ensures that dependencies are available throughout the application's lifecycle.

> [!CAUTION]
> When using a custom `Application` class to store DI containers or for other initialization purposes, you must declare this class in your app's manifest file (`AndroidManifest.xml`) using the `android:name` attribute in the `<application>` tag. This step is crucial for the Android system to instantiate your custom `Application` class on app launch.

By utilizing an `AppContainer`, `UserProfileActivity` can be refactored to delegate the responsibility of providing dependencies:

```kotlin
class UserProfileActivity: AppCompatActivity() {

    // ViewModel initialization delegated to DI Container
    private val viewModel: UserProfileViewModel by viewModels { 
        UserProfileViewModelFactory((application as MyApp).appContainer.userDataRepository) 
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Activity setup code...
    }
}
```

This approach significantly improves code maintainability and scalability by reducing the direct dependencies between components. It allows `UserProfileActivity` to focus on UI logic, delegating data management to the DI Container.

While DI Containers offer numerous benefits, they don't automatically manage the lifecycle events of components like Activities and Fragments. A thorough understanding of the Android lifecycle is essential to ensure that dependencies provided by DI Containers are appropriately aligned with these events. Proper alignment is crucial for preventing memory leaks and optimizing resource management, contributing to the development of robust and efficient Android applications.

## Managing the Lifecycles and Scopes for DI Containers

Effectively managing the lifecycle and scope of dependencies in Android apps is essential for building efficient and well-structured applications.
An initial setup using an AppContainer illustrates a typical scenario:

```kotlin
class AppContainer {
    private val localDataSource = LocalDataSource()
    val userDataRepository = UserDataRepository(localDataSource)
}
```

In this setup, the userDataRepository is always active, which might not be ideal, especially if it's only needed for certain parts of the app, like a user profile screen.

To address this, we introduce a UserContainer, a scoped container designed for managing user-specific dependencies:


```kotlin
class UserContainer(localDataSource: LocalDataSource) {
    val userDataRepository = UserDataRepository(localDataSource)
}

class AppContainer {
    val localDataSource = LocalDataSource()
    var userContainer: UserContainer? = null
}
```

The UserContainer specifically manages the userDataRepository, ensuring it's only created and active when necessary, thus conserving resources. The implementation in `UserProfileActivity` showcases how to utilize the UserContainer effectively:

```kotlin
class UserProfileActivity: AppCompatActivity() {

    // ViewModel initialization with scoped container
    private val userProfileViewModel: UserProfileViewModel by viewModels {
        // Accessing the AppContainer from the application context
        val appContainer = (application as MyApp).appContainer

        appContainer.userContainer = UserContainer(appContainer.localDataSource)

        UserProfileViewModelFactory(appContainer.userContainer.userDataRepository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Activity setup...
    }

    override fun onDestroy() {
        appContainer.userContainer = null
        super.onDestroy()
    }
}
```
Here, the `UserContainer` is prepared during the ViewModel's initialization phase, aligning the userDataRepository's lifecycle with that of the `UserProfileViewModel`, thereby enhancing resource management.


By introducing scoped containers like UserContainer, we effectively manage the lifecycle and scope of our dependencies. This not only leads to better memory management but also enhances the modularity and maintainability of the application. Scoping is particularly beneficial in complex applications with multiple components requiring varied dependencies.


## Conclusion

Understanding DI is vital for Android developers, as it enhances the management, maintenance, and scalability of code. These concepts enable the creation of robust, adaptable applications. To simplify DI implementation and mitigate manual complexities, developers often use frameworks like Hilt, Dagger, Koin, etc. which streamline dependency management and reduce boilerplate in complex Android applications.






### reference

- ["Vanilla" DI in Android](https://hyperskill.org/learn/step/43530)
