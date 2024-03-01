# App Manifest

![](../resources/android-app-manifest.avif)

Mọi dự án Android đều phải có tệp AndroidManifest.xml mô tả thông tin cần thiết về ứng dụng như tên gói,
điểm truy cập, thành phần, quyền và siêu dữ liệu.

## Package Name and Application ID

Mọi dự án Android đều phải có package attribute, đại diện cho ID ứng dụng duy nhất trên toàn cầu của ứng dụng của bạn trong tệp AndroidManifest.xml. 
Manifest file phải được đặt trong thư mục/src/main của bạn.

Package attribute là cách để định danh ứng dụng của bạn trên hệ thống Android (Thiết bị vật lý) và trong Google Play. Các công cụ xây dựng Android sử dụng thuộc tính gói cho các mục sau:

- Applying the package name as the namespace for your app resources.
- Resolving implicit class names that are declared in the manifest file. For example, with the above manifest, an activity declared as <activity android:name=".MainActivity"> is resolved to be io.getstream.chat.android.ui.MainActivity. So the classes also must be in the same package folder.

## The manifest file

Trước khi hệ thống Android có thể khởi động Component, hệ thống phải biết rằng component đó tồn tại bằng cách đọc tệp kê khai của ứng dụng, `AndroidManifest.xml`. Ứng dụng của bạn khai báo tất cả các component của nó trong tệp này, nằm ở thư mục gốc của thư mục dự án ứng dụng.

Tệp kê khai thực hiện một số việc ngoài việc khai báo các thành phần của ứng dụng, chẳng hạn như sau:

* Xác định bất kỳ quyền nào của người dùng mà ứng dụng yêu cầu, chẳng hạn như quyền truy cập internet hoặc quyền đọc danh bạ của người dùng.
* Khai báo mức API tối thiểu mà ứng dụng yêu cầu, dựa trên những API mà ứng dụng sử dụng.
* Khai báo các tính năng phần cứng và phần mềm được ứng dụng sử dụng hoặc yêu cầu, chẳng hạn như máy ảnh, dịch vụ Bluetooth hoặc màn hình cảm ứng đa điểm.
* Khai báo các thư viện API mà ứng dụng cần được liên kết với (ngoài các API Android framework), chẳng hạn như thư viện Google Maps.

You must declare all app components using the following elements:

* `<activity>` elements for activities
* `<service>` elements for services
* `<receiver>` elements for broadcast receivers
* `<provider>` elements for content providers

Nếu bạn phân lớp bất kỳ thành phần nào trong số này mà không khai báo nó trong tệp kê khai, hệ thống sẽ không thể khởi động nó.

### Intent filters

App activities, services, and broadcast receivers are activated by _Intents_ .. Intent là một message được xác định bởi một đối tượng Intent mô tả một hành động cần thực hiện, bao gồm dữ liệu sẽ được thực hiện, danh mục thành phần dự kiến ​​sẽ thực hiện hành động và các hướng dẫn khác.

Bạn có thể tùy chọn bao gồm các bộ lọc Intent khai báo các khả năng của hoạt động để nó có thể phản hồi các Intent từ các ứng dụng khác

Khi một ứng dụng đưa ra một Intent cho hệ thống, hệ thống sẽ định vị một Component có thể xử lý `Intent` đó dựa trên các khai báo _intent filter_ trong mỗi tệp app's manifest file. Hệ thống khởi chạy một phiên bản của thành phần phù hợp và chuyển đối tượng Intent cho thành phần đó. Nếu có nhiều ứng dụng có thể xử lý ý định, thì người dùng có thể chọn ứng dụng sẽ sử dụng.



### Permission

Các ứng dụng Android phải yêu cầu quyền truy cập dữ liệu nhạy cảm của người dùng, chẳng hạn như danh bạ và SMS hoặc một số tính năng hệ thống nhất định, chẳng hạn như máy ảnh và truy cập Internet. Mỗi quyền được xác định bởi một label duy nhất. Ví dụ: một ứng dụng cần gửi tin nhắn SMS phải có dòng sau trong tệp kê khai:

```xml
<manifest ... >
    <uses-permission android:name="android.permission.SEND_SMS"/>
    ...
</manifest>
```

Bắt đầu với Android 6.0 (API cấp 23), người dùng có thể phê duyệt hoặc từ chối một số quyền của ứng dụng khi chạy. Tuy nhiên, bất kể ứng dụng của bạn hỗ trợ phiên bản Android nào, bạn phải khai báo tất cả các yêu cầu quyền với phần tử <uses-permission> trong tệp kê khai. Nếu quyền được cấp, ứng dụng có thể sử dụng các tính năng được bảo vệ. Nếu không, những nỗ lực của nó để truy cập các tính năng đó không thành công.

### Device compatibility

manifest file cũng là nơi bạn có thể khai báo loại tính năng phần cứng hoặc phần mềm nào mà ứng dụng của bạn yêu cầu và nói rộng ra là loại thiết bị mà ứng dụng của bạn tương thích. Cửa hàng Google Play không cho phép người dùng cài đặt ứng dụng của bạn trên các thiết bị không cung cấp các tính năng hoặc phiên bản hệ thống mà ứng dụng của bạn yêu cầu. Có một số thẻ kê khai xác định ứng dụng của bạn tương thích với thiết bị nào. Sau đây là một số phổ biến nhất.

#### <uses-feature>

Phần tử <uses-feature> cho phép bạn khai báo các tính năng phần cứng và phần mềm mà ứng dụng của bạn cần. Ví dụ: nếu ứng dụng của bạn không thể đạt được chức năng cơ bản trên thiết bị không có cảm biến la bàn, thì bạn có thể khai báo cảm biến la bàn theo yêu cầu bằng thẻ tệp kê khai sau:

```xml
<manifest ... >
    <uses-feature android:name="android.hardware.sensor.compass"
                  android:required="true" />
    ...
</manifest>
```

#### <uses-sdk>

Mỗi phiên bản nền tảng kế tiếp thường bổ sung các API mới không có trong phiên bản trước. Để cho biết phiên bản tối thiểu mà ứng dụng của bạn tương thích với, tệp kê khai của bạn phải bao gồm thẻ <uses-sdk> và thuộc tính minSdkVersion của nó.

Tuy nhiên, hãy lưu ý rằng các thuộc tính trong phần tử <uses-sdk> bị ghi đè bởi các thuộc tính tương ứng trong tệp build.gradle. Vì vậy, nếu bạn đang sử dụng Android Studio, hãy chỉ định các giá trị minSdkVersion và targetSdkVersion ở đó:



```groovy
android {
    defaultConfig {
        applicationId 'com.example.myapp'

        // Defines the minimum API level required to run the app.
        minSdkVersion 21

        // Specifies the API level used to test the app.
        targetSdkVersion 33
        ...
    }
}
```

## 
Để giữ data không bị thay đổi khi xoay màng hình (k dùng viewmodel và save instance sate)

```groovy
    <activity
        android:name="com.example.ListActivity"
        android:label="@string/app_name"
        android:configChanges="keyboardHidden|orientation">
 ```
if API level > 23 using this :

```groovy
    <activity
        android:name="com.example.Activity"
        android:label="@string/app_name"
        android:configChanges="keyboardHidden|orientation|screenSize">
```
