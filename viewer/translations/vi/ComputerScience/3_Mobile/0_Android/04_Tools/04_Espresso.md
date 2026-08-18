#Espresso

**Espresso** là UI mã nguồn mở phổ biến đang thử nghiệm framework, được phát triển và duy trì bởi Google, được thiết kế dành riêng cho các nhà phát triển Android.

## Tại sao lại là Espresso?

- Espresso cung cấp lõi API dễ học, cũng có thể tùy chỉnh
- Espresso được tích hợp vào Android Studio, giúp việc tạo, chạy và gỡ lỗi các thử nghiệm UI từ trong môi trường phát triển trở nên dễ dàng hơn nữa
- Ngoài ra, còn có các tính năng như Ghi lại bài kiểm tra Espresso có thể được sử dụng để tạo bài kiểm tra dựa trên sự tương tác của người dùng với ứng dụng đang được thử nghiệm


## Đang thiết lập Espresso

Espresso phải được định cấu hình theo mặc định khi bạn tạo dự án Android Studio.
Để xác nhận, hãy kiểm tra sự hiện diện của các dependency này trong tệp `build.gradle` của ứng dụng của bạn:


```gradle
dependencies {
    ...
    androidTestImplementation 'androidx.test.ext:junit:1.2.1'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.6.'
}
```
Bạn có thể kiểm tra [phiên bản mới nhất của thư viện espresso-core](https://mvnrepository.com/artifact/androidx.test.espresso/espresso-core) và [thư viện tiện ích mở rộng Android phiên bản mới nhất dành cho JUnit](https://mvnrepository.com/artifact/androidx.test.ext/junit). Đây là lý do tại sao chúng ta cần những sự phụ thuộc đó:

- Dependency `androidx.test.espresso:espresso-core` cung cấp API cốt lõi để viết các bài kiểm tra UI bằng cách sử dụng Espresso trong các ứng dụng Android.

- Dependency `androidx.test.ext:junit` cung cấp các tiện ích mở rộng để sử dụng JUnit trong thử nghiệm ứng dụng Android. Điều này là bắt buộc vì Espresso dựa vào framework thử nghiệm JUnit để thực hiện các trường hợp thử nghiệm của nó.

Tiếp theo, hãy xác minh xem trình chạy thiết bị có được đặt trong cùng một tệp `build.gradle` hay không:

```gradle
android {
    ...
    defaultConfig {
        ...
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
}
```

Trình chạy thiết bị đo đạc là trình chạy thử nghiệm thực thi các thử nghiệm đo lường trên thiết bị hoặc trình mô phỏng Android. 
Nó chịu trách nhiệm chạy các trường hợp thử nghiệm và thu thập kết quả thử nghiệm.

Cuối cùng, bạn cần thiết lập (các) thiết bị thử nghiệm của mình để thử nghiệm UI. Bước đầu tiên là kích hoạt tùy chọn nhà phát triển trên thiết bị.

Khi tùy chọn nhà phát triển được bật, hãy tắt ba cài đặt sau:
- quy mô hoạt hình cửa sổ
- quy mô hoạt hình chuyển tiếp
- thang thời lượng hoạt hình.

Bước này là cần thiết để giảm độ bong tróc của thử nghiệm.

Tính không ổn định của thử nghiệm đề cập đến hành vi không thể đoán trước và không nhất quán của kết quả thử nghiệm do một số yếu tố bên ngoài.

























