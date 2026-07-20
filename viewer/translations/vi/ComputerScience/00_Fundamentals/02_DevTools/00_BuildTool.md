# Xây dựng công cụ

build tool là chương trình tự động hóa process trong việc tạo các ứng dụng thực thi từ source code. Bản dựng process bao gồm việc biên dịch các nguồn cũng như liên kết và đóng gói mã thành dạng có thể sử dụng được hoặc có thể thực thi được.

## Công cụ xây dựng có thể làm được những gì?

1. **Tải xuống và thêm phần phụ thuộc**. Điều này đặc biệt thuận tiện khi dự án của bạn phụ thuộc vào một số lượng lớn thư viện.

2. **Biên dịch source code thành mã byte**. Các công cụ xây dựng sẽ gọi compiler cho tất cả các tệp trong dự án của bạn.

3. **Mã biên dịch bao bì**. Bạn sẽ có một kho lưu trữ ứng dụng sẵn sàng sản xuất như JAR, APK hoặc một số kho lưu trữ khác.

4. **Chạy thử nghiệm**. Ví dụ: kiểm tra kho lưu trữ ứng dụng mỗi lần để kiểm tra xem nó có hoạt động chính xác hay không. Nó cho phép các lập trình viên tránh lỗi sau khi sửa đổi ứng dụng.

5. **Triển khai vào môi trường sản xuất**.

## Xây dựng công cụ cho các dự án dựa trên Java
Có ba công cụ xây dựng chính cho các dự án dựa trên Java: Apache Ant, Apache Maven và Gradle.

- **Apache Ant** được phát hành vào năm 2000. Đây là công cụ xây dựng lâu đời nhất trong ba công cụ xây dựng này. Các lập trình viên hiếm khi sử dụng Ant trong các dự án mới nhưng nó vẫn xảy ra trong thực tế. Bạn có thể sử dụng công cụ này cùng với Apache Ivy để quản lý các phần phụ thuộc.

- **Apache Maven** được phát hành vào năm 2004 và hiện nay nó là một trong những lựa chọn phổ biến nhất dành cho các nhà phát triển Java (đặc biệt là phát triển phía máy chủ). Nhiều dự án, cả cũ và mới, sử dụng Maven làm build tool vì khả năng quản lý phụ thuộc mạnh mẽ của nó.

- **Maven** tuân theo khái niệm Quy ước về cấu hình, nghĩa là nhà phát triển chỉ cần chỉ định các khía cạnh độc đáo của ứng dụng và tất cả các khía cạnh tiêu chuẩn đều hoạt động theo mặc định.

- **Gradle** là một công cụ mới so với Ant và Maven. Nó được phát hành vào năm 2007 và hiện là tiêu chuẩn cho các ứng dụng Android. Ngoài ra, các nhà phát triển sử dụng nó để phát triển máy chủ và máy tính để bàn. Gradle nhằm mục đích “kết hợp sức mạnh và tính linh hoạt của Ant với khả năng quản lý phụ thuộc và các quy ước của Maven để xây dựng một cách hiệu quả hơn”.

##Gradle 

Gradle là một công cụ tự động hóa hiện đại giúp xây dựng và quản lý các dự án được viết bằng Java, Kotlin, Scala và các ngôn ngữ dựa trên JVM- khác. Nó mô tả các phụ thuộc của dự án và xác định cách xây dựng một dự án.


Gradle sử dụng hệ thống plugin được thiết kế tốt, đó là lý do tại sao nó là một công cụ có khả năng mở rộng cao. Bạn có thể sử dụng plugin để tạo phiên bản tự động, kiểm tra tự động, báo cáo về bản dựng, v.v.

Một trong những điều tuyệt vời nhất về Gradle là ngôn ngữ dành riêng cho miền dựa trên Groovy (DSL) cung cấp cho các nhà phát triển một cách cụ thể để tạo tập lệnh xây dựng tùy chỉnh. Các nhà phát triển Kotlin đặc biệt may mắn vì Gradle cũng bắt đầu hỗ trợ Kotlin cho các tập lệnh như vậy.


> [!NOTE]
> Xin lưu ý rằng DSL là ngôn ngữ máy tính chuyên dùng cho một miền ứng dụng cụ thể (như tự động hóa bản dựng). Điều này trái ngược với ngôn ngữ có mục đích chung (GPL), được áp dụng rộng rãi trên các miền.

### Các tính năng chính của Gradle

- **Tệp cài đặt**. Gradle sử dụng một số loại tệp cài đặt để mô tả cách xây dựng dự án.

- **Xây dựng theo quy ước**. Một lập trình viên không cần chỉ định từng bước xây dựng cần thực hiện. Thay vào đó, Gradle sử dụng cài đặt và hành vi mặc định. Mặc dù vậy, mọi bước của bản dựng mặc định process đều có thể được tùy chỉnh nếu cần.

- **Quản lý phụ thuộc**. Gradle tự động tải xuống các thư viện bên ngoài được chỉ định và giải quyết các trường hợp xung đột với các phần phụ thuộc. Bạn có thể khai báo bao nhiêu phần phụ thuộc mà bạn cần cho một dự án.

- **Xây dựng**. Gradle cho phép lập trình viên thiết kế các bản dựng dễ hiểu có cấu trúc tốt và dễ bảo trì. Nó cũng hỗ trợ các trường hợp phức tạp như xây dựng nhiều dự án hoặc một phần.

- **Dễ di chuyển**. Gradle có thể dễ dàng thích ứng với mọi cấu trúc dự án mà bạn có. Do đó, bạn luôn có thể phát triển dự án của mình chính xác theo cách bạn muốn.

- **DSL (dựa trên Groovy và Kotlin)** để viết tập lệnh trong tệp cài đặt.

### Các khái niệm chính của Gradle

- **dự án** có thể đại diện cho nội dung nào đó sẽ được xây dựng (ví dụ: tệp JAR hoặc kho lưu trữ ZIP) hoặc một việc cần làm (ví dụ: triển khai ứng dụng). Mỗi bản dựng Gradle đều chứa một hoặc nhiều dự án.

- **tác vụ** là một phần công việc mà bản dựng thực hiện. Điều này có thể bao gồm việc biên dịch các lớp, chạy thử nghiệm, tạo tài liệu, v.v. Mỗi dự án về cơ bản là một collection của một hoặc một số nhiệm vụ.

###Cấu trúc cơ bản nhất


```
.
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

Dưới đây là thông tin ngắn gọn về tất cả các tệp được tạo:

- Tệp `build.gradle` là tệp chính chỉ định dự án của Gradle, bao gồm các nhiệm vụ của nó và các thư viện bên ngoài. Nó có thể được tạo sau khi gọi lệnh init gradle. 

- Các tệp `gradle-wrapper.jar`, `gradle-wrapper.properties`, `gradlew` và `gradlew.bat` thuộc về **Gradle Wrapper** cho phép bạn chạy Gradle mà không cần cài đặt thủ công.

- Tệp `settings.gradle` chỉ định những dự án nào sẽ được đưa vào bản dựng của bạn. Tệp này là tùy chọn đối với bản dựng chỉ có một dự án, nhưng nó là bắt buộc đối với bản dựng nhiều dự án.


### Cấu hình bản dựng Gradle

#### Plugin

Phần plugin thêm một số plugin để mở rộng khả năng của dự án, chẳng hạn như thêm nhiệm vụ hoặc thuộc tính mới.

```groovy
plugins {
    // Apply the application plugin to add support for building a CLI application
    id("application")

    // Apply the plugin which adds support for Java
    id("java")

    // Apply the plugin which adds support for Kotlin/JVM
    id("org.jetbrains.kotlin.jvm")
}

```

Ở đây, `id` là tên hoặc mã định danh duy nhất trên toàn cầu cho các plugin. Các plugin Core Gradle đặc biệt ở chỗ chúng cung cấp các tên ngắn, chẳng hạn như `"java"` hoặc `"application"`.

> [!NOTE]
> Gradle không giới hạn số lượng plugin tối đa được sử dụng trong một dự án.

#### Kho lưu trữ và phần phụ thuộc

Thông thường, bạn không cần phải viết chương trình của mình từ đầu – bạn sử dụng các đoạn mã đã được viết sẵn của bạn hoặc của nhà phát triển khác. Đây là nơi hệ thống phụ thuộc có ích.

Phần kho lưu trữ khai báo các vị trí mà từ đó các phần phụ thuộc sẽ được tải xuống và thêm vào dự án.

```groovy
repositories {
    jcenter()
}
```

Ngoài ra, bạn chỉ cần tải xuống các lọ bạn cần và đặt chúng vào một số thư mục trên máy tính, thường là trong thư mục libs của dự án của bạn.

```groovy
repositories {
     flatDir{
        dirs 'libs'
     }
}
```

Có rất nhiều kho lưu trữ công cộng: `JCenter`, `Maven Central`, `Google` và các kho lưu trữ khác. Thông thường, mô tả về phần phụ thuộc sẽ cho biết kho lưu trữ nào chứa nó.

Phần `dependencies` được sử dụng để thêm các thư viện bên ngoài vào dự án. Gradle sẽ tự động tải chúng xuống từ kho lưu trữ và đưa chúng vào kho lưu trữ cùng với ứng dụng. Phần `dependencies` của bạn phải chứa ít nhất một thư viện thử nghiệm như `JUnit` hoặc thư viện nào khác, tùy thuộc vào lựa chọn của bạn về thời điểm khởi tạo dự án.

```groovy
dependencies {
    // Use JUnit test framework.
    testImplementation 'junit:junit:4.13'

    // This dependency is used by the application.
    implementation 'com.google.guava:guava:29.0-jre'
}
```

Trong thuật ngữ Gradle, tất cả các thư viện bên ngoài được gọi là phụ thuộc. 
Theo quy định, chúng được đóng gói trong các tệp JAR. 
Gradle có thể tự động tải chúng xuống và thêm chúng vào dự án. 
Nó tiết kiệm rất nhiều thời gian và giải quyết các xung đột có thể xảy ra giữa các phiên bản của thư viện.
**quản lý phụ thuộc là một trong những tính năng chính của Gradle. Bạn thậm chí không cần plugin cho nó.**
