#SQLite


Cơ sở dữ liệu SQL có thể hữu ích ngay cả trong những ứng dụng đơn giản nhất. Tuy nhiên, việc chạy một hệ thống cơ sở dữ liệu như PostgreSQL, MySQL và MariaDB, Elaticsearch không quan hệ, MongoDB, v.v. yêu cầu cài đặt, cấu hình,
bảo trì và làm việc trong các quy trình riêng biệt chấp nhận kết nối mạng. Đôi khi nó có thể không phù hợp với chúng ta hoặc thậm chí bị cấm. Trong những trường hợp như vậy, SQLite sẽ ra tay giải cứu.

**SQLite** (phát âm là "S. Q. Lite" hoặc "sequelite") là **database management system (RDBMS)** có quan hệ**. 

Trái ngược với cơ sở dữ liệu thông thường chạy dưới dạng process riêng biệt, SQLite có một cách tiếp cận khác:

- một ứng dụng nhúng mã cơ sở dữ liệu vào trong chính nó, do đó không cần có cơ sở dữ liệu riêng process.
- Đưa ra câu lệnh SQL đọc và ghi các tập tin trực tiếp trên đĩa cục bộ.
- Cơ sở dữ liệu với tất cả các bảng và siêu dữ liệu được chứa trong một tệp duy nhất. Định dạng tệp cơ sở dữ liệu là đa nền tảng, do đó tệp có thể được sao chép và sử dụng trên một máy khác có kiến trúc khác
- Mặc dù cạnh tranh với các tệp thông thường, SQLite có thể được sử dụng làm cơ sở dữ liệu phụ trợ cho ứng dụng web.
- Việc truy cập cùng một cơ sở dữ liệu SQLite cùng lúc từ nhiều ứng dụng và quy trình cũng là điều an toàn.

> [!NOTE]
> SQLite là một trong những cơ sở dữ liệu được triển khai rộng rãi nhất trên thế giới: nó được tích hợp sẵn trên mỗi thiết bị Android và iPhone.


## Cách sử dụng cơ bản

Để cài đặt và sử dụng SQLite, bạn cần thêm phần phụ thuộc của nó vào trình quản lý gói hoặc hệ thống xây dựng mà bạn chọn (Gradle, pip, npm). Sau đó, bạn sẽ có thể sử dụng các thư viện SQL thông thường để truy cập cơ sở dữ liệu.

Chúng tôi sẽ không gắn bó với bất kỳ programming language cụ thể nào và sẽ khám phá SQLite bằng giao diện dòng lệnh của nó: `sqlite3`. Gọi nó bằng tên tệp cơ sở dữ liệu làm tham số sẽ bắt đầu phiên tương tác với cơ sở dữ liệu đó. Nếu tệp cơ sở dữ liệu không tồn tại, nó sẽ được tạo. Hãy tạo cơ sở dữ liệu `edu.db` mới và điền vào cơ sở dữ liệu đó:

```bash
hs@laptop:~/sqlite$ ls
hs@laptop:~/sqlite$ sqlite3 edu.db
SQLite version 3.31.1 2020-01-27 19:55:54
Enter ".help" for usage hints.
sqlite> create table pets (pet_id integer, name text);
sqlite> insert into pets (pet_id, name) values (1, 'Harry'), (2, 'Elen');
sqlite> create table pet_weights (pet_id integer, weight integer);
sqlite> insert into pet_weights (pet_id, weight) values (1, 10), (2, 11);
sqlite> select * from pets;
1|Harry
2|Elen
sqlite> select * from pet_weights;
1|10
2|11
```

> [!NOTE]
> Việc chạy truy vấn trong thiết bị đầu cuối có thể bất tiện, vì vậy, bạn có thể sử dụng các công cụ UI như vậy làm trình duyệt sqlitebrowser.

##Không đánh chữ

Hầu hết các cơ sở dữ liệu SQL đều sử dụng static typing: loại giá trị được chèn vào một cột phải khớp với loại khai báo cột của nó. Bạn không thể chèn giá trị chuỗi vào cột số nguyên.

SQLite sử dụng kiểu gõ động, có nghĩa là bạn có thể lưu trữ bất kỳ loại giá trị nào trong bất kỳ cột nào, bất kể loại cột. Ngay cả việc khai báo các loại cột cũng là tùy chọn (tuy nhiên, điều này là cần thiết vì nó giúp người khác hiểu cấu trúc bảng của bạn).

Các câu lệnh SQL hoạt động trong cơ sở dữ liệu được nhập tĩnh hoạt động theo cách tương tự trong SQLite, mặc dù tính chất động của nó.


