# Thread synchronization

Việc sử dụng đồng thời dữ liệu được chia sẻ bởi nhiều luồng có thể gây ra hành vi không mong muốn hoặc sai sót. May mắn thay, Kotlin cho phép chúng tôi kiểm soát quyền truy cập của nhiều luồng vào tài nguyên được chia sẻ thuộc bất kỳ loại nào.

## Các thuật ngữ và khái niệm quan trọng

1. **Thread synchronization** là một cơ chế đảm bảo rằng hai hoặc nhiều luồng đồng thời không thực thi đồng thời một đoạn mã được gọi là phần quan trọng.
2. **Phần quan trọng** là vùng mã truy cập các tài nguyên được chia sẻ và không được thực thi bởi nhiều hơn một thread cùng một lúc. Tài nguyên được chia sẻ có thể là một biến, tệp, cổng đầu vào/đầu ra, cơ sở dữ liệu hoặc thứ gì khác.

## Đồng bộ hóa mã

Cách "cổ điển" và đơn giản nhất để bảo vệ mã khỏi bị truy cập đồng thời bởi nhiều luồng liên quan đến việc sử dụng các phương thức được đồng bộ hóa.

Có hai dạng synchronization khác nhau:

- chức năng đồng bộ hóa (chúng tôi sử dụng chú thích `@Synchronized`)

```kotlin
@Synchronized fun myFunction() {
    //do something
}
```

Lưu ý rằng **chú thích** là phương tiện đính kèm siêu dữ liệu vào mã; trong các chủ đề sau, bạn sẽ tìm hiểu thêm về chúng. Hiện tại, chỉ cần nhớ rằng `@Synchronized` là một cách dễ dàng để thông báo cho compiler rằng một phương thức chỉ có thể được sử dụng bởi một thread tại một thời điểm.

- các khối hoặc câu lệnh được đồng bộ hóa (chúng tôi sử dụng chức năng `synchronized()`)

```kotlin
 fun myOtherFunction() {
 
    // a synchronized block
    synchronized(this) {
         // block's code
    }
}
```

Một chức năng hoặc khối được đồng bộ hóa cần một đối tượng để khóa các luồng. Chỉ một thread có thể thực thi mã trong một khối hoặc phương thức được đồng bộ hóa cùng một lúc. Các luồng khác bị chặn cho đến khi thread bên trong khối hoặc phương thức được đồng bộ hóa thoát khỏi nó.
