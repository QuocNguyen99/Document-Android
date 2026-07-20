#Cấu trúc dữ liệu

Thuật toán không phải là thứ duy nhất bạn cần: bên cạnh vấn đề xử lý, còn có vấn đề lưu trữ dữ liệu,
bao gồm cả dung lượng mà chương trình của bạn chiếm. Ở đây cấu trúc dữ liệu có ích.


thuật ngữ **data structure** đề cập đến collection của các phần tử chứa dữ liệu, cũng như mối quan hệ giữa chúng và các hoạt động dữ liệu.

Theo quy định, cấu trúc dữ liệu có hai loại hoạt động: 

- **nội bộ**, hỗ trợ tổ chức dữ liệu
- **bên ngoài**, có sẵn cho người dùng để lưu trữ, truy xuất hoặc sửa đổi dữ liệu.

## Vai trò của cấu trúc dữ liệu

Các cấu trúc dữ liệu khác nhau có độ phức tạp về thời gian khác nhau để thực hiện các hoạt động bên ngoài giống nhau trong một tập hợp dữ liệu. Đây là lý do tại sao cần phải xem xét tất cả các cấu trúc có thể có và chọn ra cấu trúc hiệu quả nhất trong số đó. Hãy minh họa những gì chúng tôi đã nói ở trên bằng một ví dụ.

Thuật toán Dijkstra. Nó có hai cách triển khai chính: sử dụng một mảng hoặc một đống làm data structure. Trong trường hợp đầu tiên, độ phức tạp về thời gian của thuật toán Dijkstra sẽ là 
O(n^2 + m). trong khi đó nếu chúng tôi sử dụng loại data structure thứ hai, thuật toán của chúng tôi sẽ hoạt động trên O((n+m)logn).

Vì vậy, việc sử dụng các cấu trúc dữ liệu khác nhau có thể dẫn đến độ phức tạp về thời gian khác nhau của cùng một thuật toán.

## Nguyên tắc chung


1. Cung cấp một cách có hệ thống để tổ chức và cấu trúc dữ liệu, đảm bảo lưu trữ và truy xuất hiệu quả.
2. Được thiết kế để tối ưu hóa các hoạt động như tìm kiếm, chèn, xóa, v.v., đảm bảo hiệu suất thuật toán hiệu quả.
3. Cung cấp khả năng mở rộng và tính linh hoạt, cho phép hệ thống xử lý các tập dữ liệu đang phát triển hoặc thay đổi mà không làm giảm hiệu suất.
4. tối ưu hóa việc sử dụng bộ nhớ và quản lý việc phân bổ và giải phóng bộ nhớ một cách hiệu quả.
5. thúc đẩy khả năng sử dụng lại mã bằng cách đóng gói dữ liệu và hoạt động vào các mô-đun có thể tái sử dụng, nâng cao năng suất và khả năng bảo trì khi phát triển phần mềm.

## Cấu trúc dữ liệu trừu tượng và cụ thể


