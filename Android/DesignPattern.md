# Design Pattern thường dùng trong android

![loading-ag-444](../resources/pattern.avif)

Software design pattern is a reusable solution to solve repeated and common software problems in software engineering.
Design patterns can be categorized based on what kind of problem they solve, 
such as Creational pattern, Behavioral pattern, and Concurrency pattern.

In Android development, there are frequently used design patterns to solve common problems 
in the Android platform and manage resource lifecycles, such as Dependency Injection 
and Observer pattern.

You may already have used Creational patterns at least once, such as Builder pattern, 
Factory method pattern, and Singleton pattern to create instances in Android development.
## Creational Patterns

### Builder

        mẫu Builder đơn giản hóa việc tạo các đối tượng. Như vậy, cùng một quá trình xây dựng có thể tạo ra các đối tượng của cùng một lớp với các thuộc tính khác nhau.

Trong Android, một ví dụ về pattern Builder là AlertDialog.Builder:

```kotlin
AlertDialog.Builder(this)
  .setTitle("Metaphorical Sandwich Dialog")
  .setMessage("Metaphorical mesage to please use the spicy mustard.")
  .setNegativeButton("No thanks") { dialogInterface, i ->
    // "No thanks" action
  }
  .setPositiveButton("OK") { dialogInterface, i ->
    // "OK" action
  }
  .show()
```

Trình tạo này tiến hành từng bước và chỉ cho phép bạn chỉ định các phần của AlertDialog mà bạn cần chỉ định.

Một tập hợp các lựa chọn khác nhau sẽ dẫn đến một alert hoàn toàn khác.

## Dependency Injection pattern

Dependency Injection is one of the most popular patterns in modern Android development, 
transferring the obligation to create an object out of the class.

By transferring the obligation to create an object,
classes don’t need to have dependencies on each other. 
Therefore you can design loosely coupled dependencies between the classes

If you utilize dependency injection properly, you can benefit from the advantages below:

- Reduces boilerplate code.
- Loose coupling between classes, so you can write unit tests easily.
- Leverage class reusability.
- Improve code maintainability.

You can implement dependency injection [manually following Manual dependency injection guidelines](https://developer.android.com/training/dependency-injection/manual), 
but it’s highly recommended to use the following efficient solutions: Hilt, Dagger, and Koin(strictly service locator pattern).

- Hilt: Hilt is a compile-time dependency injection tool for Android,
which works on top of Dagger. Hilt generates standard Android Dagger components and 
reduces the amount of boilerplate code needed compared to the Dagger-Android library.
- Dagger: Dagger is also a compile-time dependency injection tool, based on javax.inject annotations and (JSR 330). 
You can use Dagger to configure dependency injection for your Android project, 
but it will require a lot of additional setup costs because Dagger is not an 
Android-dependent library. It’s highly recommended to use Hilt or Dagger-Android 
to reduce your setup costs massively.
- Koin: Koin is also a popular dependency injection (strictly service locator pattern) tool for Kotlin projects,
it is easy to use and requires low setup costs.

## Singleton

    Mẫu Singleton chỉ định rằng chỉ một single instance của một class nên tồn tại với global access point. Mô hình này hoạt động tốt khi mô hình hóa các đối tượng trong thế giới thực chỉ với một instance. Ví dụ: nếu bạn có một object tạo kết nối mạng hoặc cơ sở dữ liệu, việc có nhiều hơn một instance của dự án có thể gây ra sự cố và kết hợp dữ liệu. Đó là lý do tại sao trong một số trường hợp, bạn muốn hạn chế việc tạo nhiều instance.

    Từ khóa `object`trong Kotlin khai báo một singleton mà không cần chỉ định một static instance như trong các ngôn ngữ khác:

```kotlin
object ExampleSingleton {
  fun exampleMethod() {
    // ...
  }
}
```

Khi bạn cần truy cập các thành viên của đối tượng singleton, bạn thực hiện như sau:

```kotlin
    ExampleSingleton.exampleMethod()
```

Bên cạnh đó , `INSTANCE` static field hỗ trợ đối tượng Kotlin. Vì vậy, nếu bạn cần sử dụng một đối tượng Kotlin từ mã Java, bạn sửa đổi lệnh gọi như sau:

```java
    ExampleSingleton.INSTANCE.exampleMethod();
```

Bằng cách sử dụng từ khóa `object`, bạn sẽ biết mình đang sử dụng cùng một instance của lớp đó trong toàn bộ ứng dụng của mình.

Cách thứ hai là bạn có thể sử dụng `companion object` để tạo ra singleton:

```kotlin
    class AQIRepository private constructor(
        val remote: AQIDataSource
    ) : AQIDataSource {
        companion object {
            private var instance: AQIRepository? = null
            fun getInstance(remote: AQIDataSource) =
                instance ?: AQIRepository(remote).also { instance = it }
        }
    }
```

Singleton có lẽ là mô hình dễ hiểu nhất ban đầu nhưng có thể dễ bị lạm dụng và lạm dụng một cách nguy hiểm. Vì nó có thể truy cập được từ nhiều đối tượng, singleton có thể trải qua các tác dụng phụ không mong muốn mà lại khó theo dõi, đó chính là điều mà bạn không muốn trong tương lai phải đối mặt. Điều quan trọng là phải hiểu rõ mẫu, nhưng các mẫu thiết kế khác có thể an toàn hơn và dễ bảo trì hơn.

## Factory

    Cái tên đã nói lên , Factory xử lý tất cả logic sáng tạo của đối tượng. Trong mẫu này, một lớp Factory sẽ kiểm soát đối tượng nào cần khởi tạo. Factory pattern có ích khi xử lý nhiều đối tượng thông thường. Bạn có thể sử dụng nó ở những nơi bạn không muốn chỉ định một lớp cụ thể.

Hãy xem đoạn mã dưới đây để hiểu rõ hơn:

```kotlin
// 1
interface HostingPackageInterface {
  fun getServices(): List<String>
}

// 2
enum class HostingPackageType {
  STANDARD,
  PREMIUM
}

// 3
class StandardHostingPackage : HostingPackageInterface {
  override fun getServices(): List<String> {
    return ...
  }
}

// 4
class PremiumHostingPackage : HostingPackageInterface {
  override fun getServices(): List<String> {
    return ...
  }
}

// 5
object HostingPackageFactory {
  // 6
  fun getHostingFrom(type: HostingPackageType): HostingPackageInterface {
    return when (type) {
      HostingPackageType.STANDARD -> {
        StandardHostingPackage()
      }
      HostingPackageType.PREMIUM -> {
        PremiumHostingPackage()
      }
    }
  }
}
```

Cùng phân tích đoạn code kia nào

1. Đây là base interface cho tất cả các gói dịch vụ lưu trữ.
2. Enum này chỉ định tất cả các loại gói lưu trữ.
3. `StandardHostingPackage` tuân theo interface và triển khai phương thức cần thiết để liệt kê tất cả các dịch vụ.
4. `PremiumHostingPackage` tuân theo interface và triển khai phương thức cần thiết để liệt kê tất cả các dịch vụ.
5. `HostingPackageFactory` là một lớp singleton có helper method.
6. `GetHostingFrom` bên trong `HostingPackageFactory` chịu trách nhiệm tạo tất cả các đối tượng.

Bạn có thể sử dụng nó như thế này:

```kotlin
val standardPackage = HostingPackageFactory.getHostingFrom(HostingPackageType.STANDARD)
```

        Nó giúp giữ tất cả việc tạo đối tượng trong một lớp. Nếu được sử dụng không thích hợp, một lớp Factory có thể bị cồng kềnh do quá nhiều đối tượng. Việc kiểm tra cũng có thể trở nên khó khăn vì bản thân lớp factory chịu trách nhiệm cho tất cả các đối tượng

## Structural Patterns

### Adapter

        Trong Android thì tất nhiên là Adapter của Recycleview, ListView,.. rồi

Item trong recycler view của bạn có thể thiên biến vạn hóa đủ loại hình hài, mà adapter của Android thì chỉ không thể biết trước là bạn sẽ draw view như thế nào cả. Điều cần làm giờ là bạn phải tận dụng cái đủ và biến đổi nó. Nhớ là cái mới sẽ kế thừa cái cũ.



Trong trường hợp này, bạn có thể sử dụng một lớp con của RecyclerView.Adapter và triển khai các phương thức bắt buộc để làm cho mọi thứ hoạt động:

```kotlin
class TribbleAdapter(private val tribbles: List<Tribble>) : RecyclerView.Adapter<TribbleViewHolder>() {
  override fun onCreateViewHolder(viewGroup: ViewGroup, i: Int): TribbleViewHolder {
    val inflater = LayoutInflater.from(viewGroup.context)
    val view = inflater.inflate(R.layout.row_tribble, viewGroup, false)
    return TribbleViewHolder(view)
  }

  override fun onBindViewHolder(viewHolder: TribbleViewHolder, itemIndex: Int) {
    viewHolder.bind(tribbles[itemIndex])
  }

  override fun getItemCount() = tribbles.size
}
```

    RecyclerView không biết Tribble là gì. Thay vào đó, công việc của Adapter là xử lý dữ liệu và gửi lệnh`bind` đến đúng `ViewHolder`

### Facade

Pattern Facade cung cấp giao diện cấp cao hơn giúp một tập hợp các giao diện khác dễ sử dụng hơn.

        Nếu Activity của bạn cần một list book , thì Activity có thể yêu cầu một đối tượng duy nhất cho danh sách đó mà không cần hiểu hoạt động bên trong của local storage, bộ nhớ cache và API client. Ngoài việc giữ cho code Activity và Fragment của bạn rõ ràng và ngắn gọn, điều này cho phép tương lai thực hiện bất kỳ thay đổi bắt buộc nào đối với việc triển khai API mà không ảnh hưởng đến Activity.

        Square’s Retrofit là một thư viện giúp bạn triển khai mẫu Facade. Bạn tạo một interface để cung cấp dữ liệu API như sau:

```kotlin
interface BooksApi {
  @GET("books")
  fun listBooks(): Call<List<Book>>
}
```

Client chỉ cần gọi listBooks () để nhận danh sách các đối tượng Book trong callback mà không cần quan tâm đằng sau nó làm gì

        Điều này cho phép bạn thực hiện tất cả các loại tùy chỉnh bên dưới mà không ảnh hưởng đến client . Ví dụ: bạn có thể chỉ định một trình giải mã JSON tùy chỉnh ( GsonConverterFactory, RxJavaConverter) mà Activity không có manh mối về nó cả

```kotlin
val retrofit = Retrofit.Builder()
  .baseUrl("http://www.myexampleurl.com")
  .addConverterFactory(GsonConverterFactory.create())
  .build()

val api = retrofit.create<BooksApi>(BooksApi::class.java)
```

    Với Retrofit, bạn có thể tùy chỉnh thêm các hoạt động với `Interceptor` và `OkHttpClient` để kiểm soát bộ nhớ đệm và logging behavior mà client không biết điều gì đang xảy ra.

Mỗi đối tượng càng biết ít về những gì đang diễn ra đằng sau nó, thì tương lai càng dễ dàng quản lý các thay đổi trong ứng dụng.



### Decorator

Mẫu Decorator tự động gắn các trách nhiệm bổ sung vào một đối tượng để mở rộng chức năng của nó trong thời gian chạy.

**Nó cho phép người dùng thêm chức năng mới vào đối tượng hiện tại mà không muốn ảnh hưởng đến các đối tượng khác**. Kiểu thiết kế này có cấu trúc hoạt động như một lớp bao bọc (wrap) cho lớp hiện có. Mỗi khi cần thêm tính năng mới, đối tượng hiện có được wrap trong một đối tượng mới (decorator class).

Hãy xem ví dụ dưới đây: Nó tương tự như bạn đặt trà sữa mà thêm topping thì tính tiền sẽ khác nhau .

```kotlin
//1
interface MilkTea {
  fun getIngredient(): String
}

//2
class BaseMilkTea : MilkTea {
  override fun getIngredient(): String {
    return "Black Tea, Milk & Ice"
  }
}

//3
open class MilkTeaDecorator(protected var milkTea: MilkTea) : MilkTea {
  override fun getIngredient(): String {
    return milkTea.getIngredient()
  }
}

//4
class Pearl(milkTea: MilkTea) : MilkTeaDecorator(milkTea) {
  override fun getIngredient(): String {
    return milkTea.getIngredient() + ", Pearl"
  }
}

//5
class Pudding(milkTea: MilkTea) : MilkTeaDecorator(milkTea) {
  override fun getIngredient(): String {
    return milkTea.getIngredient() + ", Pudding"
  }
}
```

Phân tích qua đoạn code trên:

1. `MilkTea` interface giúp ta biết các thành phần của nó ( ingredients)
2. Mọi món `milkTea` đều cần ban đầu có trà sữa và đá . Trong code như bạn thấy là là `Black Tea, Milk & Ice`, do đó ta có `BaseMilkTea`.
3. Một `MilkTeaDecorator` giúp thêm nhiều topping hơn vào `BaseMilkTea`.
4. `Pearl` kế thừa từ `MilkTeaDecorator`. Nếu như bạn muốn thêm trân châu
5. `Pudding` kế thừa từ `MilkTeaDecorator`. Nếu như bạn muốn thêm pudding.

Bằng cách sử dụng lớp MilkTeaDecorator, bạn có thể mở rộng milkTea của mình một cách dễ dàng mà không cần phải thay đổi BaseMilkTea. Bạn cũng có thể xóa hoặc thêm bất kì thư gì vào milkTea trong thời gian chạy. Đây là cách bạn sử dụng nó:

## Behavioral Patterns

### Command

    `Command pattern` cho phép bạn đưa ra yêu cầu mà không cần biết người nhận. Bạn đóng gói một request dưới dạng một đối tượng và gửi nó đi. Nhưng làm thế nào hoàn thành request thì lại là một cơ chế hoàn toàn riêng biệt.



   EvenBus là framework phổ biến hỗ trợ pattern này theo cách sau :

![](../resouces/evenbus.png)

    `Event` là một đối tượng được kích hoạt bởi user input, server data hoặc bất kỳ thứ gì khác trong ứng dụng của bạn. Bạn có thể tạo các lớp con cụ thể cũng mang theo dữ liệu:

```kotlin
class MySpecificEvent { /* Additional fields if needed */ }
```

    Sau khi xác định sự kiện của mình, bạn có được một instance của `EventBus` và đăng ký một đối tượng làm `subscriber`. Ví dụ: nếu bạn đăng ký một Activity , bạn sẽ có:

```kotlin
override fun onStart() {
  super.onStart()
  EventBus.getDefault().register(this)
}

override fun onStop() {
  super.onStop()
  EventBus.getDefault().unregister(this)
}
```

Bây giờ đối tượng là `subscriber`, hãy cho đối tượng biết loại sự kiện nào để đăng ký và đối tượng nên làm gì khi nhận được sự kiện:

```kotlin
@Subscribe(threadMode = ThreadMode.MAIN)
fun onEvent(event: MySpecificEvent?) {
  /* Do something */
}
```

Cuối cùng, tạo và đăng một trong những sự kiện đó dựa trên tiêu chí của bạn:

```kotlin
EventBus.getDefault().post(MySpecificEvent())
```

### Observer Pattern

    Mẫu Observer xác định sự phụ thuộc một-nhiều giữa các đối tượng. Khi một đối tượng thay đổi trạng thái, những thứ phụ thuộc theo nó sẽ nhận được thông báo và cập nhật một cách tự động.

    Các `Subscriber` object sẽ lắng nghe các giá trị này và phản ứng với chúng khi chúng đến. Ví dụ: bạn có thể tạo 1 subscription khi thực hiện lệnh gọi API, lắng nghe phản hồi của máy chủ và phản hồi tương ứng.



Rx java, Livedata,Rx kotlin, Flow đều theo Observer pattern

- LiveData: LiveData is a lifecycle-aware, thread-safe, and data-holder observer pattern. 
LiveData’s observers are bound to Android Lifecycles, so you don’t need to unsubscribe your observers manually,
and they will not subscribe to data emissions when the lifecycle is not activated. 
As a result, it will prevent unpredicted and hard-to-identify memory leaks. 
It also provides useful operators with LiveData-ktx library, and supports Data Binding and Room compatibility.
However, modern Android development prefers Kotlin’s Flows over LiveData since 
Coroutines has been adopted broadly.
- Kotlin Flows: Flows is an asynchronous solution that is cold streams similar to sequences working with 
Coroutines. They are asynchronous and non-blocking solutions, which are supported at the language level in Kotlin.
Flows also provides useful operators, such as Transform operator, Flattening operators, and flowOn operator.
You can utilize StateFlow and SharedFlow in Android to implement state-holder observable
flow and emit values to multiple consumers.
- RxKotlin(RxJava): RxKotlin originated from the ReactiveX, which is a combination of the observer pattern, 
iterator pattern, and functional programming. 
RxKotlin provides many useful operators that allow you to compose asynchronous and event-based programs by
using observable sequences. Also, you can easily solve concurrency problems, such as low-level threading,
synchronization, and thread safety, with those operators, and there are many useful solutions for Android,
such as RxAndroid. However, RxKotlin includes many operators and can be too complex for beginners.
Kotlin Flows or LiveData are easier to use, especially if you don’t need to use lots of complicated
operations in your project.




## Concurrency Design pattern

    Concurrency design patterns là các khuôn mẫu được sử dụng để giải quyết các vấn đề liên quan đến đồng thời hóa trong các ứng dụng đa luồng hoặc đa tiến trình. Các mẫu này cung cấp các phương pháp và chiến lược để giải quyết các vấn đề như sự đồng bộ hóa truy cập tài nguyên chia sẻ, xử lý và giải quyết tranh chấp giữa các luồng, cải thiện hiệu suất và tăng tính khả dụng của hệ thống.

    

    Trong lập trình Android Kotlin, có nhiều concurrency design patterns được sử dụng để xử lý đa luồng và tránh deadlock, race conditions, và các vấn đề khác liên quan đến concurrency.



    Một ví dụ về sử dụng concurrency design pattern trong Android Kotlin là sử dụng AsyncTask. AsyncTask là một lớp được cung cấp bởi Android để thực hiện các tác vụ nặng như tải xuống dữ liệu từ Internet hoặc thực hiện các tác vụ khác liên quan đến I/O. AsyncTask cho phép bạn thực hiện các tác vụ này trong một thread riêng biệt, vì vậy không ảnh hưởng đến giao diện người dùng.



## Repository Design pattern

    Repository design pattern trong Android là một mô hình thiết kế giúp cho việc quản lý và truy cập dữ liệu trong ứng dụng trở nên dễ dàng hơn. Nó là một lớp trung gian giữa các lớp Model (dữ liệu) và Presenter/ViewModel (hiển thị dữ liệu) hoặc giữa ViewModel và Model.

Repository sử dụng các phương thức để truy xuất và lưu trữ dữ liệu từ nguồn dữ liệu, bao gồm cả cơ sở dữ liệu local và remote. Repository cung cấp các phương thức để lấy dữ liệu từ các nguồn khác nhau, đồng thời cũng cung cấp các phương thức để lưu trữ dữ liệu mới hoặc cập nhật dữ liệu hiện có.

Một số lợi ích của Repository design pattern trong Android là:

1. Giúp tách biệt các lớp logic của ứng dụng như lưu trữ và truy xuất dữ liệu từ lớp hiển thị (View) để dễ dàng bảo trì và phát triển ứng dụng.

2. Giúp cải thiện hiệu suất ứng dụng bằng cách quản lý và tối ưu hóa các yêu cầu truy xuất và lưu trữ dữ liệu.

3. Giúp cung cấp khả năng đa nguồn dữ liệu cho ứng dụng, từ đó cải thiện tính linh hoạt của ứng dụng.

4. Giúp kiểm soát việc truy cập vào cơ sở dữ liệu và tăng tính bảo mật của ứng dụng.

Trong Repository design pattern, chúng ta thường sử dụng các thư viện như Room để làm việc với cơ sở dữ liệu local, Retrofit hoặc Volley để làm việc với dữ liệu từ server. Chúng ta cũng có thể sử dụng các thư viện khác như Firebase để làm việc với dữ liệu realtime.

Tóm lại, Repository design pattern trong Android là một mô hình thiết kế quan trọng giúp cho việc quản lý và truy xuất dữ liệu trở nên dễ dàng hơn. Nó làm giảm sự phụ thuộc giữa các lớp của ứng dụng và cải thiện tính bảo mật, hiệu suất và tính linh hoạt của ứng dụng.


