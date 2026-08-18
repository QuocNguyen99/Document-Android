#GargabeCollector

Garbage Collector (GC) được gọi khi hệ thống xác định bộ nhớ cần được giải phóng.

## Những điểm chính

- **Collection định kỳ**: Cả Android Runtime (ART) và máy ảo Dalvik đều thực hiện dọn rác collection theo định kỳ.
- **Thế hệ Heap**: Vùng heap của Android được chia thành các "thế hệ", mỗi thế hệ có giới hạn bộ nhớ riêng cho các đối tượng.
- **Sự kiện kích hoạt**: Khi quá trình tạo vùng heap bắt đầu đầy, hệ thống sẽ kích hoạt sự kiện collection rác để giải phóng bộ nhớ.
- **Không điều khiển thủ công**: Nhà phát triển không thể trực tiếp kiểm soát khi xảy ra lỗi collection. Hệ thống sử dụng tiêu chí riêng của mình để quyết định thời điểm thu thập, tạm dừng thực thi process để thực hiện việc đó.
- **Collection Time**: Thời lượng của rác collection phụ thuộc vào quá trình tạo được thu thập và số lượng đối tượng hoạt động trong đó.
- **Tác động xáo trộn bộ nhớ**: Mã của bạn có thể tăng tần suất hoặc thời lượng của các sự kiện GC. Ví dụ: việc phân bổ nhiều đối tượng tạm thời trong một vòng lặp hoặc trong phương thức `onDraw()` của chế độ xem có thể kích hoạt các collection thường xuyên. "Tốc độ phân bổ đối tượng tạm thời" cao (tốc độ phân bổ đối tượng tạm thời) dẫn đến nhiều sự kiện GC hơn.

## Các phương pháp hay nhất và chiến lược tối ưu hóa

Garbage Collector (GC) trong Dalvik VM được hệ thống gọi định kỳ để giải phóng bộ nhớ. 
Vùng nhớ Android được chia thành các thế hệ và bất cứ khi nào một thế hệ lấp đầy, hệ thống sẽ cố gắng lấy lại bộ nhớ thông qua sự kiện GC. 
Nhà phát triển không thể trực tiếp kiểm soát thời điểm GC chạy; thay vào đó, hệ thống sử dụng các tiêu chí riêng của nó.

Mặc dù các sự kiện GC riêng lẻ thường ít ảnh hưởng đến hiệu suất, nhưng các sự kiện GC diễn ra thường xuyên trong thời gian ngắn có thể tiêu hao pin nhanh chóng và tăng nhẹ thời gian thiết lập khung hình vì GC tương tác với các thread ứng dụng.
Càng dành nhiều thời gian cho GC thì pin càng hết nhanh. 
Điều này thậm chí có thể đẩy quá trình thực thi mã của bạn vượt quá ngưỡng 16 mili giây được đề xuất để hiển thị khung hình mượt mà.

Để tối ưu hóa cho GC, hãy tập trung vào việc giảm việc phân bổ bộ nhớ không cần thiết và chủ động giải phóng tài nguyên. Dưới đây là các chiến lược chính:

### 1. Tránh tình trạng xáo trộn bộ nhớ

- **Tiêu hao bộ nhớ** đề cập đến số lượng đối tượng tạm thời được phân bổ trong một thời gian nhất định. Tỷ lệ hao hụt bộ nhớ cao thường gây ra các sự kiện GC thường xuyên.
- Ví dụ: phân bổ nhiều đối tượng tạm thời trong vòng lặp `for` hoặc tạo các đối tượng `Paint` hoặc `Bitmap` mới bên trong phương thức `onDraw()` của chế độ xem có thể nhanh chóng lấp đầy thế hệ trẻ, buộc GC phải chạy.
- Giảm phân bổ đối tượng trong các khu vực quan trọng về hiệu suất. Di chuyển phân bổ ra khỏi vòng lặp bên trong hoặc sử dụng mẫu phân bổ dựa trên nhà máy.
- Sử dụng **Trình phân tích bộ nhớ** trong Android Studio để xác định vị trí các điểm phát sóng có dung lượng bộ nhớ cao.


## 2. Sử dụng nhóm đối tượng một cách cẩn thận

- Với **nhóm đối tượng**, thay vì loại bỏ một đối tượng, bạn trả lại đối tượng đó vào nhóm để sử dụng lại, giảm nhu cầu phân bổ mới và GC.
- Đánh giá hiệu suất một cách cẩn thận: nhóm đối tượng có thể tạo ra chi phí synchronization và việc giữ lại quá nhiều đối tượng trong nhóm thực sự có thể làm tăng khối lượng công việc GC.
- Chỉ sử dụng nhóm đối tượng khi việc lập hồ sơ cho thấy lợi ích rõ ràng.

## 3. Giải phóng bộ nhớ để phản hồi các sự kiện hệ thống

- Android có thể lấy lại bộ nhớ từ ứng dụng của bạn hoặc tiêu diệt nó để giải phóng bộ nhớ cho các tác vụ quan trọng.
- Triển khai interface `ComponentCallbacks2` trong các lớp `Activity` của bạn và xử lý `onTrimMemory()` callback. Điều này thông báo cho ứng dụng của bạn về lifecycle hoặc các sự kiện bộ nhớ, tạo cơ hội tự nguyện giảm mức sử dụng bộ nhớ.
- Giải phóng bộ nhớ ở đây có thể làm giảm khả năng ứng dụng của bạn bị "kẻ sát nhân bộ nhớ thấp" (LMK) giết chết. Các cấp độ `onTrimMemory()` khác nhau (ví dụ: `TRIM_MEMORY_UI_HIDDEN`, `TRIM_MEMORY_BACKGROUND`) cho phép bạn giải phóng bộ nhớ gắn với UI hoặc xử lý nền.

## 4. Sử dụng cấu trúc mã tiết kiệm bộ nhớ

- **Hạn chế sử dụng dịch vụ:** Tránh các dịch vụ chạy lâu, không cần thiết. Các quy trình dịch vụ rất tốn kém vì RAM của chúng không có sẵn cho các quy trình khác. Ưu tiên `WorkManager` cho các tác vụ nền.
- **Sử dụng bộ chứa dữ liệu được tối ưu hóa:** Android cung cấp bộ chứa hiệu quả về bộ nhớ như `SparseArray`, `SparseBooleanArray` và `LongSparseArray`. Những điều này tránh việc tự động đóng hộp các khóa/giá trị, làm giảm việc tạo đối tượng. Sử dụng mảng thô nếu có thể để có cấu trúc nhẹ nhất.
- **Hãy thận trọng với phần trừu tượng:** Mặc dù phần trừu tượng nâng cao tính linh hoạt và khả năng bảo trì nhưng chúng thường yêu cầu nhiều mã hơn, tăng bộ nhớ và thời gian để ánh xạ mã vào bộ nhớ. Tránh chúng nếu lợi ích là tối thiểu.
- **Sử dụng protobuf lite cho serialization:** Khi sử dụng Protocol Buffers, luôn sử dụng "lite protobufs" ở phía client. Các protobuf thông thường tạo mã dài dòng, tăng kích thước RAM và APK, đồng thời có thể làm chậm quá trình thực thi.

## 5. Xóa các tài nguyên và thư viện ngốn bộ nhớ

- **Giảm kích thước APK:** Kích thước tổng thể của ứng dụng, bao gồm bitmap, tài nguyên, khung hoạt ảnh và thư viện của bên thứ ba, ảnh hưởng đến mức tiêu thụ bộ nhớ. Sử dụng các công cụ như R8 để thu nhỏ tài nguyên và dependency.
- **Sử dụng Hilt hoặc Dagger 2 cho dependency injection:** Các framework này tránh phản chiếu runtime, giảm mức sử dụng bộ nhớ không cần thiết, đặc biệt là trong quá trình khởi động ứng dụng.
- **Hãy cẩn thận với thư viện của bên thứ ba:** Thư viện bên ngoài có thể không được tối ưu hóa cho thiết bị di động, có thể không hiệu quả hoặc thậm chí xung đột (ví dụ: triển khai nhiều protobuf). Tránh bao gồm các thư viện lớn cho các tính năng nhỏ và luôn phân tích kích thước thư viện cũng như dung lượng RAM trước khi sử dụng.

## 6. Tránh rò rỉ bộ nhớ

- Mặc dù ART và Dalvik thực hiện GC định kỳ, bạn vẫn phải tránh rò rỉ bộ nhớ, thường xảy ra do giữ tham chiếu trong các biến thành viên tĩnh. Giải phóng mọi đối tượng được tham chiếu tại các callback lifecycle thích hợp.

## Tóm tắt và tương tự

Để tối ưu hóa rác collection, bạn không thể gọi nó một cách rõ ràng—điều quan trọng là quản lý bộ nhớ hiệu quả. Hãy coi Garbage Collector như một công cụ dọn dẹp nhà cửa tự động: bạn không thể quyết định khi nào họ đến, nhưng hãy giữ cho ngôi nhà của bạn gọn gàng, không tích trữ những món đồ không sử dụng (các đồ vật không được tham chiếu) và tránh sự bừa bộn liên tục (tạo đối tượng tạm thời) có nghĩa là người dọn dẹp làm việc ít hơn, ghé thăm ít thường xuyên hơn và có công việc dễ dàng hơn. Điều này giúp cho "ngôi nhà" (ứng dụng) của bạn luôn sạch sẽ, hiệu quả và vận hành trơn tru.

## thẩm quyền giải quyết

- https://developer.android.com/topic/performance/memory-overview
- https://developer.android.com/topic/performance/memory-management
- https://developer.android.com/topic/performance/memory