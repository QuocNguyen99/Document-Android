#HashTable
HashTable là một lớp cung cấp sự phát triển của Bản đồ giao diện trong Java. Nó sử dụng cơ chế băm (băm) để lưu trữ các cặp khóa-giá trị và cho phép truy cập nhanh chóng vào cơ sở giá trị dựa trên khóa. HashTable có tính năng đồng bộ (được đồng bộ hóa), nghĩa là nó an toàn khi sử dụng trong môi trường đa luồng, nhưng hiệu suất có thể bị ảnh hưởng trong một số vấn đề

Bất kỳ đối tượng nào cũng không có giá trị rỗng cũng có thể được sử dụng làm khóa hoặc giá trị. Để lưu trữ và truy xuất các đối tượng thành công từ một bảng băm, các đối tượng được sử dụng làm khóa phải phát triển phương thức hashCode và phương thức bằng cách sử dụng.

Tuy nhiên, lớp Hashtable đã bị lỗi và việc sử dụng nó thường xuyên không được khuyến khích. Điều này là do nó được thiết kế trước khi giới thiệu Collection framework và không triển khai, điều này tạo ra khó khăn khi sử dụng cùng với các phần khác của framework. Ngoài ra, lớp Hashtable đã được đồng bộ hóa, điều này có thể dẫn đến hiệu suất chậm hơn so với việc triển khai giao diện Map khác.


##Hash function

Sử dụng hàm băm, chúng tôi sẽ tính toán chỉ số của vị trí có giá trị được lưu trữ. Giá trị được tính toán bằng hàm băm của một khóa được gọi là giá trị băm, cho biết chỉ mục của vị trí mà giá trị được xạ xạ tới.

```
	h(k) = k % m
```
*h: hàm băm
* k: key của giá trị băm cần xác định
*m: kích thước của hash table

## Ứng dụng của bảng băm
* Sử dụng để cài đặt chỉ mục đánh dấu trong cơ sở dữ liệu.
* Sử dụng để cài đặt các liên kết mảng.
* Sử dụng để cài đặt Set dữ liệu cấu hình kiểu.

## Độ phức tạp

1. Thêm phần tử (Insertion): Độ phức tạp O(1) trong trường hợp tốt nhất và trung bình. Tuy nhiên, trong trường hợp xảy ra va chạm (va chạm), phức tạp có thể là O(n), với n là số phần tử có cùng hàm băm (băm).

2. Tìm kiếm phần tử (Tra cứu): Độ phức tạp O(1) trong trường hợp tốt nhất và trung bình. Tuy nhiên, trong trường hợp xảy ra va chạm, phức tạp có thể là O(n), với n số lượng tử tử có cùng vị trí băm.


3. Xóa phần tử (Deletion): Độ phức tạp O(1) trong trường hợp tốt nhất và trung bình. Tuy nhiên, trong trường hợp xảy ra va chạm, phức tạp có thể là O(n), với n số lượng tử tử có cùng vị trí băm.

### ví dụ về lỗi xung đột khi ghi vào HashTable:
vấn đề ####
Giả sử chúng ta có Hash Table với kích thước là 5 (5 vị trí băm) và chúng ta muốn lưu trữ hai phần tử có khóa là "apple" và "banana".

Chúng tôi áp dụng hàm băm (hash function) cho cả hai khóa để xác định vị trí lưu trữ trong bảng băm. Ví dụ, hàm băm có thể trả về 2 cho cả "apple" và "banana".

Khi chèn "apple" vào vị trí băm 2, sẽ không có nguy hiểm xảy ra.

Khi chèn "banana" vào vị trí băm 2, xảy ra va chạm vì "banana" cũng được xạ xạ vào vị trí băm 2.

giải pháp ####
Khi xảy ra va chạm, Hash Table hoặc HashMap phải xử lý việc lưu trữ các phần tử có cùng vị trí băm một cách hiệu quả. Có một số phương pháp để giải quyết vấn đề vi phạm, bao gồm:

* Chuỗi riêng biệt (Kỹ thuật dây): Mỗi vị trí băm trong bảng băm được giữ một liên kết danh sách, trong đó các phần tử có hàm băm cùng vị trí được lưu trữ trong danh sách này.

* Địa chỉ mở: Các phần tử có hàm băm tương tự được lưu trữ trực tiếp trong bảng băm. Khi xảy ra va chạm, các phần tử sẽ được chèn vào các vị trí trống tiếp theo trong bảng.

Trong trường hợp này, chúng ta cần sử dụng phương pháp giải quyết va chạm, ví dụ như
Chuỗi riêng biệt, để lưu trữ cả hai phần tử "apple" và "banana" trong cùng một vị trí băm. Điều này có thể thực hiện bằng cách tạo một danh sách liên kết ở vị trí băm 2 và lưu trữ cả hai phần tử trong danh sách này.

## Thứ bậc của Hashtable
![](../../resources/HierarchyofHashtable.png)

# Từ điển

Từ điển là một đối tượng dữ liệu cấu trúc trong nhiều trình cài đặt ngôn ngữ. Nó cung cấp một bộ từ điển bao gồm các cặp khóa-giá trị. Key là duy nhất và không thay đổi, được sử dụng để xuất ra giá trị tương ứng. Từ điển không phải là một công cụ tên của dữ liệu cấu trúc trong một công cụ ngôn ngữ, mà chỉ là một khái niệm chung.

# Bản đồ

Bản đồ là một giao diện trong Java và một dữ liệu cấu trúc trong nhiều ngôn ngữ khác. Nó mô tả một tập hợp các cặp khóa-giá trị, trong đó mỗi khóa là duy nhất và không thay đổi. Map cung cấp các phương thức để thêm, xóa, xuất và xử lý các cặp khóa-giá trị. **HashMap và HashTable là hai lớp cụ thể trong giao diện Bản đồ triển khai Java.**

#HashMap

HashMap là một lớp cung cấp sự phát triển của Bản đồ giao diện trong Java. Nó cũng sử dụng cơ chế băm để lưu trữ các cặp khóa-giá trị, nhưng không có tính năng đồng bộ như HashTable. Do đó, HashMap có thể cung cấp hiệu suất tốt hơn trong các vấn đề không yêu cầu tính toán toàn bộ thời gian.


## Tóm tắt
HashTable và HashMap là hai cách phát triển cụ thể về cấu trúc dữ liệu Map trong Java.

Từ điển là một khái niệm chung để chỉ định một kho lưu trữ dữ liệu cấu trúc các khóa-giá trị cặp. Map là một giao diện định nghĩa các phương thức và đặc tính chung cho Map cấu hình dữ liệu.

Sự khác nhau của HashMap và HashTable là:

| HashMap | Bảng băm |
| ----------- | ------------|
| HashMap cho phép một khóa là null và nhiều giá trị null.      | Hashtable không được phép bất kỳ khóa hoặc giá trị null.       |
| HashMap không đồng bộ.   | Hashtable là đồng bộ.        |


