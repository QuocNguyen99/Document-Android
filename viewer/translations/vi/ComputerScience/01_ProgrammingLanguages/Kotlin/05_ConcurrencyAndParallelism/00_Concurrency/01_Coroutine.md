#Coroutine

Coroutine là thư viện Kotlin được phát triển bởi JetBrains. Nó đa nền tảng và có sẵn cho tất cả các mục tiêu Kotlin chính: JVM, JS, Native và Android.

Thư viện cung cấp nhiều phương pháp xử lý các tác vụ đồng thời trong Kotlin. 

> [!NOTE]
> Trong Kotlin, một tác vụ đồng thời đề cập đến khả năng một coroutine tạm dừng quá trình thực thi của nó và cho phép các coroutine khác chạy,
> tạo ảo giác về nhiều tác vụ chạy cùng lúc trong một thread.

## `kotlinx.coroutines` làm thư viện


Lưu ý rằng coroutine không đi kèm với thư viện chuẩn Kotlin — chúng là một dependency.

Có một số lý do khiến coroutine bị tách ra. Dưới đây là hai lý do chính:

- Không phải mọi chương trình đều cần concurrency nội bộ. Nếu coroutine được tích hợp sẵn, tất cả các chương trình Kotlin sẽ chiếm nhiều dung lượng bộ nhớ hơn vì chúng chứa mã dư thừa.
- Một số nhà phát triển không muốn sử dụng bản triển khai chính thức của concurrency nội bộ. Khi coroutine là một mô-đun có thể cắm, bạn có thể dễ dàng cắm không phải mô-đun chính thức mà là mô-đun phù hợp nhất với tình huống cụ thể của bạn.

















