# Data Binding

        The Data Binding Library is a support library that allows you to bind UI components in your layouts to data sources in your app using a declarative format rather than programmatically.



The following example shows how to use the Data Binding Library to assign text to the widget directly in the layout file. This removes the need to call any of the Java code shown above. Note the use of `@{}` syntax in the assignment expression:



```xml
<TextView
    android:text="@{viewmodel.userName}" />
```

    Binding components in the layout file lets you remove many UI framework calls in your activities, making them simpler and easier to maintain. This can also improve your app's performance and help prevent memory leaks and null pointer exceptions.

## Two-way data binding

Using one-way data binding, you can set a value on an attribute and set a listener that reacts to a change in that attribute:

```xml
<CheckBox
    android:id="@+id/rememberMeCheckBox"
    android:checked="@{viewmodel.rememberMe}"
    android:onCheckedChanged="@{viewmodel.rememberMeChanged}"
/>
```

Two-way data binding provides a shortcut to this process:

```xml
<CheckBox
    android:id="@+id/rememberMeCheckBox"
    android:checked="@={viewmodel.rememberMe}"
/>
```

The `@={}` notation, which importantly includes the "=" sign, receives data changes to the property and listen to user updates at the same time.
