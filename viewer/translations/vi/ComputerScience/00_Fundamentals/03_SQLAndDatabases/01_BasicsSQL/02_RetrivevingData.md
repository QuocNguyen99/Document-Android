#Truy xuất dữ liệu

## Phép chiếu


Giả sử bạn có một bảng `weather` lưu trữ thông tin về thời tiết ở Luân Đôn trong 5 ngày qua.


| Ngày | Giờ | Nhiệt độ | Cảm thấy_Thích | Áp lực | W_Tốc độ | W_Dir | W_Gust | Độ ẩm | Hiện tượng |
|------|------|-------------|----------||----------|----------|-------|----------|----------|--------|
| 1 | 1 | 14 | 14 | 754 | 2 | W | 8 | 88 | Tắm Mưa |
| 1 | 7 | 11 | 11 | 754 | 1 | N | 1 | 92 | Mưa Liên Tục |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 5 | 19 | 16 | 13 | 759 | 5 | S | 11 | 93 | Tắm Mưa |

Như bạn có thể thấy, có rất nhiều thuộc tính cho mỗi giờ. Chúng ta có cần tất cả chúng không? Hãy viết một truy vấn chỉ chọn thông tin cơ bản để hiển thị trên màn hình điện thoại di động, ví dụ: ngày, giờ, hiện tượng thời tiết, nhiệt độ, cảm giác và tốc độ gió.

```sql
SELECT
    day, 
    hour,
    phenomena,
    temperature AS "temperature in Celsius",
    feels_like AS "feels like in Celsius",
    w_speed AS "wind speed in m/s"
FROM
    weather
;
```

Sau từ khóa `SELECT`, chúng tôi liệt kê các cột mà chúng tôi muốn chọn và chỉ định bí danh nếu cần. Kết quả đánh giá truy vấn trong bảng sau:


| Ngày | Giờ | Hiện tượng | Nhiệt độ (°C) | Cảm giác như (°C) | Tốc độ gió (m/s) |
|------|------|-----------------|-------------------|-------------------|-------------------|
| 1 | 1 | Tắm Mưa | 14 | 14 | 2 |
| 1 | 7 | Mưa Liên Tục | 11 | 11 | 1 |
| ... | ... | ... | ... | ... | ... |
| 5 | 19 | Tắm Mưa | 16 | 13 | 5 |

> [!NOTE]
> Kiểu trích xuất dữ liệu khi bạn chọn một tập hợp con các cột trong bảng được gọi là phép chiếu.


## Biểu thức

Bây giờ, hãy tưởng tượng rằng vì lý do nào đó, chúng ta cần có các kết quả khác nhau dựa trên cùng một dữ liệu, ví dụ: thêm các cột nêu địa điểm, hiển thị nhiệt độ bằng độ F và ước tính xem trời có cảm thấy lạnh hơn thế hay không.

| Địa điểm | Ngày | Giờ | Hiện tượng | Nhiệt độ (° F) | Cảm thấy lạnh hơn | Tốc độ gió (m/s) |
|--------|------|------|-------------------|-------------------|--------------|-------------------|
| Luân Đôn | 1 | 1 | Tắm Mưa | 57 | FALSE | 2 |
| Luân Đôn | 1 | 7 | Mưa Liên Tục | 52 | FALSE | 1 |
| ... | ... | ... | ... | ... | ... | ... |
| Luân Đôn | 5 | 19 | Tắm Mưa | 61 | TRUE | 5 |



Truy vấn dưới đây thực hiện điều này một cách dễ dàng:

```sql
SELECT
    'London' AS place,
    day, 
    hour,
    phenomena,
    temperature*9/5+32 AS "temperature in Fahrenheit",
    feels_like < temperature AS "feels colder",
    wind_speed AS "wind speed in m/s"
FROM
    weather
;
```

## Bảng logic

Hệ thống quản lý dữ liệu ẩn cách dữ liệu của bạn được lưu trữ vật lý đằng sau khái niệm trừu tượng về **bảng logic**.
Tất cả những gì bạn cần biết để có thể chạy truy vấn là **lược đồ cơ sở dữ liệu—tên bảng, tên và loại cột—và các quyền truy cập thích hợp**.
Trong nội bộ, bộ xử lý truy vấn ánh xạ các tham chiếu bảng và cột từ truy vấn đến dữ liệu vật lý như tệp, kết nối mạng và thậm chí cả kết quả thực hiện các truy vấn khác.


## Biểu thức logic và so sánh

Hãy tưởng tượng rằng bạn chịu trách nhiệm về cơ sở dữ liệu cửa hàng sách. 
Có rất nhiều hàng trong mỗi lựa chọn và bạn cần lọc chúng theo các tiêu chí nhất định, 
ví dụ: theo tác giả, ngôn ngữ, một số thuộc tính hoặc thậm chí biểu thức được khách hàng yêu cầu.
Việc chọn một tập hợp con các hàng từ một bảng được gọi là **lọc**.

### Lọc theo tiêu chí

Trong hầu hết các trường hợp khi chúng tôi tiến hành truy vấn, chúng tôi chỉ muốn trích xuất những bản ghi tuân thủ các tiêu chí nhất định. 
Để lọc lựa chọn, có một toán tử đặc biệt `WHERE` trong SQL.

Cú pháp của toán tử này như sau:

```sql
SELECT *
FROM table
WHERE conditions
```

Trong trường `conditions`, chúng tôi có thể chèn bất kỳ tham số nào mà chúng tôi muốn dữ liệu được trích xuất của mình nhất quán.
Tuy nhiên, để xác định các điều kiện lựa chọn cụ thể đó, chúng ta cần áp dụng chúng cho các biểu thức.

Hãy tưởng tượng rằng khách hàng đầu tiên của bạn muốn mua một cuốn sách của `Charles Dickens`.
Hãy viết một truy vấn để chọn những cuốn sách đáp ứng tiêu chí:

```sql
SELECT id, title, rating
FROM books
WHERE author = 'Charles Dickens';
```

Mệnh đề `SELECT` không nhất thiết phải chứa các cột hoặc biểu thức được liệt kê trong mệnh đề `WHERE`.
Ví dụ: chúng tôi không phải xuất tác giả trong truy vấn trên mặc dù có điều kiện tương ứng trong `WHERE`.

### Lọc bằng so sánh

Đây là danh sách đầy đủ các phép toán so sánh có thể được sử dụng trong toán tử `WHERE`.


| Biểu tượng | Mô tả |
|----------||---------------------------------|
| = | Kiểm tra sự bình đẳng |
| <, > | Ít hơn, lớn hơn |
| <=, >= | Ít hơn hoặc bằng, Lớn hơn hoặc bằng |
| !<, !> | Không nhỏ hơn, Không lớn hơn |
| <>, != | Không bằng |

Thông thường, chúng ta áp dụng so sánh với các giá trị số. 
Trong trường hợp chúng ta muốn lựa chọn theo chuỗi ký tự hoặc ngày tháng, chúng ta nên đặt chúng trong dấu ngoặc kép (`" "`).

### Biểu thức logic

Tiếp theo, chúng ta sẽ xử lý các biểu thức logic giúp chúng ta hình thành các truy vấn SQL phức tạp hơn. 
Dưới đây là ba toán tử trong đại số Boolean mà bạn đã quen thuộc:

- `NOT` trả về `True` nếu đối số bằng `False` và ngược lại.

- `AND` so sánh các toán hạng và chỉ trả về `True` nếu tất cả chúng đều là `True`. Ngoài ra, trả về `False`.

- `OR` trả về `True` nếu có ít nhất một trong các toán hạng là `True`. Ngược lại, trả về `False`.

> [!TIP]
> Xin lưu ý thứ tự các toán tử được đưa ra ở trên,
> vì chúng được sắp xếp theo mức độ ưu tiên (có nghĩa là nếu chúng ta có cả ba toán hạng trong biểu thức, trước tiên chúng ta tiến hành với `NOT`, sau đó là `AND` và cuối cùng là `OR`).

Để tuyển được đúng người cho dự án, chúng tôi cần một ứng viên đáp ứng được hai yêu cầu: là Cấp Trung hoặc Cấp Cao và biết SQL.

```sql
SELECT *
FROM staff
WHERE (status="Middle" OR status="Senior") AND skills="SQL"
```

> [!WARNING]
> Vui lòng lưu ý các dấu ngoặc đơn mà chúng tôi sử dụng với toán hạng `OR`.
> Đây là một công cụ quan trọng để ưu tiên điều kiện `OR` so với `AND`.
> Nếu chúng tôi không sử dụng nó, `SQL` trước tiên sẽ process toán hạng `AND` và chỉ sau đó là `OR`, khiến yêu cầu truy vấn không liên quan.

