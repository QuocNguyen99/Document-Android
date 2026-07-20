#SQL cơ bản

## Tuyên bố CREATE

Hãy lưu trữ thông tin về sinh viên đại học trong cơ sở dữ liệu mới. Chúng ta có thể sử dụng câu lệnh `CREATE DATABASE` cho việc này. Cơ sở dữ liệu của chúng tôi sẽ được đặt tên là `students`:

```sql
CREATE DATABASE students;
```

Truy vấn SQL đơn giản này sẽ tạo cơ sở dữ liệu. Ngoài ra, chúng ta sẽ cần một vài bảng để sắp xếp dữ liệu.


## Tạo bảng mới

Để tạo bảng, hãy sử dụng câu lệnh `CREATE TABLE`.

Hãy tiếp tục làm việc với cơ sở dữ liệu sinh viên của chúng ta và tạo một bảng `students_info` sẽ
chứa bốn cột: `student_id`, `name`, `surname` và `age`.

Cột `student_idwill` chứa mã định danh sinh viên duy nhất thuộc loại `INT`. Các cột `name` và `surname` sẽ có dữ liệu `VARCHAR(30)`.
Cột tuổi sẽ chứa các giá trị INT.

```sql
CREATE TABLE students_info ( 
    student_id INT, 
    name VARCHAR(30), 
    surname VARCHAR(30), 
    age INT
);
```

Kết quả là chúng ta có một bảng trống `students_info`:



| sinh viên_id |      Arnamee |  họ |  tuổi |
|----------|:-------------:|------:|------:|

## Bỏ cơ sở dữ liệu

Như chúng tôi đã đề cập ở trên, `DROP DATABASE` sẽ xóa tất cả các bảng trong cơ sở dữ liệu và chính cơ sở dữ liệu đó. Nếu bạn chỉ muốn xóa một bảng cụ thể, hãy sử dụng câu lệnh `DROP TABLE`.

Hãy xóa bảng `students_info` của chúng tôi bằng một truy vấn SQL đơn giản:

```sql
DROP TABLE students_info; 
```

## Bộ dữ liệu

Trong câu lệnh SELECT, bạn có thể chỉ định nhiều giá trị được phân tách bằng dấu phẩy. Ví dụ: truy vấn bên dưới chọn một chuỗi ký tự, một ký tự số và một biểu thức số học:

```sql
SELECT 'Alice', 170, 170*0.393701;
```

## Bí danh

Trong một truy vấn, bạn có thể chỉ định tên (**bí danh**) cho mỗi thuộc tính của một bộ. Để làm như vậy, bạn nên sử dụng từ khóa `AS` theo sau là tên cho giá trị.

```sql
SELECT 
  'Alice' AS name, 
  170 AS height_in_centimeters, 
  170*0.393701 AS "height in inches"
;
```
