# Ngôn ngữ sửa đổi dữ liệu

## Câu lệnh INSERT cơ bản


Bạn có thể chèn bản ghi mới vào bảng bằng một truy vấn đơn giản bằng cách sử dụng câu lệnh `INSERT INTO`.

Ví dụ


| Tên | Họ | Mã Zip | Thành phố |
|----------|----------|----------|-----------|
| Tom | Đen | 11643 | New York |
| Hermione | Smith | 20599 | Washington |

```sql
INSERT INTO customers (name, surname, zip_code, city) 
VALUES ('Bobby', 'Ray', 60601, 'Chicago');
```

| Tên | Họ | Mã Zip | Thành phố |
|----------|----------|----------|-----------|
| Tom | Đen | 11643 | New York |
| Hermione | Smith | 20599 | Washington |
| Bobby | Ray | 60601 | Chicago |


## Chèn nhiều hàng

```sql
INSERT INTO customers (name, surname, zip_code, city) 
VALUES ('Mary', 'West', 75201, 'Dallas'), 
       ('Steve', 'Palmer', 33107, 'Miami');

```

## Chèn vào các cột được chỉ định

Đôi khi bạn phải chèn một bản ghi có một số giá trị bị thiếu. 

| Tên | Tuổi | Chủ sở hữu |
|------|------|-------|


Chúng tôi muốn thêm thông tin về chú mèo ba tuổi vô gia cư Felix. Vì Felix không có chủ sở hữu nên chúng tôi có thể bỏ qua cột này trong truy vấn `INSERT INTO` của mình.

```sql
INSERT INTO cats (name, age) 
VALUES ('Felix', 3);
```

Kết quả là bảng cats sẽ có một hàng:

| Tên | Tuổi | Chủ sở hữu |
|-------|------|-------|
| Felix | 3 | NULL |


## Câu lệnh DELETE cơ bản

Để xóa tất cả dữ liệu khỏi bảng chứ không phải chính bảng đó, hãy sử dụng truy vấn có câu lệnh `DELETE FROM`.

```sql
DELETE FROM books; 
```

Kết quả của việc thực hiện truy vấn là chúng ta vẫn có các bảng sách nhưng hiện tại nó trống.

### Xóa các hàng đã chọn

Bạn cũng có thể sử dụng câu lệnh `DELETE FROM` để chỉ xóa các hàng đã chọn khỏi bảng.

```sql
DELETE FROM books 
WHERE quantity = 0;
```


