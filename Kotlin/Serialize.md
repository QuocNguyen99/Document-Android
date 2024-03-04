# Serialize


Trong Android, "serialize" là quá trình chuyển đổi một đối tượng Java thành một chuỗi byte hoặc một định dạng dữ liệu có thể lưu trữ hoặc truyền qua mạng. 
Quá trình ngược lại, gọi là "deserialize", chuyển đổi dữ liệu đã được serialize trở lại thành các đối tượng Java ban đầu.
Serialization thường được sử dụng khi bạn muốn lưu trữ dữ liệu đối tượng vào cơ sở dữ liệu (ví dụ: Room Database), truyền dữ liệu giữa các thành phần của ứng dụng hoặc giữa các thiết bị thông qua mạng, hoặc khi lưu trữ dữ liệu vào bộ nhớ.

Trong Java và Android, bạn có thể sử dụng interface Serializable để đánh dấu một lớp như là có thể serialize. Tuy nhiên, trong một số trường hợp, sử dụng Serializable không phải là phương pháp hiệu quả nhất về hiệu suất hoặc bảo mật.
Trong Android, thay vào đó, bạn thường sẽ sử dụng Gson, Parcelable hoặc Serializable với annotation @SerializedName (hoặc @JsonProperty) để tuân thủ quy tắc khi serialize và deserialize dữ liệu.

Ví dụ về annotation @SerializedName:

```kotlin
data class User(
 @SerializedName("name") 
 val mName: String,
 @SerializedName("age") 
 val mAge: Int
)
```

Trong ví dụ này, annotation @SerializedName được sử dụng để chỉ định tên của trường khi được serialize hoặc deserialize bằng thư viện Gson.
Khi bạn serialize một đối tượng User, trường "name" sẽ được chuyển đổi thành chuỗi "name" trong dữ liệu JSON.Khi deserialize,
Gson sẽ tìm kiếm trường có tên "name" để gán dữ liệu cho trường mName trong đối tượng User.