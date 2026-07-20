# Tài nguyên

Tài nguyên trong ứng dụng Android là một tệp (ví dụ: tệp bố cục) hoặc một số giá trị như một chuỗi đơn giản. Tài nguyên có thể là tệp bố cục, chuỗi, tệp âm thanh, tệp hình ảnh, v.v. Tất cả những tài nguyên đó được lưu trữ trong thư mục res.

Các thư mục con được tạo trong thư mục res theo loại tài nguyên:


| Loại tài nguyên | Mô tả |
|---------------|-----------------------------------------------------------------------------------------------------------------------|
| người làm phim hoạt hình | Các tệp XML xác định hoạt ảnh thuộc tính. Tạo hoạt ảnh bằng cách sửa đổi giá trị thuộc tính của đối tượng trong một khoảng thời gian nhất định. |
| màu sắc | Tệp XML xác định màu sắc |
| có thể vẽ được | Các tệp raster (.png, 9.png, .jpg, .gif) hoặc XML (hình dạng, bộ chọn, vectơ).                      |
| phông chữ | Tệp phông chữ (.ttf, .otf hoặc .ttc) hoặc tệp XML bao gồm phần tử `<font-family>` |
| mipmap | Tệp Drawable được sử dụng cho các biểu tượng ứng dụng có mật độ màn hình khác nhau |
| bố cục | Các tệp XML xác định user interface của ứng dụng của chúng tôi |
| thực đơn | Tệp XML xác định menu |
| thô | Các tệp tùy ý để lưu ở định dạng thô (ví dụ: âm thanh) |
| giá trị | Tệp XML chứa chuỗi, kiểu, kích thước |
| xml | Các tệp XML tùy ý có thể được phân tích cú pháp thủ công |

Một số thư mục con được hiển thị theo mặc định, trong khi một số thư mục khác có thể được thêm theo cách thủ công.

Có hai cách để truy cập tài nguyên: trong tệp Java hoặc Kotlin và trong tệp XML. Chúng ta hãy xem xét cả hai cách một cách chi tiết.

## Truy cập tài nguyên trong XML

Liên kết đến tài nguyên trong tệp XML có cú pháp sau: `@[package_name:]resource_type/resource_name`, trong đó:

- `package_name` đại diện cho tên của gói chứa tài nguyên. Nếu tài nguyên của bạn nằm trong cùng một gói thì package_name là tùy chọn.
- `resource_type` khớp với thư mục con tài nguyên như có thể vẽ hoặc bố cục hoặc loại tài nguyên giá trị như màu sắc hoặc chuỗi.
- `resource_name` là tên file không có phần mở rộng hoặc giá trị của thuộc tính android:name trong phần tử XML.

Ví dụ:

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/app_name" />
```

Chúng tôi cũng có thể sử dụng **tài nguyên Android tích hợp** bằng cách chỉ định gói android: `android:text="@android:string/ok"`.

## Truy cập tài nguyên bằng mã

Hệ thống xây dựng tạo tệp `R.java` chứa số nhận dạng cho tất cả tài nguyên ứng dụng.

Ngay cả một dự án trống cũng chứa `res/layout/activity_main.xml` và MainActivity làm cho nó hiển thị trong phương thức `onCreate()`:

```kotlin
setContentView(R.layout.activity_main)
```

> [!CAUTION]
> Hãy ghi nhớ: Lớp R chứa các mã định danh số nguyên, không chứa các giá trị. Điều này đặc biệt quan trọng khi xử lý màu sắc: chúng cũng là số nguyên.

## Trình kiểm định tài nguyên

Tài nguyên cần được sắp xếp trong các thư mục cụ thể với tên được xác định trước cho Android để biết nên chọn và hiển thị tên nào trong các tình huống khác nhau. 

Những tên thư mục đặc biệt đó được gọi là **bộ định tính** vì chúng đủ điều kiện để các tài nguyên được chọn và hiển thị thay vì các tài nguyên mặc định.

Theo dõi ví dụ của chúng tôi về bản địa hóa ứng dụng của bạn, đây là cây thư mục tài nguyên bao gồm các vòng loại hợp lệ cho các ngôn ngữ khác nhau:

```
res/
├── drawable/                  
│   └── ...
├── layout/                    
│   └── ...
├── values/            # Default resources for Values
│   ├── strings.xml    # Strings in English
│   └── ...
├── values-es/         # Values Resources for the Spanish language qualifier
│   ├── strings.xml    # Strings in Spanish
│   └── ...
├── values-fr/         # Values Resources for the French language qualifier
│   ├── strings.xml    # Strings in French
│   └── ...
└── ...
```

Và đây là ảnh chụp nhanh từ tệp tiếng Anh `values/strings.xml`:

```xml
<resources>
    <string name="app_name">My App</string>
    <string name="toast_message">Welcome to My App!</string>
    <string name="button1_text">Click Me</string>
    ------
</resources>
```

Tệp này là tệp mặc định, có nghĩa là các chuỗi sẽ được lấy từ nó trong mọi trường hợp ngoại trừ chỉ khi ngôn ngữ hệ thống của người dùng là tiếng Tây Ban Nha hoặc tiếng Pháp vì hai ngôn ngữ này có các tệp tài nguyên cụ thể được xác định cho chúng với các hạn định ngôn ngữ tương ứng là es và fr.

Và đây là ảnh chụp nhanh từ tệp tiếng Tây Ban Nha `values-es/strings.xml`:

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="toast_message">¡Bienvenido a Mi Aplicación!</string>
    <string name="button1_text">Haz Clic</string>
    ------
</resources>
```

Như bạn có thể thấy, tài nguyên chuỗi cho tất cả các tệp dịch phải có cùng tên nhưng có các giá trị khác nhau phù hợp với từng ngôn ngữ.

## Bộ định hướng hướng màn hình

Những vòng loại này cho phép bạn tạo các tài nguyên cụ thể được tùy chỉnh cho từng hướng (ngang và dọc).

```
res/
├── drawable/                  
│   └── ...
├── values/                    
│   └── ...
├── layout/                  # Default Layout resource files
│   ├── activity_main.xml
│   └── ...
├── layout-land/
│   ├── activity_main.xml    # Layout resource files for landscape orientation 
│   └── ...
├── layout-port/
│   ├── activity_main.xml    # Layout resource files for portrait orientation
│   └── ...
└── ...
```
## Vòng loại kích thước màn hình

Bộ định tính kích thước màn hình phân loại thiết bị Android dựa trên kích thước màn hình của chúng
Chúng được chia thành 4 danh mục để cung cấp bố cục được tối ưu hóa và các tài nguyên thay thế cho các kích thước màn hình khác nhau.

- **nhỏ**: kích thước tương tự như màn hình QVGA mật độ thấp (đơn vị 320x426 dp).
- **bình thường**: kích thước tương tự như màn hình HVGA mật độ trung bình (đơn vị 320x470 dp).
- **lớn**: kích thước tương tự như màn hình VGA mật độ trung bình (đơn vị 480x640 dp).
- **xlarge**: lớn hơn màn hình HVGA có mật độ trung bình (đơn vị 720x960 dp).




