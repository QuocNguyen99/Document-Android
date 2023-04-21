# Template Method Design Pattern

* Phân loại: Behavior Pattern

* Mục đích: Template Method xây dựng một bộ khung thuật toán trong một toán tử, để lại việc định nghĩa một vài bước cho các subclass mà không làm thay đổi cấu trúc chung của thuật toán.

* Tần suất sử dụng: trung bình

Mục đích ra đời
---------------

### Problem

    Giả sử khi tạo một ứng dụng khai thác dữ liệu để phân tích các tài liệu của công ty. Người dùng cung cấp các tài liệu ứng dụng ở nhiều định dạng khác nhau (PDF, DOC, CSV) và ứng dụng trích xuất dữ liệu có ý nghĩa từ các tài liệu này ở một định dạng thống nhất.

Phiên bản đầu tiên chỉ có thể đọc được file DOC, sau này dần dần có thể đọc thêm file CSV và file PDF.

    Sau khi tạo ra ba lớp như hình, ta nhận ra ba lớp có các đoạn code xử lý rất giống nhau. Có thể nói chỉ có đoạn code để xử lý các định dạng dữ liệu khác nhau hoàn toàn khác nhau ở tất cả các lớp, còn code để xử lý và phân tích dữ liệu gần như giống hệt.

### Solution

    Mẫu Template Method đề xuất nên chia nhỏ một thuật toán thành một loạt các bước, chuyển các bước này thành các phương thức và đặt một loạt các lệnh gọi đến các phương thức này bên trong một template method duy nhất. Các bước có thể là trừu tượng hoặc có thể có vài triển khai mặc định.

Đầu tiên, ta có thể khai báo tất cả các bước là trừu tượng, buộc các lớp con cung cấp các triển khai riêng của chúng cho các phương thức này. Trong trường hợp này, các lớp con đã có tất cả các triển khai cần thiết, vì vậy điều duy nhất cần làm là điều chỉnh các phương thức để phù hợp với các phương thức của lớp cha. Như này đã có thể loại bỏ trùng lặp code.
Kiến trúc

---------

Các thành phần trong mô hình:

* _AbstractClass_ khai báo các phương thức hoạt động như các bước của một thuật toán, cũng như template method thực tế gọi các phương thức này theo một thứ tự cụ thể. Các bước có thể được khai báo là trừu tượng hoặc có một số triển khai mặc định.
* _Các lớp Concrete_ có thể ghi đè tất cả các bước, nhưng không phải chính template method.

Ưu & nhược điểm
----------------

#### Ưu điểm

* Tái sử dụng code (reuse), tránh trùng lặp code (duplicate): đưa những phần trùng lặp vào lớp cha (abstract class).
* Cho phép người dùng override chỉ một số phần nhất định của thuật toán lớn, làm cho chúng ít bị ảnh hưởng hơn bởi những thay đổi xảy ra với các phần khác của thuật toán.

#### Nhược điểm

* Template method có càng nhiều bước để override càng khó bảo trì.

Trường hợp sử dụng
-------------------

* Khi có một thuật toán với nhiều bước và mong muốn cho phép tùy chỉnh chúng trong lớp con.
* Mong muốn chỉ có một triển khai phương thức trừu tượng duy nhất của một thuật toán.
* Mong muốn hành vi chung giữa các lớp con nên được đặt ở một lớp chung.
* Các lớp cha có thể gọi các hành vi trong các lớp con của chúng một cách thống nhất (step by step).

## Code minh họa



### Tạo abstract class

```java
public abstract class DataMiner {
      private String file;
      private String rawData;
      public String getFile() {
          return file;
      }

      public void setFile(String file) {
          this.file = file;
      }

      public String getRawData() {
          return rawData;
      }

      public void setRawData(String rawData) {
          this.rawData = rawData;
      }

      public void openFile(String path) {
          System.out.println("Open " + path);
      }

      public void closeFile() {
          System.out.println("Close file\n");
      }

      public abstract void extractData();

      public abstract void parseData();

      public void mine(String path) {
          openFile(path);
          extractData();
          parseData();
          closeFile();
      }
}
```

### Tạo concreate classes

```java
class CSVDataMiner : DataMiner {
    @Override
    public void extractData() {
        System.out.println("Extract CSV");
    }

    @Override
    public void parseData() {
        System.out.println("Parse CSV");
    }
}

class PDFDataMiner : DataMiner {
    @Override
    public void openFile(String path) {
        super.openFile(path);
        this.setFile("PDF");
    }

    @Override
    public void extractData() {
        System.out.println("Extract " + this.getFile());
        this.setRawData("PDF");
    }

    @Override
    public void parseData() {
        System.out.println("Parse " + this.getRawData());
    }
    }
```

### Sử dụng

```java

```


