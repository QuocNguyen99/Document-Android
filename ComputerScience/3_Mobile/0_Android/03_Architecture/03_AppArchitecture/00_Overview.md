# App Architecture

## Common architectural principles

As Android apps grow in size, it's important to define an architecture that allows the app to scale, increases the app's robustness, and makes the app easier to test.

An app architecture defines the boundaries between parts of the app and the responsibilities each part should have.
In order to meet the needs mentioned above, you should design your app architecture to follow a few specific principles.

### 1. Separation of concerns

The most important principle to follow is separation of concerns. It's a common mistake to write all your code in an `Activity` or a `Fragment`.
These UI-based classes should only contain logic that handles UI and operating system interactions.
By keeping these classes as lean as possible, you can avoid many problems related to the component lifecycle, and improve the testability of these classes.


### 2. Drive UI from data models

Another important principle is that you should drive your UI from data models, preferably persistent models.

> [!NOTE]
> persistent model refers to a data structure or representation of information within a software application that is stored in a long-term, non-volatile storage like a database
>
Persistent models are ideal for the following reasons:
- Your users don't lose data if the Android OS destroys your app to free up resources.
- Your app continues to work in cases when a network connection is flaky or not available.

Data models represent the data of an app. They're independent from the UI elements and other components in your app.
This means that they are not tied to the UI and app component lifecycle, but will still be destroyed when the OS decides to remove the app's process from memory.

### 3. Single source of truth

When a new data type is defined in your app, you should assign a Single Source of Truth (SSOT) to it.
The SSOT is the owner of that data, and only the SSOT can modify or mutate it.
To achieve this, the SSOT exposes the data using an immutable type, and to modify the data, the SSOT exposes functions or receive events that other types can call.

This pattern brings multiple benefits:
- It centralizes all the changes to a particular type of data in one place.
- It protects the data so that other types cannot tamper with it.
- It makes changes to the data more traceable. Thus, bugs are easier to spot.

### 4. Unidirectional Data Flow

In UDF, state flows in only one direction.
The events that modify the data flow in the opposite direction.

In Android, state or data usually flow from the higher-scoped types of the hierarchy to the lower-scoped ones.
Events are usually triggered from the lower-scoped types until they reach the SSOT for the corresponding data type. 

This pattern better guarantees data consistency, is less prone to errors, is easier to debug and brings all the benefits of the SSOT pattern.



## App Architecture

Considering the common architectural principles mentioned in the previous section, each application should have three layers
- [UI Layer](/General/ComputerScience/3_Mobile/0_Android/3_Architecture/3_AppArchitecture/1_UILayer.md)
- [Domain Layer](/General/ComputerScience/3_Mobile/0_Android/3_Architecture/3_AppArchitecture/2_DomainLayer.md)
- [Data Layer](/General/ComputerScience/3_Mobile/0_Android/3_Architecture/3_AppArchitecture/3_DataLayer.md)

## Manage dependencies between components

Classes in your app depend on other classes in order to function properly.
You can use either of the following design patterns to gather the dependencies of a particular class:

- **Dependency injection (DI)**: Dependency injection allows c  lasses to define their dependencies without constructing them. At runtime, another class is responsible for providing these dependencies.
- **Service locator**: The service locator pattern provides a registry where classes can obtain their dependencies instead of constructing them.

These patterns allow you to scale your code because they provide clear patterns for managing dependencies without duplicating code or adding complexity.
Furthermore, these patterns allow you to quickly switch between test and production implementations.




