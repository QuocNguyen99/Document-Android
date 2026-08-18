# Ý định

     `Intent` là một đối tượng nhắn tin mà bạn có thể sử dụng để yêu cầu một hành động từ một [thành phần ứng dụng](https://developer.android.com/guide/components/fundamentals#Components khác). Mặc dù ý định hỗ trợ giao tiếp giữa các thành phần theo nhiều cách, nhưng có ba trường hợp sử dụng cơ bản:

* **Bắt đầu một hoạt động**

* **Bắt đầu dịch vụ**

* **Phát sóng**

Các loại Intent
------------

    Có hai loại ý định chính:

    

* **Ý định rõ ràng** chỉ định ứng dụng nào sẽ đáp ứng ý định đó bằng cách cung cấp tên gói của ứng dụng mục tiêu hoặc tên lớp thành phần đủ điều kiện. Thông thường, bạn sẽ sử dụng ý định rõ ràng để khởi động một thành phần trong ứng dụng của riêng mình vì bạn biết tên lớp của hoạt động hoặc dịch vụ mà bạn muốn bắt đầu. Ví dụ: bạn có thể bắt đầu một hoạt động mới trong ứng dụng của mình để phản hồi hành động của người dùng hoặc bắt đầu dịch vụ để tải xuống tệp ở chế độ nền.

* **Ý định ngầm** không đặt tên cho một thành phần cụ thể mà thay vào đó khai báo một hành động chung cần thực hiện, cho phép thành phần từ ứng dụng khác xử lý hành động đó. Ví dụ: nếu bạn muốn hiển thị cho người dùng một vị trí trên bản đồ, bạn có thể sử dụng ý định ngầm định để yêu cầu một ứng dụng có khả năng khác hiển thị một vị trí được chỉ định trên bản đồ.

Xây dựng ý định
------------------

Đối tượng `Intent` mang thông tin mà hệ thống Android sử dụng để xác định thành phần nào sẽ bắt đầu (chẳng hạn như tên thành phần chính xác hoặc danh mục thành phần sẽ nhận ý định), cùng với thông tin mà thành phần người nhận sử dụng để thực hiện hành động đúng cách (chẳng hạn như hành động cần thực hiện và dữ liệu để hành động).

Thông tin chính có trong `Intent` như sau:

- **Tên thành phần**

    Đây là tùy chọn nhưng đây là phần thông tin quan trọng tạo nên ý định _rõ ràng_, nghĩa là ý định đó chỉ được phân phối tới thành phần ứng dụng được xác định bởi tên thành phần. Nếu không có tên thành phần, ý định sẽ là _ẩn_ và hệ thống sẽ quyết định thành phần nào sẽ nhận được ý định đó dựa trên thông tin ý định khác (chẳng hạn như hành động, dữ liệu và danh mục—được mô tả bên dưới). Nếu cần khởi động một thành phần cụ thể trong ứng dụng của mình, bạn nên chỉ định tên thành phần đó.

- **Hoạt động**

    Một chuỗi chỉ định hành động chung cần thực hiện (chẳng hạn như _view_ hoặc _pick_).

Trong trường hợp mục đích phát sóng, đây là hành động đã diễn ra và đang được báo cáo. Hành động này quyết định phần lớn cách cấu trúc phần còn lại của ý định—đặc biệt là thông tin chứa trong dữ liệu và các phần bổ sung.

- **Dữ liệu**

    URI (đối tượng `[Uri]`) tham chiếu đến dữ liệu sẽ được xử lý và/hoặc loại MIME của dữ liệu đó. Loại dữ liệu được cung cấp thường được quyết định bởi hành động của mục đích. Ví dụ: nếu hành động là `[ACTION_EDIT]` thì dữ liệu phải chứa URI của tài liệu cần chỉnh sửa.

- **Loại**

    Một chuỗi chứa thông tin bổ sung về loại thành phần sẽ xử lý ý định. Bạn có thể đặt bất kỳ số lượng mô tả danh mục nào trong một ý định, nhưng hầu hết các ý định không yêu cầu danh mục

- **Tính năng bổ sung**

       Các cặp khóa-giá trị mang thông tin bổ sung cần thiết để thực hiện hành động được yêu cầu. Giống như một số hành động sử dụng các loại URI dữ liệu cụ thể, một số hành động cũng sử dụng các tính năng bổ sung cụ thể.

- **Cờ**

        Cờ được xác định trong lớp `[Intent]` có chức năng như siêu dữ liệu cho ý định. Cờ có thể hướng dẫn hệ thống Android cách khởi chạy một hoạt động (ví dụ: hoạt động đó thuộc về Tác vụ nào) và cách xử lý hoạt động đó sau khi hoạt động đó được khởi chạy (ví dụ: liệu hoạt động đó có thuộc danh sách các hoạt động gần đây hay không).

Nhận được một ý định ngầm

    Để quảng cáo những ý định ngầm mà ứng dụng của bạn có thể nhận được, hãy khai báo một hoặc nhiều bộ lọc ý định cho từng thành phần ứng dụng bằng phần tử [`<intent-filter>`](https://developer.android.com/guide/topics/manifest/intent-filter-element) trong tệp kê khai. Mỗi bộ lọc ý định chỉ định loại ý định mà nó chấp nhận dựa trên hành động, dữ liệu và danh mục của ý định. Hệ thống chỉ cung cấp ý định ngầm định cho thành phần ứng dụng của bạn nếu ý định đó có thể vượt qua một trong các bộ lọc ý định của bạn.

    Trong mỗi thành phần ứng dụng bao gồm phần tử `<intent-filter>`, hãy đặt giá trị rõ ràng cho [`android:exported`](https://developer.android.com/guide/topics/manifest/activity-element#exported). Thuộc tính này cho biết liệu các ứng dụng khác có thể truy cập thành phần ứng dụng hay không. Trong một số trường hợp, chẳng hạn như các hoạt động có bộ lọc ý định bao gồm danh mục [`LAUNCHER`](https://developer.android.com/reference/android/content/Intent#CATEGORY_LAUNCHER), việc đặt thuộc tính này thành `true` sẽ rất hữu ích. Nếu không, sẽ an toàn hơn nếu đặt thuộc tính này thành `false`.

Sử dụng pending intent
----------------------

Đối tượng `[PendingIntent]` là một trình bao bọc xung quanh một đối tượng `[Intent]`. Mục đích chính của `[PendingIntent]` là cấp quyền cho ứng dụng nước ngoài sử dụng `[Intent]` có trong đó như thể nó được thực thi từ process của chính ứng dụng của bạn.
