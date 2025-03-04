# Architecture

  

Dưới đây là một số sự khác biệt giữa MVC và MVP:

* Liên kết – Layer View và Model trong MVC liên kết chặt chẽ hơn trong MVP
* Giao tiếp – Giao tiếp giữa View-Presenter và Presenter-Model diễn ra thông qua một Interface, Presenter chịu trách nhiệm xử lý logic hiển thị cho tầng View. Còn Layer controller trong MVC chỉ là cầu nối cho View và Model, nó không chịu trách nhiệm xử lý logic cho tầng View.
* Xử lý hành vi người dùng – Trong MVC hành vi người dùng được xử lý bởi Controller nó hướng dẫn Model thực hiện các hành động cần thiết để cập nhật dữ liệu. Nhưng trong MVP, hành vi người dùng được xử lý bởi View và nó hướng dẫn cho Presenter thực thi các hàm cần thiết.
* Mối quan hệ **many-to-one** là mối quan hệ giữa View và Controller trong MVC, nhưng trong MVP thì Presenter và View có mối quan hệ **one-to-one**.
* Thành phần chính – Trong MVC, layer Controller là thành phần chính, nó quản lý View và tương tác với Model để phục vụ các yêu cầu của người dùng. Còn trong MVP View là thành phần chính, nó trực tiếp nắm bắt các hành vi người dùng và gọi đến các method trong Presenter tương ứng để thực hiện yêu cầu của người dùng.


## Sự khác nhau giữa MVVM và MVP



| MVP(Model View Presenter)                                                                                                                | MVVM(Model View ViewModel)                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| It resolves the problem of having a dependent **View** by using **Presenter** as a communication channel between **Model** and **View.** | This architecture pattern is more event-driven as it uses data binding and thus makes easy separation of core business logic from the **View.** |
| The one-to-one relationship exists between the **Presenter** and the **View**.                                                           | Multiple **View** can be mapped with single **ViewModel**.                                                                                      |
| In this, observables are not needed as a **Presenter** layer.                                                                            | In this, observables are needed due to the absence of **Presenter** layer.                                                                      |
| The architecture is heavyweight.                                                                                                         | The architecture is leightweight as compared to MVP.                                                                                            |
| Testing is done easily as business logic and UI are separate.                                                                            | Testing is difficult as Business logic and UI are not separate.                                                                                 |
| In this case, debugging is easy.                                                                                                         | In this case, debugging is not easy.                                                                                                            |
| The **Presenter** has knowledge about the **View.**                                                                                      | **ViewModel** has no reference to the **View**.                                                                                                 |
| **Model** layer returns the response of the user’s input to the **Presenter** which forwards it to **View**.                             | After performing operations according to the user’s input, the **Model** layer returns the response to the **View**.                            |
| **Presenter** handles the application flow and the **View** is the actual application.                                                   | **ViewModel** is the actual application and **View** is the interface for the user in order to interact with the app.                           |
| The project file will contain more classes as well as code.                                                                              | The Project file will contain more classes but less code per class.                                                                             |
| Maintenance is not ensured in the architecture.                                                                                          | Maintenance of the layers is very good.                                                                                                         |
| It does not work well with android applications or software.                                                                             | It works extremely well with android applications or software.                                                                                  |


**!! Lưu ý :**

    Trong các mô hình MVC, MVVM, MVP, Repository không được liệt kê là một layer bởi vì nó không là một phần của kiến trúc mô hình, mà là một design pattern. Repository pattern được sử dụng để giải quyết vấn đề truy cập và quản lý dữ liệu trong ứng dụng, và thường được sử dụng cùng với các mô hình kiến trúc khác như MVC, MVVM, MVP. Repository pattern đóng vai trò quan trọng trong việc quản lý truy cập và xử lý dữ liệu, giúp cho việc tách biệt các thành phần trong ứng dụng trở nên dễ dàng hơn.
