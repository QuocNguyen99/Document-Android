# Android Manifest

Tệp kê khai mô tả thông tin cần thiết về ứng dụng của bạn trong tệp XML.


##`<application> tag`

Đây là thành phần chính quản lý cấu trúc ứng dụng của bạn.

Trong thẻ `<application>`, bạn sẽ tìm thấy các thuộc tính xác định các thuộc tính ứng dụng nhất định. 
Ví dụ: thuộc tính `android:icon` chỉ định biểu tượng của ứng dụng, trong khi thuộc tính `android:label` xác định nhãn văn bản mà người dùng nhìn thấy trong danh sách ứng dụng của họ:

```xml
<manifest ...>
   <application
       android:allowBackup="true"
       android:icon="@mipmap/ic_launcher"
       android:label="Android Manifest"
       android:roundIcon="@mipmap/ic_launcher_round"
       android:supportsRtl="true"
       android:theme="@style/AppTheme">
       ...
</manifest>
```

Có một số thuộc tính khác được chỉ định trong thẻ `<application>`.
Một số trong đó có thể tự giải thích được, trong khi một số khác bạn sẽ hiểu rõ hơn khi tiếp tục học cách phát triển Android.

```xml
<activity
    android:name=".MainActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```


trong Android, các hoạt động đóng vai trò là điểm truy cập vào ứng dụng của bạn. Mỗi hoạt động cung cấp một cửa sổ để ứng dụng vẽ UI và tương tác với người dùng. Trong thẻ `<activity>`, có thuộc tính bắt buộc: `android:name`.

Để ứng dụng sử dụng hoạt động này, hoạt động đó phải được chỉ định trong tệp kê khai của ứng dụng, như chúng ta đã thấy trước đó, bằng cách sử dụng thuộc tính `android:name` để trỏ đến lớp này.



##`<intent-filter> tag`

Khối tiếp theo trong tệp có thẻ `<intent-filter>` cho Android biết Activity nào sẽ được khởi động khi người dùng nhấn vào biểu tượng ứng dụng. 

```xml
<activity android:name=".MainActivity">
   <intent-filter>
      <action android:name="android.intent.action.MAIN" />

      <category android:name="android.intent.category.LAUNCHER" />
   </intent-filter>
</activity>
```

Các phần tử `<action>` và `<category>` cho biết biểu tượng hoạt động sẽ được hiển thị trong trình khởi chạy.

> [!CAUTION]
> Lưu ý rằng MainActivity được tham chiếu trong thẻ hoạt động của phần tử. Mọi Activity trong ứng dụng của bạn đều phải được khai báo trong tệp kê khai. Nếu không ứng dụng của bạn sẽ bị hỏng.

Các hoạt động khác trong tệp kê khai có thể sử dụng thẻ `<intent-filter>` cho các mục đích khác hoặc bỏ qua thẻ này hoàn toàn.


## Thành phần ứng dụng

Bạn sẽ phải chỉnh sửa tệp, thay đổi cấu trúc của nó và thêm các thành phần và thuộc tính mới trong quá trình phát triển ứng dụng. File `AndroidManifest.xml` cũng là nơi bạn khai báo như sau:

- **tên gói** cho ứng dụng sẽ xác định duy nhất nó.
- Các thành phần của ứng dụng, bao gồm **hoạt động**, **dịch vụ**, **phát sóng** **người nhận** và **nhà cung cấp nội dung**. Dựa trên những khai báo này, hệ thống Android có thể xác định những thành phần nào được đưa vào ứng dụng và chúng được khởi chạy trong những điều kiện nào.

- **quyền** mà ứng dụng của bạn cần. Các quyền bao gồm khả năng ứng dụng của bạn truy cập vào dữ liệu nhạy cảm của người dùng như danh bạ và SMS hoặc một số tính năng hệ thống nhất định như phần cứng và truy cập Internet. Bạn có thể sử dụng các quyền hệ thống do Android xác định hoặc xác định các quyền tùy chỉnh của mình.

```xml
<manifest ... >
    <uses-permission android:name="android.permission.INTERNET"/>
    <application ...
</manifest>
```

- Cuối cùng, **tính năng phần cứng và phần mềm** mà ứng dụng yêu cầu. Tùy thuộc vào điều này, Play Store xác định ứng dụng nào có thể được cài đặt trên một thiết bị cụ thể. Phần tử `<uses-feature>` khai báo chức năng cụ thể cần thiết để ứng dụng hoạt động. Lưu ý: ứng dụng của bạn sẽ không được cài đặt trên các thiết bị không có chức năng cần thiết.

Ví dụ: ứng dụng có thể yêu cầu máy ảnh tự động lấy nét. **Nếu thiết bị không có camera tự động lấy nét tích hợp, ứng dụng sẽ không được cài đặt**. Bạn có thể khai báo camera tự động lấy nét theo yêu cầu bằng thẻ kê khai sau:

```xml
<manifest ... >
    <uses-feature android:name="android.hardware.camera.autofocus"
                  android:required="true"/>
    <application ...
</manifest>
```