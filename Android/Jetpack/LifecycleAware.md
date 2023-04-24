# Lifecycle Aware

* Lifecycle-aware nhận các phản hồi về sự thay đổi trong trạng thái của vòng đời của các thành phần như activities hay fragments và thực hiện các hành động thích hợp. Component này giúp chúng ta tổ chức các thành phần trong ứng dụng tốt hơn, code nhẹ hơn, và dễ dàng bảo trì.

* Một mô hình chung là thực hiện các hành động phụ thuộc vào các phương thức vòng đời của activities hoặc fragments. Tuy nhiên, mô hình này dẫn tới việc tổ chức code khá tệ cũng như khiến khả năng xảy ra lỗi cao hơn. Còn với các component lifecycle-aware, bạn có thể chuyển code phụ thuộc vào các components ra ngoài các phương thức vòng đời của chúng và chuyển vào các components của lifecycle-aware.

* Gói **android.arch.lifecycle** cung cấp các classes và interfaces cho phép bạn dễ dàng xây dựng các lifecycle-aware components - là các thành phần tự động điều chỉnh các hành động của nó dựa trên trạng thái vòng đời hiện tại của một activity hoặc fragment

* Hầu hết các thành phần của ứng dụng được định nghĩa trong Android Framework có các vòng đời gắn liền với chúng. Lifecycles được quản lý bởi hệ thống hoặc framework đang chạy trong tiến trình của bạn. Chúng là cốt lõi để giúp Android hoạt động và ứng dụng của bạn nên quan tâm đến chúng. Nếu không làm như vậy, một ứng dụng có thể gặp rất nhiều rủi ro như memory leaks hay thậm chí khiến app bị dừng đột ngột.

Lifecycle
=========

* **Lifecycle** là một class giữ các thông tin về trạng thái vòng đời của một component và cho phép và cho phép các đối tượng khác observe (quan sát hoặc lắng nghe) các trạng thái này.

* **Lifecycle** sử dụng 2 thành phần chính của nó để theo dõi trạng thái vòng đời cho các thành phần liên quan đến nó:
  
  * **Event:** Các sự kiện vòng đời được gửi đi từ framework và lớp Lifecycle. Các sự kiện này tương đương với các sự kiện gọi lại (callback) trong activities và fragment
  
  * **State:** Trạng thái hiện tại của component đã được theo dõi bởi đối tượng Lifecycle

* Nghĩ một cách đơn giản thì states như các nodes của một đồ thị, các events như các đường đi giữa các nodes.

![loading-ag-583](../resources/lifecycle-states.png)

* Một lớp có thể quan sát trạng thái vòng đời của một component bằng cách thêm các thêm các annotations vào các methods của nó. Sau đó bạn có thể add một Observer bằng lời gọi hàm **addObserver()** của lớp **Lifecycle** và truyền vào đó một instance của observer của bạn như ví dụ dưới đây:

```kotlin
class MyObserver : DefaultLifecycleObserver {
    override fun onResume(owner: LifecycleOwner) {
        connect()
    }

    override fun onPause(owner: LifecycleOwner) {
        disconnect()
    }
}

myLifecycleOwner.getLifecycle().addObserver(MyObserver())
```

## LifecycleOwner

    **LifecycleOwner** là một interface với một phương thức thể hiện class này có một **Lifecycle**. Đó là phương thức **getLifecycle()**. 

* Interface này trừu tượng hóa việc sở hữu một **Lifecycle** từ các classes riêng biệt, ví dụ như **Fragment** hay **AppCompatActivity**, và cho phép bạn thêm các thành phần làm việc cùng với chúng. Bất kì application class nào đều có thể triển khai **LifecycleOwner** interface.

* Các components triển khai **LifecycleObserver** làm việc một cách liền mạch và thống nhất với các components implement **LifecycleOwner** bởi vì mỗi đối tượng này có thể cung cấp một lifecycle, và một observer có thể đăng ký để theo dõi.

## Best practices for lifecycle-aware components

* Giữ cho phần điều khiển UI(activity hoặc fragment) càng gọn càng tốt. Chúng không nên lưu trữ dữ liệu của riêng nó, thay vào đó sử dụng **ViewModel** để làm điều này, và sử dụng **LiveData** để theo dõi sự thay đổi của đối tượng và cập nhật lên màn hình

* Try to write data-driven UIs where your UI controller’s responsibility is to update the views as data changes, or notify user actions back to the ViewModel.

* Đặt các đoạn code xử lý data trong class **ViewModel**. **ViewModel** nên hoạt động như một người giúp kết nối giữa trình điều khiển UI và phần còn lại của ứng dụng. Chú ý, không có nghĩa là **ViewModel** sẽ có trách nhiệm lấy data(ví dụ từ network). Thay vào đó, ViewModel nên gọi các thành phần thích hợp để lấy dữ liệu, sau đó trả lại kết quả cho UI controller.

* Sử dụng **Data Binding** để có một giao diện gọn gàng giữa views và UI controller. Điều này cho phép bạn tạo views rõ ràng hơn và tối thiểu được code bạn viết trong activity hoặc fragment.

* Tránh khai báo **View** hay **Activity** context trong **ViewModel**. Nếu **ViewModel** nằm ngoài activity, activity sẽ bị leak .

## Use cases for lifecycle-aware components

Lifecycle-aware components can make it much easier for you to manage lifecycles in a variety of cases. A few examples are:

* Switching between coarse and fine-grained location updates. Use lifecycle-aware components to enable fine-grained location updates while your location app is visible and switch to coarse-grained updates when the app is in the background. [`LiveData`](https://developer.android.com/reference/androidx/lifecycle/LiveData), a lifecycle-aware component, allows your app to automatically update the UI when your user changes locations.

* Stopping and starting video buffering. Use lifecycle-aware components to start video buffering as soon as possible, but defer playback until app is fully started. You can also use lifecycle-aware components to terminate buffering when your app is destroyed.
