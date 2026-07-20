#Linked List
Danh sách được liên kết là một thuộc tính tuyến dữ liệu cấu trúc, trong đó các phần tử không được lưu trữ tại các vị trí tiếp giáp. Các phần tử trong liên kết danh sách được liên kết bằng con trỏ. Nói một cách đơn giản, một danh sách được liên kết bao gồm các nút trong đó mỗi nút chứa một trường dữ liệu và một tham chiếu (liên kết) đến nút tiếp theo trong danh sách.
Các thành phần và định nghĩa:

* Các phần tử trong linked list được gọi là các nút.
* Mỗi nút sẽ không có khóa và một con trỏ tới nút tiếp theo của nó, được gọi là next
* Thuộc tính tên là con trỏ đầu tới phần tử đầu tiên của linked list.
* Phần tử cuối cùng của linked list có tên là tail
* Singly linked list: Duyệt qua các phẩn tử chỉ có thể thực hiện theo chiều hướng về phía trước.
* Doublely linked list: Duyệt qua các phẩn tử có thể thực hiện cả tiến trình và lùi. Các nút sẽ bao gồm thêm một con trỏ được gọi là trước, con trỏ tới nút trước đó.
* Thông tư linked list: Là một linked list đặc biệt, khi mà con trỏ trước của con trỏ tới đuôi và con trỏ tiếp theo của con trỏ tới đầu.

# Các phép toán trên linked list
* Tìm kiếm: Tìm phần tử đầu tiên với khóa là k trong một linked list được chọn trước khi thực hiện đơn giản bằng một trình duyệt tuần tự và trả về con trỏ tới phần tử đó.
* Thêm: Để thêm một khóa vào một linked list có sẵn, chúng ta có thể thực hiện theo 3 cách: thêm vào danh sách đầu, thêm vào danh sách giữa hoặc thêm vào cuối danh sách.
* Xóa: Xóa một phần tử x khỏi linked list cho trước. Ta không thể xóa một nút chỉ với một bước. Việc xóa một nút có thể thực hiện theo 3 cách: xóa từ đầu danh sách, xóa từ giữa danh sách hoặc xóa từ danh sách cuối cùng.

##1 Linked List đơn lẻ
Đây là loại danh sách liên kết đơn giản nhất trong đó mỗi nút chứa một số dữ liệu và một con trỏ tới nút tiếp theo có cùng loại dữ liệu.


![](../../resources/Singly-Linked-List1.png)

##2 Gấp đôi Linked List
Danh sách trùng lặp hoặc danh sách liên kết hai chiều là một loại danh sách phức tạp liên kết hơn chứa một con trỏ tới nút tiếp theo cũng như nút trước đó theo thứ tự.

![](../../resources/Doubly-Linked-List.png)

##3 Thông tin Linked List
Vòng liên kết danh sách nằm trong nút cuối cùng chứa con trỏ tới nút đầu tiên của danh sách.

![](../../resources/Circular-Linked-List.png)

##4 Hình tròn kép Linked List

Danh sách liên kết vòng tròn đôi hoặc danh sách liên kết hai vòng tròn là một loại danh sách liên kết phức tạp hơn chứa một con trỏ tới nút tiếp theo cũng như nút trước đó trong chuỗi.

Sự khác biệt giữa danh sách kép liên kết kép và danh sách kép vòng cũng giống như sự khác biệt giữa danh sách liên kết đơn và danh sách liên kết vòng danh sách.

Vòng kép liên kết danh sách không chứa null trong trường trước của nút đầu tiên. Dưới đây là hình ảnh tương tự:

![](../../resources/Doubly-Circular-Linked-List.png)