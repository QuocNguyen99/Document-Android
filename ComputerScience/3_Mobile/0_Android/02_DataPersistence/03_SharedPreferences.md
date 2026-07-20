# SharedPreferences

Saving does not necessarily need an Internet connection. Let's say we have a list of contacts in our application. This information is stored locally on the phone and can be synchronized with backup services. We can save data in regular files using standard methods of writing and reading files, or we could use a more functional feature: databases.

## Ways to save data in Android Application

The Android system offers different storage options within an application.
We can store data simply in the internal or external (SD card) storage, we can use the built-in capabilities of SQLite database, and files that store information according to the key-value database.
In this section, we will talk about key-value data storage.


> [!NOTE]
> key-value also known as Map or Dictionary, key-value pair set is a common data structure that stores objects according to their keys.
> You can retrieve objects in the structure using keys. Most often, string or integer keys are used.

## Share preferences mode 

let's take a look at some constants in Context class: `Context.MODE_PRIVATE` makes SharedPreferences file visible only to your application, `Context.MODE_WORLD_READABLE` allows other applications to read these settings, `Context.MODE_WORLD_WRITEABLE` allows other applications to write settings of our app. Note that the last two have been deprecated since API 17 for security reasons. Mainly, `MODE_PRIVATE` is used, so we won't be paying more attention to other modes.

## Use cases of SharedPreferences

Sometime we want to kept the configuration values of our application: theme, style, and font size.

> [!NOTE]
> Note that a limited number of data types are supported: `Boolean`, `Float` (Double isn't supported!), `Int`, `Long`, `String`, `Set<String>`.
> If we want to save complex types, especially with nesting, it is best to save them in separate files.

























