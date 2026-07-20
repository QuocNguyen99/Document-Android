# Bình luận trong Kotlin

## Bình luận cuối dòng

Sau "//", compiler bỏ qua mọi văn bản còn lại trên dòng.

## Comment nhiều dòng

compiler bỏ qua mọi văn bản giữa các ký hiệu /* và */. Bạn có thể sử dụng chúng để viết cả bình luận một dòng và nhiều dòng:

```kotlin
fun main() {
    /* This is a single-line comment */
    /*  This is an example of
        a multi-line comment */

    /*** Valid multiline comment
        println("Hello")
        println("World")
    **/
}
```

## Nhận xét tài liệu (nhận xét tài liệu)

Tài liệu là một văn bản giúp người khác hiểu mã của bạn làm gì. Bạn có thể sử dụng các loại nhận xét này để tự động tạo tài liệu về source code của mình bằng một công cụ đặc biệt. Thông thường, những chú thích này được đặt phía trên phần khai báo của các thành phần chương trình tương ứng. Ngoài ra, trong trường hợp này, một số nhãn đặc biệt, chẳng hạn như `@param`, `@return` và các nhãn khác được sử dụng để điều khiển công cụ.