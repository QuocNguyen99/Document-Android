## Max min target sdk là gì

* compileSdkVersion: chỉ ra version Android SDK mà gradle dùng để compile code.
* targetSdkVersion: xác định cho hệ thống biết version Android SDK mà ứng dụng đã được thiết kế và kiểm thử.
* minSdkVersion: xác định version Android SDK thấp nhất mà ứng dụng sẽ hỗ trợ.

## Quá trình build APK

1. The compilers convert src code into DEX(Dakvik Executable) files.
2. The packager combines DEX files and compiled src into an APK.
3. The packager signs APK using debug or release keystore.
4. Before generating final APK, the packager uses zipalign tool to optimize app to use less memory when running on a device.

## ApplicationID có mục đích gì

Mỗi ứng dụng Android có 1 applicationID duy nhất, khi mới khởi tạo ứng dụng thì nó giống như Package Name, tuy nhiên cả 2 lại độc lập với nhau, việc thay đổi Package Name ko làm ảnh hưởng đến applicationID và ngược lại. ID duy nhất này định danh ứng dụng của ta trên thiết bị và trên Google Play Store.
