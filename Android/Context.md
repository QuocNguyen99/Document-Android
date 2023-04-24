# Context

        Trong Android, Context là một class trừu tượng, đóng vai trò rất quan trọng trong việc cung cấp thông tin về trạng thái hiện tại của ứng dụng và hỗ trợ quản lý tài nguyên của ứng dụng.



        Context được sử dụng để cung cấp các thông tin quan trọng liên quan đến trạng thái của ứng dụng như tên gói ứng dụng, các tài nguyên (resource) của ứng dụng (như hình ảnh, file XML), hệ thống dịch vụ (system service) như trình quản lý cửa sổ, trình quản lý bộ nhớ, v.v.



        Context có thể được lấy từ một số đối tượng khác nhau trong Android như Activity, Service, Application, v.v. Nó được truyền vào trong constructor của nhiều class khác nhau, đóng vai trò quan trọng trong việc giao tiếp giữa các thành phần khác nhau trong ứng dụng.



**Note:-** Tuy nhiên, việc sử dụng Context cũng có một số vấn đề cần lưu ý. Nếu Context được sử dụng không đúng cách, nó có thể dẫn đến memory leak và ảnh hưởng đến hiệu suất của ứng dụng. Do đó, việc sử dụng Context cần được thực hiện cẩn thận và theo đúng các quy tắc của Android.



So Contexts are mainly two types: 

1. **ApplicationContext**
2. **ActivityContext**



Context có 2 loại chính là ApplicationContext và ActivityContext. ApplicationContext tồn tại trong suốt vòng đời của ứng dụng và có thể truy cập thông qua một số đối tượng khác nhau, ví dụ như Application, Service, v.v. Trong khi đó, ActivityContext là một Context con, chỉ tồn tại khi một Activity đang được khởi tạo và bị hủy bỏ khi Activity đó bị hủy.



## ApplicationContext

    ApplicationContext là một đối tượng có kiểu Context trong Android, đại diện cho toàn bộ ứng dụng của bạn. Nó là một đối tượng có thể được truy cập bất cứ lúc nào và cung cấp thông tin về ứng dụng như tên gói, thông tin phiên bản, đường dẫn bộ nhớ cache, v.v.

Một số điểm nổi bật của ApplicationContext là:

1. Nó tồn tại suốt thời gian chạy của ứng dụng, không bị phá hủy khi các thành phần hoạt động (Activity, Service, BroadcastReceiver, ...) kết thúc.

2. Nó được chia sẻ cho tất cả các thành phần của ứng dụng, do đó có thể được truy cập từ bất cứ đâu.

3. Không liên quan đến bất kỳ thành phần giao diện nào, do đó không cần lo lắng về vấn đề rò rỉ bộ nhớ.

4. Không thể hiển thị UI và không phải là một Activity.

        ApplicationContext được khởi tạo khi ứng dụng được khởi động và được giải phóng khi ứng dụng bị tắt hoàn toàn. Nó có thể được truy cập thông qua phương thức getApplicationContext () từ bất kỳ đối tượng Context nào trong ứng dụng (ví dụ: Activity, Service, BroadcastReceiver, ...).

    Tuy nhiên, cần lưu ý rằng khi sử dụng ApplicationContext, bạn cần đảm bảo rằng bạn không làm việc trên giao diện người dùng hoặc truy cập tài nguyên của Activity, vì ApplicationContext không liên quan đến giao diện người dùng của ứng dụng.





### getApplicationContext()

    Hàm `getApplicationContext()` trả về đối tượng `Context` toàn cục của ứng dụng, tức là một đối tượng `Context` mà không bị ràng buộc với một thành phần cụ thể nào trong ứng dụng (ví dụ như Activity hoặc Service). Điều này đảm bảo rằng đối tượng `Context` được trả về sẽ tồn tại trong suốt vòng đời của ứng dụng, kể cả khi các thành phần khác của ứng dụng được tạo hoặc hủy.

    Hàm `getApplicationContext()` thường được sử dụng trong các trường hợp mà bạn cần truy cập đến các tài nguyên của ứng dụng mà không liên quan đến các thành phần cụ thể của ứng dụng, như khi cần lấy một `SharedPreferences` toàn cục hoặc truy cập đến `Resource` của ứng dụng. Nó cũng có thể được sử dụng để truyền đối tượng `Context` từ một thành phần đến thành phần khác trong ứng dụng.



### 

### getBaseContext()

        Trong Android, `getBaseContext()` là một phương thức được kế thừa từ lớp `ContextWrapper`. Phương thức này trả về `Context` gốc (root) của `ContextWrapper` hiện tại. Nó cung cấp một cách để truy cập đến các hàm của lớp `Context` cấp cao hơn như `Activity`, `Service` hoặc `Application`.

Một số trường hợp sử dụng của `getBaseContext()` bao gồm:

* Khi bạn muốn truy cập tới `Context` của `Application` từ một thành phần trong ứng dụng như `Activity` hoặc `Service`.
* Khi bạn muốn truy cập đến `Context` của một `Activity` khác trong cùng ứng dụng.
* Khi bạn muốn truy cập tới `Context` từ một đối tượng không kế thừa lớp `Context`.

Tuy nhiên, việc sử dụng `getBaseContext()` cũng có thể dẫn đến lỗi nếu không được sử dụng đúng cách. Vì vậy, thay vì sử dụng `getBaseContext()`, nên sử dụng `this` trong hầu hết các trường hợp, và chỉ sử dụng `getBaseContext()` khi cần thiết.



## Activity Context

    Trong Android, ActivityContext là một loại Context đặc biệt được tạo ra khi một Activity được khởi tạo và bắt đầu chạy. ActivityContext có thể được sử dụng để truy cập tới tài nguyên của Activity, bao gồm layout, hình ảnh, dữ liệu Intent, v.v.

ActivityContext là một loại Context phụ thuộc vào Activity và có phạm vi hoạt động giới hạn trong phạm vi của Activity đó. Vì vậy, khi Activity bị hủy hoặc kết thúc, thì ActivityContext cũng sẽ bị hủy và không còn có thể sử dụng được nữa.

ActivityContext được sử dụng trong rất nhiều trường hợp trong Android, chẳng hạn như khi bạn muốn khởi chạy một Intent mới, truy cập đến tài nguyên của Activity như menu hoặc theme, hoặc khi bạn muốn hiển thị một Dialog hoặc Toast trong phạm vi của Activity đó.

Có thể lấy được ActivityContext bằng cách gọi phương thức `this` hoặc `getActivity()` trong Activity hoặc thông qua hàm `getContext()` của View nằm trong Activity đó.
