# Basic principles of OOP

Each object can be characterized by a state and behavior. An object’s current state is represented by its **properties**, and an object’s behavior is represented by its **methods**.

There are four basic principles of OOP. They are encapsulation, abstraction, inheritance, and polymorphism.

### 1. Encapsulation

    Encapsulation refers to bundling data with the methods operating with it while restricting direct access to some components.

### 2. Inheritance

    Inheritance is a mechanism for defining parent-child relationships between classes. Often objects are very similar, so inheritance allows programmers to reuse common logic and at the same time introduce unique concepts into the classes.

### 3. Polymorphism
**Polymorphism is the ability of an object or its methods to take on many forms depending on its type and the parameters of this or that method**. It allows programmers to define different implementations for the same method. Thus, the name (or interface) remains the same, but the actions performed may differ. For example, imagine a website that posts three main types of text: news, announcements, and articles. They are somewhat similar in that they all have a headline, some text, and a date. In other ways, they are different: articles have authors, news bulletins have sources, and announcements have a date after which they become irrelevant. It is convenient to write an abstract class with general information for all publications to avoid copying it every time and store what is different in the appropriate derived classes.

> [!NOTE]
> Not all languages support this kind of polymorphism. For example, you can define such methods in Java, Kotlin, or Scala, but not in Python or JavaScript.

### 4. Tính trừu tượng (Abstraction)

Data abstraction means that objects should provide a simplified, abstract version of their implementations. The details of their internal work usually aren't necessary for the user, so there's no need to represent them. Abstraction also means that only the most relevant features of the object will be presented.



## Tính chất của interface

* Interface không cung cấp việc kế thừa như Class hay Abstract Class mà nó chỉ khai báo phương thức/sự kiện để các lớp khác thực hiện nó.

* Nó không được khởi tạo nhưng nó có thể được tham chiếu bởi đối tượng của lớp thực hiện nó. ví dụ:
    IUserRepository user = new UserRepository();

* Không có interface lồng nhau (nested interface)

* Không có constructor, destructor, constants, static và variable.

* Một interface có thể kế thừa từ một hoặc nhiều interface khác.
    public interface IList<T> : ICollection<T>, IEnumerable<T>, IEnumerable

* Một interface có thể mở rộng một interface khác.

* Một class có thể implement một hoặc nhiều interfaces.

* Mọi phương thức, property đều mặc định là public.

## Tính chất của Abstract class

* Một Abstract Class không thể được khởi tạo.
* Abstract Class có thể chứa các phương thức trừu tượng và cụ thể (abstract method – virtual method).
* Một Abstract Class không thể là một Sealed Class. Vì Sealed Class không cho phép kế thừa.
* Không thể kế thừa từ một Class hay Interface.
* Lớp dẫn xuất từ Abstract Class phải implement tất cả các _**abstract methods**_ của Abstract Class đó.
* Trong Abstract Class thì các **_abstract method_** chỉ có khai báo. Còn **_virtual method_** thì có thể được định nghĩa.
* Abstract Class có thể dùng các access modifiers như: private, protected, internal. Nhưng các **_abstract/virtual methods_** thì không thể dùng private.
* Abstract Class có thể có contructor, destructor, constants, fields
* Không hỗ trợ đa kế thừa.

## So sánh interface và abstract class

|                                    | Interface                                                               | Abstract Class                                |
|:---------------------------------- |:-----------------------------------------------------------------------:| ---------------------------------------------:|
| Constructors, Fields and Constants | Không                                                                   | Có                                            |
| Multiple inheritance               | Một class có thể hiện thực nhiều interface.(tạm coi là thừa kế)         | Không hỗ trợ đa thừa kế                       |
| Default implementation             | Không thể định nghĩa code xử lý, chỉ có thể khai báo.                   | Có thể định nghĩa thân phương thức, property. |
| Access Modifiers                   | Mọi phương thức, property đều mặc định là public.                       | Có thể xác định modifier.                     |
| Adding functionality               | Mọi phương thức, property của interface cần được hiện thực trong class. | Không cần thiết.                              |

Khi nào nên dùng Interface
--------------------------

* Cần cung cấp các chức năng chung cho các lớp không liên quan.
* Cần nhóm các đối tượng dựa trên các hành vi phổ biến.
* Cần sử dụng đa hình vì một lớp có thể thực hiện nhiều interfaces.
* Cần tạo các thành phần (components) được ghép lỏng lẻo, dễ bảo trì và dùng như 1 plugin vì việc implement cho interface được tách biệt với nó.

Khi nào nên dùng Abstract Class
-------------------------------

* Cần sử dụng kế thừa.
* Cần cung cấp các phương thức mặc định cũng như các phương thức phổ biến mà nhiều lớp dẫn xuất có thể thực thi và ghi đè.
* Cần tạo nhiều phiên bản cho các thành phần (components). Bạn có thể thêm các thuộc tính và phương thức vào Abstract Class mà không vi phạm mã và tất cả các lớp kế thừa được tự động cập nhật với thay đổi.
  
  

# Interfaces

An interface is a collection of methods that describes the behavior of an object. To implement the interface, an object should implement all the methods from it. The behavior of an object is stiff, and it cannot change during the execution of a program. That's the difference between people and objects.

