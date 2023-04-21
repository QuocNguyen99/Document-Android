# Command Design Pattern

## Giới thiệu

* Command (hay còn gọi là Action, Transaction) là một mẫu thiết kế thuộc nhóm hành vi (Behavioral Pattern).
* Command pattern là một pattern cho phép bạn chuyển đổi một request thành một object độc lập chứa tất cả thông tin về request. Việc chuyển đổi này cho phép bạn tham số hoá các methods với các yêu cầu khác nhau như log, queue (undo/redo), transtraction.
* Khái niệm Command Object giống như một class trung gian được tạo ra để lưu trữ các câu lệnh và trạng thái của object tại một thời điểm nào đó.
* Command dịch ra nghĩa là ra lệnh. Commander nghĩa là chỉ huy, người này không làm mà chỉ ra lệnh cho người khác làm. Như vậy, phải có người nhận lệnh và thi hành lệnh. Người ra lệnh cần cung cấp một class đóng gói những mệnh lệnh. Người nhận mệnh lệnh cần phân biệt những interface nào để thực hiện đúng mệnh lệnh.
* Tần suất sử dụng: khá cao

## Kiến trúc

Các thành phần trong mô hình:

* _Command :_ là một interface hoặc abstract class, chứa một phương thức trừu tượng thực thi (execute) một hành động (operation). Request sẽ được đóng gói dưới dạng Command.
* _ConcreteCommand :_ là các implementation của Command. Định nghĩa một sự gắn kết giữa một đối tượng Receiver và một hành động. Thực thi execute() bằng việc gọi operation đang hoãn trên Receiver.
* _Client:_ tiếp nhận request từ phía người dùng, đóng gói request thành ConcreteCommand thích hợp và thiết lập receiver của nó.
* _Invoker:_ tiếp nhận ConcreteCommand từ Client và gọi execute() của ConcreteCommand để thực thi request.
* _Receiver :_ đây là thành phần thực sự xử lý business logic cho case request. Trong phương thức execute() của ConcreteCommand chúng ta sẽ gọi method thích hợp trong Receiver.

## Ưu & nhược điểm

#### Ưu điểm

* Đảm bảo nguyên tắc Single Responsibility
* Đảm bảo nguyên tắc Open/Closed
* Có thể thực hiện hoàn tác
* Giảm kết nối phụ thuộc giữa Invoker và Receiver
* Cho phép đóng gói yêu cầu thành đối tượng, dễ dàng chuyển dữ liệu giữa các thành phần hệ thống

#### Nhược điểm

* Khiến code trở nên phức tạp hơn, sinh ra các lớp mới gây phức tạp cho mã nguồn.

## Khi nào thì sử dụng

Dưới đây chúng ta có thể liệt kê một số trường hợp mà khi gặp sẽ phải cân nhắc sử dụng Command pattern:

* Khi cần tham số hóa các đối tượng theo một hành động thực hiện (biến action thành parameter)
* Khi cần tạo và thực thi các yêu cầu vào các thời điểm khác nhau (delay action)
* Khi cần hỗ trợ tính năng undo, log, callback hoặc transaction
* Phối hợp nhiều Command với nhau theo thứ tự

## Code ví dụ

### Tạo Receiver

```java
public class Fan {
    public void turnOn() {
        System.out.println("Turn on");
    }

    public void turnOff() {
        System.out.println("Turn off");
    }
}
```

### Tạo interface ICommand

```java
public interface ICommand {
    void execute();
    void undo();
}
```

### Tạo Commander

```java
public class Remote {
    private final ICommand turnOnCommand;
    private final ICommand turnOffCommand;

    public Remote(ICommand turnOnCommand, ICommand turnOffCommand) {
        this.turnOnCommand = turnOnCommand;
        this.turnOffCommand = turnOffCommand;
    }

    public void turnOnButtonClick() {
        turnOnCommand.execute();
    }

    public void turnOffButtonClick() {
        turnOffCommand.execute();
    }
}
```

### Implement 2 Commander

```java
class TurnOffCommand implements ICommand {
    private final Fan fan;

    public TurnOffCommand(Fan fan) {
        this.fan = fan;
    }

    public void execute() {
        fan.turnOff();
    }

    public void undo() {
        fan.turnOn();
    }
}

class TurnOnCommand implements ICommand {
    private final Fan fan;

    public TurnOnCommand(Fan fan) {
        this.fan = fan;
    }

    public void execute() {
        fan.turnOn();
    }

    public void undo() {
        fan.turnOff();
    }
}
```

### Sử dụng

```ja

```






