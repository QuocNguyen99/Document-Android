#XML

**XML (Ngôn ngữ đánh dấu eXtensible)** là định dạng dựa trên văn bản để lưu trữ và trao đổi dữ liệu có cấu trúc trên Internet. Ở định dạng này, dữ liệu được trình bày dưới dạng tài liệu có cấu trúc rõ ràng và linh hoạt. Tài liệu XML có thể được lưu trữ trên máy tính với phần mở rộng .xml thường được sử dụng để lưu giữ các tệp cấu hình của chương trình.


## Thẻ và phần tử

Mỗi tài liệu XML bao gồm các thẻ và thành phần.

- **tag** là một chuỗi có ý nghĩa được gán như một cuốn sách, một người hoặc một thứ gì đó tương tự. Điều thú vị là XML hoàn toàn không cung cấp thẻ nhưng nó mang lại cho các nhà phát triển cơ hội phát minh ra thẻ một cách độc lập.

- **phần tử** là khối xây dựng của cấu trúc XML: nó có thể chứa văn bản, thẻ, các phần tử và thuộc tính khác.

Ví dụ:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<book>
  <title>The Three-Body Problem</title>
  <author>Liu Cixin</author>
</book>
```


Dòng đầu tiên trong tài liệu XML được gọi là **prolog**:


```xml
<?xml version="1.0" encoding="UTF-8"?>
```

> [!NOTE]
> Nó chỉ định phiên bản của tiêu chuẩn XML (thường là 1.0) và xác định mã hóa (ở đây là UTF-8). Prolog là tùy chọn, nhưng nếu có, nó phải xuất hiện đầu tiên trong tài liệu. Lưu ý rằng prolog không có thẻ đóng!

## Thuộc tính

Các phần tử XML có thể sở hữu các thuộc tính cung cấp thông tin bổ sung về phần tử đó.

Giá trị của thuộc tính luôn được đặt trong dấu ngoặc kép hoặc dấu ngoặc đơn. Ví dụ: tên của một bức tranh có thể được viết như sau:

```xml
<picture name="The Black Square"/>
```

## Ưu và nhược điểm của XML
XML đã trở nên phổ biến nhờ những ưu điểm rõ ràng của nó:

- nó có thể được hiểu dễ dàng bởi máy móc cũng như con người;

- định dạng dựa trên tiêu chuẩn quốc tế;

- nó có cấu trúc được xác định rõ ràng tạo điều kiện thuận lợi cho việc tìm kiếm và trích xuất thông tin;

- các ngôn ngữ lập trình hiện đại có thư viện để xử lý tài liệu XML một cách tự động.

Đồng thời, XML có một nhược điểm quan trọng. 

- Cú pháp dư thừa của nó gây ra chi phí lưu trữ và vận chuyển cao hơn. Điều này đặc biệt quan trọng khi chúng ta cần lưu trữ hoặc truyền một lượng lớn dữ liệu.































