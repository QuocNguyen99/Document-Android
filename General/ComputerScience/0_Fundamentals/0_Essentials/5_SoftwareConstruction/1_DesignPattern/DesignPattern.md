# Design pettern

    Nói một cách đơn giản, design pattern là **các mẫu thiết kế có sẵn, dung để giải quyết một vấn đề**. Áp dụng mẫu thiết kế này sẽ làm code dễ bảo trì. Design pattern là **thiết kế dựa trên code**, nó nằm ở một cảnh giới cao hơn CODE,do đó ngôn ngữ nào cũng có thể áp dụng vào được.

* Design pattern là các giải pháp tổng thể đã được tối ưu hóa, được tái sử dụng cho các vấn đề phổ biến trong thiết kế phần mềm mà chúng ta thường gặp phải hàng ngày.

## Lợi ích của việc sử dụng Design Pattern

- Tăng tốc độ phát triển phần mềm

- Code tường minh, dễ dàng team work

- Tái sử dụng code

- Hạn chế lỗi tiềm ẩn, dễ dàng nâng cấp

## Phân loại Design Patterns


Hệ thống các mẫu design pattern được chia thành 3 nhóm, được phân loại theo mục đích sử dụng:

* Nhóm Creational
* Nhóm Structural
* Nhóm Behavioral

### 1. Creational Pattern (Nhóm khởi tạo)

Nhóm Creational Pattern gồm 5 mẫu:

* Singleton
* Factory Method
* Abstract Factory
* Builder
* Prototype

Các patterns loại này cung cấp giải pháp để tạo ra các đối tượng và che giấu được logic của việc tạo ra nó thay vì tạo ra đối tượng theo cách trực tiếp (sử dụng từ khoá new). Điều này giúp chương trình trở nên mềm dẻo hơn trong việc quyết định đối tượng nào cần được tạo ra trong những tình huống khác nhau.

### 2. Structural Pattern (Nhóm cấu trúc)

Nhóm Structural Pattern gồm 7 mẫu:

* Adapter
* Bridge
* Composite
* Decorator
* Facade
* Flyweight
* Proxy

Những patterns loại này liên quan tới class và các thành phần của đối tượng. Nó dùng để thiết lập, định nghĩa quan hệ giữa các đối tượng. Hệ thống càng lớn thì mẫu này càng đóng vai trò quan trọng. 

### 3. Behavioral Pattern (Nhóm hành vi)

Nhóm Behavioral Pattern gồm 11 mẫu:

* Iterpreter
* Template Method
* Chain of Responsibility
* Command
* Iterator
* Mediator
* Memento
* Observer
* State
* Strategy
* Visitor

Nhóm này liên quan đến các quan hệ hành vi để xử lí các chức năng giữa các đối tượng trong hệ thống. 
