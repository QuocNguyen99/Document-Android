# Android Content Provider

## Tổng quan

**Content Provider** là một trong những khối xây dựng chính của kiến ​​trúc ứng dụng Android. Nó quản lý quyền truy cập vào một tập dữ liệu có cấu trúc và đóng gói dữ liệu, cung cấp các cơ chế để xác định bảo mật dữ liệu.

Nhà cung cấp nội dung chủ yếu được sử dụng để:
- Chia sẻ dữ liệu giữa các ứng dụng khác nhau.
- Truy cập và quản lý dữ liệu riêng tư của ứng dụng bằng giao diện chuẩn.

## Trường hợp sử dụng

- Chia sẻ thông tin liên hệ, tệp phương tiện hoặc sự kiện lịch trên các ứng dụng.
- Đọc/ghi dữ liệu trong cơ sở dữ liệu, tệp SQLite hoặc bộ lưu trữ liên tục khác.

## Thành phần chính

### 1. Lớp `ContentProvider`

Đây là lớp trừu tượng phải được triển khai để tạo content provider. Các phương pháp chính bao gồm:
- `onCreate()`: Khởi tạo nhà cung cấp.
- `query()`: Truy xuất dữ liệu.
- `insert()`: Thêm dữ liệu mới.
- `update()`: Sửa đổi dữ liệu hiện có.
- `delete()`: Xóa dữ liệu.
- `getType()`: Trả về kiểu MIME cho dữ liệu.

### 2. `ContentResolver`

Được sử dụng bởi các ứng dụng khách để truy cập dữ liệu từ content provider. Nó hoạt động như một cầu nối giữa nhà cung cấp và ứng dụng tiêu dùng.

### 3. `Uri`

Mã định danh tài nguyên thống nhất được sử dụng để xác định dữ liệu được cung cấp. Định dạng URI phổ biến:


`content://<authority>/<path>/<id>`


## Tạo Content Provider

### 1. Mở rộng `ContentProvider`

```java
public class MyProvider extends ContentProvider {
    @Override
    public boolean onCreate() {
        // Initialization logic
        return true;
    }

    @Override
    public Cursor query(...) {
        // Return data
    }

    @Override
    public Uri insert(...) {
        // Insert data
    }

    @Override
    public int delete(...) {
        // Delete data
    }

    @Override
    public int update(...) {
        // Update data
    }

    @Override
    public String getType(Uri uri) {
        // Return MIME type
    }
}
```
### 2. Khai báo bằng `AndroidManifest.xml`



```xml
<provider
    android:name=".MyProvider"
    android:authorities="com.example.myapp.provider"
    android:exported="true" />
```

## Truy cập dữ liệu qua `ContentResolver`

```kotlin
ContentResolver resolver = getContentResolver();
Cursor cursor = resolver.query(Uri.parse("content://com.example.myapp.provider/items"), null, null, null, null);
```

## Bảo mật và quyền
- Sử dụng quyền (`android:permission`, `android:readPermission`, `android:writePermission`) để kiểm soát quyền truy cập.

- Đặt `android:exported` thành `false` để đặt nhà cung cấp ở chế độ riêng tư.


## Các loại MIME
Nên sử dụng các loại MIME tùy chỉnh để mô tả dữ liệu:

- Vật phẩm duy nhất: `vnd.android.cursor.item/vnd.com.example.item`
- Nhiều mặt hàng: `vnd.android.cursor.dir/vnd.com.example.items`

## Các phương pháp hay nhất
- Sử dụng `CursorLoader` hoặc `LiveData` để truy cập dữ liệu nhà cung cấp không đồng bộ.
- Tránh chặn các chủ đề UI bằng các truy vấn trực tiếp.
- Xử lý `Cursor` lifecycle đúng cách (đóng lại khi hoàn tất).





















