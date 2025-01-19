# TextView

The `TextView` component is designed to display read-only text and is one of the most common UI elements

The `android:text` attribute can be used in your markup file to display text in a `TextView`, as shown below:

```xml
android:text="Hi!"
```

However, this is no longer considered to be the best approach. Instead, it is recommended to use text resources because they will enable multilingual support in the future:


```xml
<!-- strings.xml -->
<string name="hello">Hi!</string>

<!-- inside a TextView tag -->
android:text="@string/hello"
```




