# Observer Design Pattern

## Định nghĩa

* Observer Pattern là một mẫu thiết kế thuộc nhóm Behavioral Pattern
* Định nghĩa mối phụ thuộc một - nhiều giữa các đối tượng để khi mà một đối tượng có sự thay đổi trạng thái, tất cả các thành phần phụ thuộc của nó sẽ được thông báo và cập nhật một cách tự động.
* Một đối tượng có thể thông báo đến một số lượng không giới hạn các đối tượng khác
* Chúng giống như việc khi ta đăng ký hay nhấn chuông thông báo 1 kênh Youtube, thì khi kênh đó có video mới (thay đổi trạng thái), chúng sẽ gửi thông báo (một cách tự động) đến chúng ta.

## Kiến trúc

Các thành phần trong mô hình:

* **Publisher (subject)** là lớp cần lắng nghe. Khi có sự kiện, Publisher sẽ thông báo cho **Subscriber (observer)**
* Khi một sự kiện mới xảy ra, publisher xem qua danh sách đăng ký và gọi phương thức thông báo được khai báo trong subsrciber interface trên từng subscriber object.
* **Subscriber** là interface để Publisher báo cáo mỗi khi có sự kiện.
* Trong hầu hết các trường hợp, nó bao gồm một update method duy nhất.
* **ConcreteSubscriber (SubscriberA,B...)** cài đặt cụ thể hành động lớp cần làm khi nhận sự kiện của Publisher.
* Thông thường, subscriber cần một số thông tin theo ngữ cảnh để xử lý bản cập nhật một cách chính xác. Vì lý do này, publisher thường chuyển một số dữ liệu ngữ cảnh làm đối số của phương thức thông báo. Publisher có thể chuyển chính nó làm đối số, cho phép subscriber tìm nạp trực tiếp bất kỳ dữ liệu bắt buộc nào
* **Client** là người sử dụng Observer. Danh sách subscriber được biên dịch động: các đối tượng có thể bắt đầu hoặc dừng nghe thông báo trong thời gian chạy, tùy thuộc vào hành vi mong muốn của ứng dụng. Trong cách triển khai này, lớp Editor không tự duy trì danh sách subscription. Nó ủy thác công việc này cho đối tượng trợ giúp đặc biệt dành riêng cho việc đó. Việc thêm Subscriber mới vào chương trình không yêu cầu thay đổi đối với các class Publisher hiện có, miễn là chúng hoạt động với tất cả subscriber thông qua cùng một giao diện.

## Ưu & nhược điểm

#### Ưu điểm

* Đảm bảo nguyên tắc Open/Closed Principle (OCP): Cho phép thay đổi Subject và Observer một cách độc lập. Chúng ta có thể tái sử dụng các Subject mà không cần tái sử dụng các Observer và ngược lại. Nó cho phép thêm Observer mà không sửa đổi Subject hoặc Observer khác.
* Thiết lập mối quan hệ giữa các objects trong thời gian chạy.
* Sự thay đổi trạng thái ở 1 đối tượng có thể được thông báo đến các đối tượng khác mà không phải giữ chúng liên kết quá chặt chẽ.
* Không giới hạn số lượng Observer

#### Nhược điểm

* Unexpected update: Bởi vì các Observer không biết về sự hiện diện của nhau, nó có thể gây tốn nhiều chi phí của việc thay đổi Subject.
* Subscriber được thông báo theo thứ tự ngẫu nhiên.

## Trường hợp sử dụng

Sử dụng Observer Patern khi chúng ta muốn:

* Sự thay đổi trạng thái ở 1 đối tượng cần được thông báo đến các đối tượng khác mà không phải giữ chúng liên kết quá chặt chẽ.
* Cần mở rộng dự án với ít sự thay đổi nhất.
* Khi abstraction có 2 khía cạnh, cái này phụ thuộc cái kia. Đóng gói các khía cạnh này trong các đối tượng khác nhau cho phép bạn thay đổi và tái sử dụng chúng độc lập.
* Khi thay đổi một đối tượng yêu cầu việc thay đổi đến các đối tượng khác, và bạn không biết số lượng đối tượng cần thay đổi.
* Khi một đối tượng thông báo các đối tượng khác mà không cần biết đối tượng đó là gì hay nói cách khác là tránh tightly coupled.
