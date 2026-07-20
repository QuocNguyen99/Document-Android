#Cấu trúc dự án Jetpack Compose

Dự án Android View và Dự án Jetpack Compose rất khác nhau về cấu trúc dự án và
phần mã cụ thể. Vì vậy, hãy kiểm tra một số điều đó.

## Lớp MainActivity

Chúng ta hãy xem qua lớp `MainActivity` 

```kotlin 
class MainActivity : ComponentActivity() {
   override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(savedInstanceState)
       setContent {
           HyperskillTheme {
               Text("Hello, Compose!")
           }
       }
   }
}
```
bạn có thể xem phương thức `setContent` kết hợp các hàm Composable đã cho vào hoạt động hiện tại để xây dựng UI.

- `setContent` là hàm mở rộng bậc cao hơn của lớp `ComponentActivity`, có thể lấy hàm Composable làm đối số của tham số `content`.
**Các hàm Composable này sẽ trở thành phần tử gốc trong hệ thống phân cấp của các phần tử UI.**

## Tệp chủ đề
có gói `ui`, bên trong gói này bạn có thể tìm thấy một gói khác - `theme`. 
Gói này chứa bốn tệp: `Color.kt`, `Shape.kt` và `Type.kt` chứa các giá trị được sử dụng bởi chủ đề ứng dụng của bạn được xác định trong tệp cuối cùng, `Theme.kt`

## Tài liệu tham khảo

- https://hyperskill.org/learn/step/25491

































