#TextView

Thành phần `TextView` được thiết kế để hiển thị văn bản chỉ đọc và là một trong những thành phần UI phổ biến nhất

Thuộc tính `android:text` có thể được sử dụng trong tệp đánh dấu của bạn để hiển thị văn bản trong `TextView`, như hiển thị bên dưới:

```xml
android:text="Hi!"
```

Tuy nhiên, đây không còn được coi là phương pháp tốt nhất nữa. Thay vào đó, bạn nên sử dụng tài nguyên văn bản vì chúng sẽ cho phép hỗ trợ đa ngôn ngữ trong tương lai:


```xml
<!-- strings.xml -->
<string name="hello">Hi!</string>

<!-- inside a TextView tag -->
android:text="@string/hello"
```




