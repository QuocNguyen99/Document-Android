# Dependency Injection trong Android

Dependency Injection (DI) tăng cường quản lý, bảo trì và khả năng mở rộng mã. Những khái niệm này cho phép tạo ra các ứng dụng mạnh mẽ và có khả năng thích ứng. Để đơn giản hóa việc triển khai DI và giảm thiểu sự phức tạp thủ công, các nhà phát triển thường sử dụng các framework như Hilt, Dagger, Koin, v.v. để hợp lý hóa việc quản lý phụ thuộc và giảm boilerplate trong các ứng dụng Android phức tạp.

## Tìm hiểu Dependency Injection

Dependency injection là một kỹ thuật trong đó một đối tượng, thường được gọi là client, nhận các đối tượng khác mà nó phụ thuộc vào—được gọi là phụ thuộc. Mẫu này nhằm mục đích tách rời việc xây dựng các dependency khỏi client sử dụng chúng, dẫn đến mã có tính mô-đun hơn, có thể kiểm tra và bảo trì được hơn. Trong Kotlin, đặc biệt là trong quá trình phát triển Android, DI rất quan trọng để quản lý hiệu quả lifecycle và cấu hình các dependency.

Giả sử bạn đang làm việc trên một ứng dụng có lớp `UserDataRepository` được sử dụng để tìm nạp dữ liệu người dùng. Để làm như vậy, nó cần một đối tượng `LocalDataSource` để lấy dữ liệu. Thay vì tạo `LocalDataSource` bên trong `UserDataRepository`, chúng tôi yêu cầu `UserDataRepository` mong đợi `LocalDataSource` từ bên ngoài khi nó được tạo. Đây là những gì nó trông giống như trong mã:

```kotlin
class UserDataRepository(private val localDataSource: LocalDataSource) {
    // Here, UserDataRepository uses localDataSource to do its job
}
```

Bằng cách này, `UserDataRepository` không cần biết `LocalDataSource` đến từ đâu hoặc nó được tạo ra như thế nào. Nó chỉ biết nó cần `LocalDataSource` để hoạt động.

## Các loại DI:

Có một số loại Dependency Injection thường được sử dụng:

- **Constructor Injection**: Các dependency được chuyển đến hàm tạo của lớp, như trong ví dụ UserDataRepository. Đây là dạng phổ biến nhất của DI.

- **Field Injection**: Đôi khi, bạn không thể sử dụng hàm tạo để cung cấp cho đối tượng những gì nó cần. Trong Android, điều này xảy ra rất nhiều với màn hình (Activities) và các bộ phận màn hình (Fragments). Vì vậy, bạn thiết lập các phần cần thiết trực tiếp vào các trường (biến) của đối tượng sau khi nó được tạo.

```kotlin
class UserDataRepository {
    lateinit var localDataSource: LocalDataSource
    // UserDataRepository now has a localDataSource it can use
}

// Inject localDataSource into userDataRepository
val userDataRepository = UserDataRepository()
userDataRepository.localDataSource = LocalDataSource()
```

- **Method Injection**: Trong một số trường hợp, bạn có thể muốn cung cấp hoặc thay đổi các phần mà đối tượng cần bằng một phương thức, đặc biệt nếu những nhu cầu này có thể thay đổi theo thời gian hoặc bạn muốn thiết lập chúng tại một thời điểm cụ thể.

```kotlin
class UserDataRepository {
    private lateinit var localDataSource: LocalDataSource

    fun setLocalDataSource(localDataSource: LocalDataSource) {
        this.localDataSource = localDataSource
    }

    // UserDataRepository can now use the provided localDataSource
}
```
Mỗi loại tiêm đều có trường hợp sử dụng và ưu điểm riêng. Constructor injection thường được ưa thích vì tính đơn giản và thúc đẩy việc sử dụng các dependency immutable. Việc chèn trường và phương pháp mang lại sự linh hoạt trong các tình huống mà constructor injection không khả thi.

## Tìm hiểu DI Graph

Trong quá trình phát triển Android, điều cần thiết là phải có một cách rõ ràng và hiệu quả để sắp xếp các phần trong ứng dụng của bạn. Tổ chức này có thể được hiển thị dưới dạng Dependency Injection (DI) Graph, giúp quản lý sự phụ thuộc giữa các thành phần khác nhau trong ứng dụng của bạn. Hãy chia nhỏ khái niệm này, tập trung vào các vai trò của `LocalDataStore`, `Repository`, `ViewModel` và `Activity`.

Hình ảnh với graph như thế này:

![](https://developer.android.com/static/images/training/dependency-injection/2-application-graph.png)

- **LocalDataStore** - LocalDataStore là nơi chứa dữ liệu ứng dụng của bạn. Hãy coi nó như nền tảng của một ngôi nhà nhưng dành cho dữ liệu ứng dụng của bạn. Nó tương tác trực tiếp với cơ sở dữ liệu hoặc bất kỳ hệ thống lưu trữ cục bộ nào để tìm nạp hoặc lưu dữ liệu.

- **Repository** (ví dụ: UserDataRepository) - Hoạt động như một điểm trung tâm để quản lý dữ liệu, giao tiếp với LocalDataStore và các nguồn khác như API mạng. Nó tổng hợp dữ liệu từ các nguồn khác nhau này, đảm bảo ViewModel vẫn được trừu tượng hóa khỏi sự phức tạp về nguồn gốc dữ liệu và các giải pháp xung đột. Repository đơn giản hóa việc truy cập dữ liệu cho phần còn lại của ứng dụng, đóng vai trò là nguồn thông tin thống nhất.

- **ViewModel** (ví dụ: UserProfileViewModel) - ViewModel là nơi dữ liệu được định hình thành thứ mà màn hình của ứng dụng có thể sử dụng. Nó lấy dữ liệu từ Repository, có thể thực hiện một số xử lý bổ sung và chuẩn bị sẵn sàng cho UI. Công việc của ViewModel là xử lý tất cả logic mà UI (Activity) sẽ hiển thị, đảm bảo rằng Activity vẫn đơn giản và tập trung vào việc trình bày UI.

- **Activity** (ví dụ: UserProfileActivity)- Activity là thành phần hiển thị UI cho người dùng. Nó sử dụng ViewModel để lấy dữ liệu cần trình bày. Activity phải đơn giản nhất có thể, chỉ tập trung vào logic UI, như phản hồi đầu vào của người dùng và hiển thị dữ liệu do ViewModel cung cấp.

## Xử lý màn hình ứng dụng không có Dependency Injection

Trong trường hợp màn hình ứng dụng hoạt động mà không có Dependency Injection (DI), điểm nhấn là `Activity` tự tạo ra các dependency cần thiết, bao gồm cả những phần phụ thuộc được yêu cầu bởi `ViewModel`.
Nếu không có Dependency Injection (DI), việc quản lý các thành phần của ứng dụng Android sẽ trở nên trực tiếp hơn nhưng kém linh hoạt hơn. Việc quản lý các dependency trong các thành phần ứng dụng, chẳng hạn như Activities, thường được thực hiện trực tiếp và không sử dụng các kỹ thuật nâng cao như Dependency Injection (DI).
Cách tiếp cận này tuy đơn giản nhưng có thể dẫn đến những thách thức về khả năng bảo trì và mở rộng mã. Hãy cùng khám phá cách thiết lập `UserProfileActivity` điển hình trong trường hợp này và ý nghĩa của việc quản lý trực tiếp các dependency.

```kotlin
class UserProfileActivity: AppCompatActivity() { 

    // ViewModel initialization without DI, using a ViewModel factory
    private val viewModel: UserProfileViewModel by viewModels { 
        UserProfileViewModelFactory(UserDataRepository(LocalDataSource()))
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // UI setup code...
    }
}
```
Tại đây, `UserProfileActivity` trực tiếp tạo và quản lý các dependency của nó. Mặc dù cách tiếp cận này dễ hiểu nhưng nó tạo ra mã có tính liên kết cao, có thể đặt ra thách thức trong việc duy trì và mở rộng ứng dụng.

`UserProfileViewModel` hoạt động như một cầu nối giữa UI và logic dữ liệu. Nó thường được tạo bằng nhà máy ViewModel:

```kotlin
class UserProfileViewModel(private val userDataRepository: UserDataRepository) : ViewModel() {
    // ViewModel logic
}

class UserProfileViewModelFactory(private val userDataRepository: UserDataRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass === UserProfileViewModel::class.java) {
            return UserProfileViewModel(userDataRepository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```
## Thử thách:
- **Khớp nối**: Activity được liên kết chặt chẽ với tất cả các lớp bên dưới (ViewModel, Repository, LocalDataStore), khiến mã ít mô-đun hơn.

- **Khó khăn khi kiểm tra**: Việc kiểm tra Activity yêu cầu thiết lập tất cả các dependency của nó, khiến việc kiểm tra process trở nên phức tạp.

- **Khả năng mở rộng**: Khi ứng dụng phát triển, thiết lập được kết hợp chặt chẽ này khiến việc quản lý và cập nhật các thành phần khác nhau trở nên khó khăn hơn.

Về bản chất, nếu không có DI, mỗi thành phần trong màn hình ứng dụng phải quản lý trực tiếp các dependency của nó, dẫn đến độ phức tạp tăng lên và khả năng bảo trì giảm.

## Quản lý các dependency bằng Bộ chứa DI

Bộ chứa DI nổi bật như một công cụ mạnh mẽ giúp giải quyết các thách thức chung trong việc quản lý các dependency trong ứng dụng Android. Những vùng chứa này hoạt động như các trung tâm tập trung, đảm nhận trách nhiệm tạo và cung cấp các dependency. Cách tiếp cận này làm giảm đáng kể sự phức tạp liên quan đến việc liên kết trực tiếp các thành phần với dependency của chúng, thúc đẩy mã sạch hơn, dễ bảo trì hơn.

```kotlin
class AppContainer {
    private val localDataSource = LocalDataSource()
    val userDataRepository = UserDataRepository(localDataSource)
}

class MyApp : Application() {
    val appContainer = AppContainer()
}
```
Với `AppContainer`, các dependency không được khởi tạo trong chính các thành phần mà được cung cấp bởi vùng chứa. Phương pháp này đơn giản hóa việc quản lý phụ thuộc và tăng cường

Lớp `Application` trong Android đóng vai trò là lớp cơ sở để duy trì trạng thái ứng dụng toàn cầu. Chúng tôi sử dụng nó để lưu trữ các bộ chứa Dependency Injection (DI) vì nó được tạo trước bất kỳ hoạt động, dịch vụ hoặc đối tượng receiver nào (ngoại trừ nhà cung cấp nội dung), khiến nó trở thành một nơi lý tưởng để khởi tạo các tài nguyên được chia sẻ như các bộ chứa DI. Điều này đảm bảo rằng các dependency có sẵn trên toàn bộ lifecycle của ứng dụng.

> [!CAUTION]
> Khi sử dụng lớp `Application` tùy chỉnh để lưu trữ vùng chứa DI hoặc cho các mục đích khởi tạo khác, bạn phải khai báo lớp này trong tệp kê khai của ứng dụng (`AndroidManifest.xml`) bằng cách sử dụng thuộc tính `android:name` trong thẻ `<application>`. Bước này rất quan trọng để hệ thống Android khởi tạo lớp `Application` tùy chỉnh của bạn khi khởi chạy ứng dụng.

Bằng cách sử dụng `AppContainer`, `UserProfileActivity` có thể được tái cấu trúc để ủy quyền trách nhiệm cung cấp các dependency:

```kotlin
class UserProfileActivity: AppCompatActivity() {

    // ViewModel initialization delegated to DI Container
    private val viewModel: UserProfileViewModel by viewModels { 
        UserProfileViewModelFactory((application as MyApp).appContainer.userDataRepository) 
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Activity setup code...
    }
}
```

Cách tiếp cận này cải thiện đáng kể khả năng bảo trì và mở rộng mã bằng cách giảm sự phụ thuộc trực tiếp giữa các thành phần. Nó cho phép `UserProfileActivity` tập trung vào logic UI, ủy quyền quản lý dữ liệu cho DI Container.

Mặc dù Bộ chứa DI mang lại nhiều lợi ích nhưng chúng không tự động quản lý các sự kiện lifecycle của các thành phần như Activities và Fragments. Cần phải hiểu rõ về Android lifecycle để đảm bảo rằng các dependency do Vùng chứa DI cung cấp được căn chỉnh phù hợp với các sự kiện này. Căn chỉnh phù hợp là rất quan trọng để ngăn ngừa rò rỉ bộ nhớ và tối ưu hóa việc quản lý tài nguyên, góp phần phát triển các ứng dụng Android mạnh mẽ và hiệu quả.

## Quản lý vòng đời và phạm vi cho vùng chứa DI

Quản lý hiệu quả lifecycle và phạm vi phụ thuộc trong ứng dụng Android là điều cần thiết để xây dựng các ứng dụng có cấu trúc tốt và hiệu quả.
Thiết lập ban đầu sử dụng AppContainer minh họa một tình huống điển hình:

```kotlin
class AppContainer {
    private val localDataSource = LocalDataSource()
    val userDataRepository = UserDataRepository(localDataSource)
}
```

Trong thiết lập này, userDataRepository luôn hoạt động, điều này có thể không lý tưởng, đặc biệt nếu nó chỉ cần thiết cho một số phần nhất định của ứng dụng, chẳng hạn như màn hình hồ sơ người dùng.

Để giải quyết vấn đề này, chúng tôi giới thiệu UserContainer, một vùng chứa có phạm vi được thiết kế để quản lý các dependency dành riêng cho người dùng:


```kotlin
class UserContainer(localDataSource: LocalDataSource) {
    val userDataRepository = UserDataRepository(localDataSource)
}

class AppContainer {
    val localDataSource = LocalDataSource()
    var userContainer: UserContainer? = null
}
```

UserContainer quản lý cụ thể userDataRepository, đảm bảo nó chỉ được tạo và hoạt động khi cần thiết, nhờ đó bảo tồn tài nguyên. Việc triển khai trong `UserProfileActivity` cho thấy cách sử dụng UserContainer một cách hiệu quả:

```kotlin
class UserProfileActivity: AppCompatActivity() {

    // ViewModel initialization with scoped container
    private val userProfileViewModel: UserProfileViewModel by viewModels {
        // Accessing the AppContainer from the application context
        val appContainer = (application as MyApp).appContainer

        appContainer.userContainer = UserContainer(appContainer.localDataSource)

        UserProfileViewModelFactory(appContainer.userContainer.userDataRepository)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Activity setup...
    }

    override fun onDestroy() {
        appContainer.userContainer = null
        super.onDestroy()
    }
}
```
Ở đây, `UserContainer` được chuẩn bị trong giai đoạn khởi tạo của ViewModel, căn chỉnh userDataRepository của lifecycle với `UserProfileViewModel`, từ đó nâng cao khả năng quản lý tài nguyên.


Bằng cách giới thiệu các vùng chứa có phạm vi như UserContainer, chúng tôi quản lý hiệu quả lifecycle và phạm vi các dependency của chúng tôi. Điều này không chỉ giúp quản lý bộ nhớ tốt hơn mà còn nâng cao tính mô đun và khả năng bảo trì của ứng dụng. Việc xác định phạm vi đặc biệt có lợi trong các ứng dụng phức tạp có nhiều thành phần đòi hỏi sự phụ thuộc đa dạng.


## Nhược điểm của việc sử dụng bộ chứa DI thủ công trong phát triển Android

Mặc dù Bộ chứa DI mang lại nhiều lợi ích cho việc phát triển Android, bao gồm tính mô đun hóa và khả năng bảo trì tốt hơn, nhưng việc sử dụng bộ chứa DI thủ công cũng có những nhược điểm. Phần này sẽ khám phá những hạn chế của việc dựa vào vùng chứa DI thủ công, cung cấp thông tin chi tiết về những thách thức tiềm ẩn mà nhà phát triển có thể gặp phải khi triển khai phương pháp này trong ứng dụng của họ.


### 1. Độ phức tạp trong các ứng dụng quy mô lớn

Mặc dù hiệu quả trong các dự án vừa và nhỏ, các thùng chứa DI thủ công có thể trở nên cồng kềnh trong các ứng dụng lớn hơn. Khi số lượng dependency tăng lên, độ phức tạp của việc quản lý chúng cũng tăng theo:

- **Mã Boilerplate tăng**: Việc thiết lập thủ công các dependency thường dẫn đến một lượng đáng kể mã boilerplate, khiến cơ sở mã dài dòng hơn và khó bảo trì hơn.

- **Khó khăn trong việc theo dõi các dependency**: Trong các dự án lớn, việc theo dõi và quản lý tất cả các dependency có thể khó khăn, dẫn đến sai sót tiềm ẩn hoặc bị giám sát trong quản lý dependency.

### 2. Tính linh hoạt và khả năng mở rộng hạn chế

Các thùng chứa DI thủ công có thể kém linh hoạt hơn khi mở rộng quy mô hoặc sửa đổi ứng dụng:

- **Kết hợp chặt chẽ với hoạt động triển khai**: Vì các dependency thường được mã hóa cứng nên điều này có thể dẫn đến sự kết hợp chặt chẽ với hoạt động triển khai cụ thể, gây khó khăn cho việc chuyển đổi các thành phần hoặc thử nghiệm các hoạt động triển khai thay thế.

- **Những thách thức trong việc tái cấu trúc**: Việc tái cấu trúc một ứng dụng bằng phương pháp DI thủ công có thể khó khăn hơn vì những thay đổi trong một phần mã có thể cần phải cập nhật trên nhiều phần khác của cơ sở mã.

### 3. Khả năng xảy ra lỗi do con người

Hướng dẫn sử dụng DI phụ thuộc rất nhiều vào sự chú ý đến từng chi tiết của nhà phát triển:

- **Nguy cơ xảy ra lỗi tăng lên**: Hướng dẫn sử dụng process về việc chèn các dependency làm tăng nguy cơ xảy ra lỗi của con người. Mặc dù constructor injection vốn đã giảm nguy cơ thiếu dependency thông qua kiểm tra thời gian biên dịch, nhưng trường và method injection có thể dễ bị giám sát trong quá trình khởi tạo dependency, có khả năng dẫn đến sự cố runtime. Điều này đòi hỏi phải quản lý cẩn thận các phương pháp tiêm này.

- **Sự không nhất quán trong quản lý dependency**: Các nhà phát triển khác nhau có thể triển khai DI theo những cách hơi khác nhau, dẫn đến sự không nhất quán trong cách quản lý và chèn các dependency.

### 4. Khó khăn khi kiểm tra

Mặc dù DI thường hỗ trợ thử nghiệm, nhưng các thùng chứa DI thủ công đôi khi có thể làm phức tạp process này:

- **Thiết lập phức tạp để kiểm tra**: Việc thiết lập môi trường thử nghiệm có thể yêu cầu cấu hình mở rộng của vùng chứa DI, đặc biệt nếu ứng dụng có nhiều dependency được kết nối với nhau.

- **Cách ly có giới hạn cho thử nghiệm đơn vị**: Việc đạt được các thử nghiệm đơn vị riêng biệt có thể khó khăn hơn vì các vùng chứa DI thủ công có thể không dễ dàng cho phép mô phỏng hoặc thay thế các dependency.


### thẩm quyền giải quyết

- ["Vanilla" DI trong Android](https://hyperskill.org/learn/step/43530)
- [Thùng chứa DI](https://hyperskill.org/learn/step/41527)
