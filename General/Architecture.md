# Architecture

## MVC - Model View Controller:

Model: Các lớp dữ liệu của bạn. Trong Kotlin, chúng ta sử dụng các Data classes, trong khi trong Java chúng được gọi là POJOs (Plain Old Java Object).

View: Các class trực quan. Mọi thứ người dùng nhìn thấy đều thuộc mục này. Trong Android thì nó chủ yếu là XML, mặc dù bạn cũng có thể tạo các chế độ xem bằng code và với sự ra đời của Jetpack Compose thì việc tạo UI sẽ thực hiện ở bằng code động.

Controller: Chất keo kết dính giữa hai thứ. Nó cập nhật view, nhận thông tin đầu vào của người dùng và thực hiện các thay đổi đối với model.



### **Ưu điểm MVC**

* Nhẹ, tiết kiệm tài nguyên.
* Kết cấu đơn giản.
* Dễ dàng kiểm tra và phát hiện lỗi.
* Dễ dàng phân tách các phần Model và View.

### **Nhược điểm MVC**

* Chỉ phù hợp với các dự án lớn. Đối với các dự án nhỏ mô hình sẽ trở nên cồng kềnh và tốn nhiều thời gian để trung chuyển dữ liệu.
* Controller sẽ trở nên phức tạp theo thời gian.
* Controller liên quan với View, vì thế View thay đổi Controller phải thay đổi theo.

![](../resources/mvc.png)

## MVP - Model View Presenter

MVP architecture pattern provides an easy way to structure the project codes. The reason why MVP is widely accepted is that it provides modularity, testability, and a more clean and maintainable codebase. It is composed of the following three components:

* **Model:** Layer for storing data. It is responsible for handling the domain logic(real-world business rules) and communication with the database and network layers.
* **View:** UI(User Interface) layer. It provides the visualization of the data and keep a track of the user’s action in order to notify the Presenter.
* **Presenter:** Fetch the data from the model and applies the UI logic to decide what to display. It manages the state of the View and takes actions according to the user’s input notification from the View.



### **Ưu điểm MVP**

* Cấu trúc rõ ràng và trực quan hơn MVC.
* Dễ dàng để viết unit test cho Presenter vì MVP hoạt động độc lập với View và không gắn với bất cứ API nào của Android.

### **Nhược điểm MVP**

* Mô hình sẽ to dần theo thời gian.
* Presenter sẽ lớn thêm khi thêm các logic nghiệp vụ. Người dùng sẽ khó kiểm soát và chia nhỏ đoạn code khi Presenter đã quá lớn.



![](../resources/mvp.png)

Dưới đây là một số sự khác biệt giữa MVC và MVP:

* Liên kết – Layer View và Model trong MVC liên kết chặt chẽ hơn trong MVP
* Giao tiếp – Giao tiếp giữa View-Presenter và Presenter-Model diễn ra thông qua một Interface, Presenter chịu trách nhiệm xử lý logic hiển thị cho tầng View. Còn Layer controller trong MVC chỉ là cầu nối cho View và Model, nó không chịu trách nhiệm xử lý logic cho tầng View.
* Xử lý hành vi người dùng – Trong MVC hành vi người dùng được xử lý bởi Controller nó hướng dẫn Model thực hiện các hành động cần thiết để cập nhật dữ liệu. Nhưng trong MVP, hành vi người dùng được xử lý bởi View và nó hướng dẫn cho Presenter thực thi các hàm cần thiết.
* Mối quan hệ **many-to-one** là mối quan hệ giữa View và Controller trong MVC, nhưng trong MVP thì Presenter và View có mối quan hệ **one-to-one**.
* Thành phần chính – Trong MVC, layer Controller là thành phần chính, nó quản lý View và tương tác với Model để phục vụ các yêu cầu của người dùng. Còn trong MVP View là thành phần chính, nó trực tiếp nắm bắt các hành vi người dùng và gọi đến các method trong Presenter tương ứng để thực hiện yêu cầu của người dùng.

## MVVM:

        MVVM pattern has some similarities with the MVP(Model — View — Presenter) design pattern as the **Presenter** role is played by the **ViewModel**. However, the drawbacks of the MVP pattern have been solved by MVVM. It suggests separating the data presentation logic(Views or UI) from the core business logic part of the application. The separate code layers of MVVM are:

* **Model:** This layer is responsible for the abstraction of the data sources. Model and ViewModel work together to get and save the data.
* **View:** The purpose of this layer is to inform the ViewModel about the user’s action. This layer observes the ViewModel and does not contain any kind of application logic.
* **ViewModel:** It exposes those data streams which are relevant to the View. Moreover, it serves as a link between the Model and the View.

![](../resources/mvvm.png)

### **Ưu điểm MVVM**

* Người dùng có thể thực hiện unit testing mà không phụ thuộc vào View.
* Khi test không cần phải tạo mockup như MVP chỉ cần xác nhận biến observable thích hợp.
* Sử dụng XAML cho View, vì vậy có thể chỉnh sửa giao diện, không gây ảnh hưởng đến code.
* Phân rất rõ ràng ba phần, vì vậy sẽ rất dễ dàng lập trình và kiểm tra sửa lỗi code.

### **Nhược điểm MVVM**

* Khi gán nhiều biến vào View các logic sẽ rải rác tăng dần theo thời gian gây khó khăn cho việc kiểm soát code.
* Data binding hai chiều gây hao tốn tài nguyên bộ nhớ.

## Sự khác nhau giữa MVVM và MVP



| MVP(Model View Presenter)                                                                                                                | MVVM(Model View ViewModel)                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| It resolves the problem of having a dependent **View** by using **Presenter** as a communication channel between **Model** and **View.** | This architecture pattern is more event-driven as it uses data binding and thus makes easy separation of core business logic from the **View.** |
| The one-to-one relationship exists between the **Presenter** and the **View**.                                                           | Multiple **View** can be mapped with single **ViewModel**.                                                                                      |
| In this, observables are not needed as a **Presenter** layer.                                                                            | In this, observables are needed due to the absence of **Presenter** layer.                                                                      |
| User interface is used more in MVP.                                                                                                      | There is no user interface in MVVM.                                                                                                             |
| The architecture is heavyweight.                                                                                                         | The architecture is leightweight as compared to MVP.                                                                                            |
| Testing is done easily as business logic and UI are separate.                                                                            | Testing is difficult as Business logic and UI are not separate.                                                                                 |
| In this case, debugging is easy.                                                                                                         | In this case, debugging is not easy.                                                                                                            |
| The **Presenter** has knowledge about the **View.**                                                                                      | **ViewModel** has no reference to the **View**.                                                                                                 |
| **Model** layer returns the response of the user’s input to the **Presenter** which forwards it to **View**.                             | After performing operations according to the user’s input, the **Model** layer returns the response to the **View**.                            |
| **Presenter** handles the application flow and the **View** is the actual application.                                                   | **ViewModel** is the actual application and **View** is the interface for the user in order to interact with the app.                           |
| The project file will contain more classes as well as code.                                                                              | The Project file will contain more classes but less code per class.                                                                             |
| Maintenance is not ensured in the architecture.                                                                                          | Maintenance of the layers is very good.                                                                                                         |
| Ideal for simple and complex applications.                                                                                               | Not ideal for small-scale projects.                                                                                                             |
| Easy to carry out Unit testing but a tight bond of **View** and **Presenter** can make it slightly difficult.                            | Unit testability is highest in this architecture.                                                                                               |
| It does not work well with android applications or software.                                                                             | It works extremely well with android applications or software.                                                                                  |
