# DI Containers

Dependency injection (DI) is important in Android development, as it helps in creating modular and easy-to-maintain apps.

DI containers, which are at the core of this approach, simplify the management of app dependencies and improve efficiency.

## Understanding dependency injection (DI)

Dependency injection is a technique where an object, often referred to as a client, receives other objects that it depends on—known as dependencies. The pattern aims to decouple the construction of dependencies from the client that uses them, leading to more modular, testable, and maintainable code. In Kotlin, especially within Android development, DI is crucial for efficiently managing the lifecycle and configuration of dependencies.

## The types of dependency injection commonly used:

**1. Constructor Injection**: The dependencies are passed to the class constructor, as shown in the UserDataRepository example. This is the most common form of DI and is preferred due to its immutability and thread safety.

```kotlin
class UserDataRepository(private val localDataSource: LocalDataSource) {
    // UserDataRepository methods that use localDataSource
}
```

**2. Field Injection**: **This is used when you do not have control over the instantiation of an object, such as with Activity or Fragment**. Field Injection involves declaring dependencies as properties and setting them after the object's creation. It's suitable for third-party libraries that require a parameterless constructor, as it allows for the injection of dependencies post-instantiation.

```kotlin
class UserDataRepository {
    lateinit var localDataSource: LocalDataSource
    // UserDataRepository methods that use localDataSource
}
```

**3. Method Injection**: **This technique allows you to provide dependencies through a method and is particularly useful for altering dependencies at various lifecycle stages**. While it also supports third-party libraries with parameterless constructors, its primary advantage lies in its ability to modify dependencies dynamically, long after the object has been instantiated.

```kotlin
class UserDataRepository {
    private lateinit var localDataSource: LocalDataSource
    fun setLocalDataSource(localDataSource: LocalDataSource) {
        this.localDataSource = localDataSource
    }
    // UserDataRepository methods that use localDataSource
}
```
> [!CAUTION]
> Each type of injection has its own use cases and benefits. Constructor injection is generally favored  for its simplicity and the immutability it provides. Field and method injections offer flexibility in scenarios where constructor injection is not feasible.

## Understanding DI containers

> [!WARNING]
> This approach is using manual DI containers implementation to deep dive the usecase. not using specific 3nd dependency. If using 3nd dependency DI, some action can be automatically managed by it self

Understanding DI containers requires a grasp of the conventional methods for handling dependencies. Traditionally, dependencies such as data sources and repositories are created directly within the components that use them.

For example, in an Activity, it’s common to instantiate a ViewModel along with its necessary Repository and LocalDataSource. This direct approach, while seemingly straightforward, leads to tightly coupled code, posing challenges in terms of maintenance and scalability.

Consider this typical implementation in a UserProfileActivity:

```kotlin
class UserProfileActivity: AppCompatActivity() { 

    // Using 'by viewModels()' to delegate the ViewModel initialization
    private val viewModel: UserProfileViewModel by viewModels { 
        UserProfileViewModelFactory(UserDataRepository(LocalDataSource())) 
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // ...
    }
}
```

Here, UserProfileActivity directly creates and manages its dependencies. While this approach is easy to understand, it results in code that is highly interconnected, which can pose challenges in maintaining and scaling the application.

The UserProfileViewModel acts as a bridge between the UI and data logic. It is usually created using a ViewModel factory:

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

To overcome the challenges of the straightforward approach, DI containers are introduced. These containers serve as centralized hubs for creating and providing dependencies:


```kotlin
class AppContainer {
    private val localDataSource = LocalDataSource()
    val userDataRepository = UserDataRepository(localDataSource)
}

class MyApp : Application() {
    val appContainer = AppContainer()
}
```

With an AppContainer, UserProfileActivity can be refactored to utilize DI for dependency management:

```kotlin
class UserProfileActivity: AppCompatActivity() {

    // Using 'by viewModels()' to delegate the ViewModel initialization
    private val viewModel: UserProfileViewModel by viewModels { 
        UserProfileViewModelFactory((application as MyApp).appContainer.userDataRepository) 
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // ...
    }
}
```

> [!CAUTION]
> This manual DI approach with an AppContainer and a ViewModel factory significantly enhances code maintainability and scalability. However, it’s crucial to note that DI containers don’t automatically handle lifecycle events of Android components like Activities and Fragments.
> A thorough understanding of the Android lifecycle is essential to ensure that dependencies managed by DI containers are appropriately aligned with these events. This alignment is key to preventing memory leaks and optimizing resource management, thereby contributing to the creation of robust and efficient Android applications.

## Managing the lifecycles and scopes for DI containers

Managing the lifecycle and scope of objects within DI containers is crucial for creating efficient and well-organized applications. Our initial setup with AppContainer demonstrates a common scenario:

```kotlin
class AppContainer {
    private val localDataSource = LocalDataSource()
    val userDataRepository = UserDataRepository(localDataSource)
}
```

In this configuration, userDataRepository remains active throughout the application's lifecycle. However, this isn't always necessary or efficient, especially if userDataRepository is only required in specific sections of the app, like a user profile screen.

To maximize efficiency, we can introduce a UserContainer, a scoped container specifically designed for user-related dependencies:

```kotlin
class UserContainer(localDataSource: LocalDataSource) {
    val userDataRepository = UserDataRepository(localDataSource)
}

class AppContainer {
    val localDataSource = LocalDataSource()
    var userContainer: UserContainer? = null
}
```

The UserContainer encapsulates userDataRepository and manages its lifecycle more efficiently. It's instantiated only when necessary, thereby conserving resources.

When implementing UserContainer in an activity such as UserProfileActivity, the approach looks like this:

```kotlin
class UserProfileActivity: AppCompatActivity() {

    // Using 'by viewModels()' to delegate the ViewModel initialization
    private val userProfileViewModel: UserProfileViewModel by viewModels {
        // Retrieve the AppContainer from the Application context
        val appContainer = (application as MyApp).appContainer

        // Create UserContainer only when needed, not in onCreate()
        val userContainer = UserContainer(appContainer.localDataSource)

        UserProfileViewModelFactory(userContainer.userDataRepository)
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // ...
    }
}
```

In the updated `UserProfileActivity`, `UserContainer` is initialized within the ViewModel creation process using the `by viewModels{}` delegate. This aligns the lifecycle of the UserContainer with the UserProfileViewModel, thus optimizing resource management.

By introducing scoped containers like `UserContainer`, we can effectively manage the **lifecycle** and scope of our dependencies. This not only leads to better memory management but also enhances the modularity and maintainability of the application. Scoping is particularly beneficial in complex applications with multiple components requiring varied dependencies.

## Disadvantages of using manual DI containers in Android development

While DI Containers bring numerous benefits to Android development, including better modularity and maintainability, the use of manual DI containers also has its disadvantages. This section will explore the drawbacks of relying on manual DI containers, providing insights into the potential challenges developers might face when implementing this approach in their applications.


### 1. Complexity in large-scale applications

Although effective in small to medium-sized projects, manual DI containers can become cumbersome in larger applications. As the number of dependencies grows, so does the complexity of managing them:

- **Increased Boilerplate Code**: The manual setup of dependencies often results in a significant amount of boilerplate code, making the codebase more verbose and harder to maintain.

- **Difficulty in Tracking Dependencies**: In large projects, tracking and managing all dependencies can be difficult, leading to potential errors or oversight in dependency management.

### 2. Limited flexibility and scalability

Manual DI containers can be less flexible when it comes to scaling or modifying an application:

- **Tight Coupling with Implementation**: Since dependencies are often hard-coded, it can lead to tight coupling with specific implementations, making it difficult to switch out components or test alternative implementations.

- **Challenges in Refactoring**: Refactoring an application with a manual DI approach can be more challenging, as changes in one part of the code may necessitate updates across various other parts of the codebase.

### 3. Potential for human error

Manual DI relies heavily on the developer's attention to detail:

- **Increased Risk of Errors**: The manual process of injecting dependencies increases the risk of human error. While constructor injection inherently reduces the risk of missing dependencies through its compile-time checks, field and method injection can be prone to oversights during dependency initialization, potentially leading to runtime issues. This necessitates careful management in these injection methods.

- **Inconsistencies in Dependency Management**: Different developers may implement DI in slightly different ways, leading to inconsistencies in how dependencies are managed and injected.

### 4. Testing difficulties

While DI generally aids in testing, manual DI containers can sometimes complicate this process:

- **Complex Setup for Testing**: Setting up a testing environment may require extensive configuration of the DI container, especially if the application has many interconnected dependencies.

- **Limited Isolation for Unit Testing**: Achieving isolated unit tests can be more challenging, as manual DI containers might not easily allow for mocking or replacing dependencies.

## references:

- [DI Containers](https://hyperskill.org/learn/step/41527)





