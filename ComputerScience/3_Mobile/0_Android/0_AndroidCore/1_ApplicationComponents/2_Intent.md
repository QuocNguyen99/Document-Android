# Intents

    An `Intent` is a messaging object you can use to request an action from another [app component](https://developer.android.com/guide/components/fundamentals#Components). Although intents facilitate communication between components in several ways, there are three fundamental use cases:

* **Starting an activity**

* **Starting a service**

* **Delivering a broadcast**

Intent types
------------

    There are two main types of intents:

    

* **Explicit intents** specify which application will satisfy the intent, by supplying either the target app's package name or a fully-qualified component class name. You'll typically use an explicit intent to start a component in your own app, because you know the class name of the activity or service you want to start. For example, you might start a new activity within your app in response to a user action, or start a service to download a file in the background.

* **Implicit intents** do not name a specific component, but instead declare a general action to perform, which allows a component from another app to handle it. For example, if you want to show the user a location on a map, you can use an implicit intent to request that another capable app show a specified location on a map.

Building an intent
------------------

An `Intent` object carries information that the Android system uses to determine which component to start (such as the exact component name or component category that should receive the intent), plus information that the recipient component uses in order to properly perform the action (such as the action to take and the data to act upon).

The primary information contained in an `Intent` is the following:

- **Component name**

    This is optional, but it's the critical piece of information that makes an intent _explicit_, meaning that the intent should be delivered only to the app component defined by the component name. Without a component name, the intent is _implicit_ and the system decides which component should receive the intent based on the other intent information (such as the action, data, and category—described below). If you need to start a specific component in your app, you should specify the component name.

- **Action**

    A string that specifies the generic action to perform (such as _view_ or _pick_).

In the case of a broadcast intent, this is the action that took place and is being reported. The action largely determines how the rest of the intent is structured—particularly the information that is contained in the data and extras.

- **Data**

    The URI (a `[Uri]` object) that references the data to be acted on and/or the MIME type of that data. The type of data supplied is generally dictated by the intent's action. For example, if the action is `[ACTION_EDIT]`, the data should contain the URI of the document to edit.

- **Category**

    A string containing additional information about the kind of component that should handle the intent. Any number of category descriptions can be placed in an intent, but most intents do not require a category

- **Extras**

       Key-value pairs that carry additional information required to accomplish the requested action. Just as some actions use particular kinds of data URIs, some actions also use particular extras.

- **Flags**

        Flags are defined in the `[Intent]` class that function as metadata for the intent. The flags may instruct the Android system how to launch an activity (for example, which Task the activity should belong to) and how to treat it after it's launched (for example, whether it belongs in the list of recent activities).

Receiving an implicit intent

    To advertise which implicit intents your app can receive, declare one or more intent filters for each of your app components with an [`<intent-filter>`](https://developer.android.com/guide/topics/manifest/intent-filter-element) element in your manifest file. Each intent filter specifies the type of intents it accepts based on the intent's action, data, and category. The system delivers an implicit intent to your app component only if the intent can pass through one of your intent filters.

    In each app component that includes an `<intent-filter>` element, explicitly set a value for [`android:exported`](https://developer.android.com/guide/topics/manifest/activity-element#exported). This attribute indicates whether the app component is accessible to other apps. In some situations, such as activities whose intent filters include the [`LAUNCHER`](https://developer.android.com/reference/android/content/Intent#CATEGORY_LAUNCHER) category, it's useful to set this attribute to `true`. Otherwise, it's safer to set this attribute to `false`.

Using a pending intent
----------------------

A `[PendingIntent]` object is a wrapper around an `[Intent]` object. The primary purpose of a `[PendingIntent]` is to grant permission to a foreign application to use the contained `[Intent]` as if it were executed from your app's own process.
