# Hash

Tìm kiếm trên hash thường nhanh hơn tìm kiếm trên mảng vì quá trình tìm kiếm trong hash sử dụng cơ chế băm (hashing) để xác định vị trí của phần tử trong cấu trúc dữ liệu. Trong khi đó, tìm kiếm trên mảng phải thực hiện duyệt từng phần tử cho đến khi tìm thấy phần tử cần tìm.

Giả sử ta có một danh sách sinh viên và muốn tìm kiếm thông tin của một sinh viên dựa trên mã sinh viên. Ta có thể sử dụng cấu trúc dữ liệu hash table với mã sinh viên là khóa (key) và thông tin sinh viên là giá trị (value). Quá trình tìm kiếm thông tin của một sinh viên sẽ được thực hiện dựa trên mã sinh viên và sử dụng cơ chế băm để xác định vị trí trong hash table. Điều này giúp tìm kiếm nhanh chóng và hiệu quả hơn so với việc duyệt từng phần tử trong mảng sinh viên để tìm thông tin cần thiết.

Dưới đây là một ví dụ đơn giản minh họa việc tìm kiếm trên hash table và trên mảng:

```kotlin
data class Student(val id: String, val name: String)

fun main() {
    // Tạo một hash table để lưu trữ thông tin sinh viên
    val studentMap = HashMap<String, Student>()

    // Thêm các sinh viên vào hash table
    studentMap["A001"] = Student("A001", "John")
    studentMap["A002"] = Student("A002", "Alice")
    studentMap["A003"] = Student("A003", "Bob")
    studentMap["A004"] = Student("A004", "Emily")

    // Tìm kiếm sinh viên với mã "A003" trong hash table
    val studentA003 = studentMap["A003"]
    if (studentA003 != null) {
        println("Thông tin sinh viên A003: ${studentA003.name}")
    } else {
        println("Không tìm thấy sinh viên với mã A003")
    }

    // Tìm kiếm sinh viên với mã "A005" trong hash table
    val studentA005 = studentMap["A005"]
    if (studentA005 != null) {
        println("Thông tin sinh viên A005: ${studentA005.name}")
    } else {
        println("Không tìm thấy sinh viên với mã A005")
    }

    // Tìm kiếm sinh viên với mã "A002" trong mảng
    val studentList = listOf(
        Student("A001", "John"),
        Student("A002", "Alice"),
        Student("A003", "Bob"),
        Student("A004", "Emily")
    )

    val studentA002 = studentList.find { it.id == "A002" }
    if (studentA002 != null) {
        println("Thông tin sinh viên A002: ${studentA002.name}")
    } else {
        println("Không tìm thấy sinh viên với mã A002")
    }

    // Tìm kiếm sinh viên với mã "A005" trong mảng
    val studentA005FromArray = studentList.find { it.id == "A005" }
    if (studentA005FromArray != null) {
        println("Thông tin sinh viên A005: ${studentA005FromArray.name}")
    } else {
        println("Không tìm thấy sinh viên với mã A005")
    }
}
```

Trong ví dụ trên, ta sử dụng hash table (HashMap) để lưu trữ thông tin sinh viên với mã sinh viên là khóa (key) và đối tượng sinh viên là giá trị (value). Ta thực hiện tìm kiếm sinh viên thông qua mã sinh viên trên hash table bằng cách sử dụng khóa để truy cập vào giá trị tương ứng.

Ngược lại, trong trường hợp mảng sinh viên (studentList), ta sử dụng hàm find để tìm kiếm sinh viên với mã sinh viên tương ứng. Quá trình tìm kiếm trên mảng yêu cầu duyệt từng phần tử và kiểm tra điều kiện tìm kiếm.

## Override hash function in kotlin

Trong Kotlin, nếu không ghi đè (override) phương thức hashCode() trong một lớp, phương thức hashCode() mặc định của lớp Any sẽ được sử dụng.

Phương thức hashCode() trong lớp Any được triển khai để trả về một giá trị hash duy nhất cho mỗi đối tượng dựa trên địa chỉ bộ nhớ của đối tượng đó. Tuy nhiên, phương thức này có thể được ghi đè (override) để cung cấp một thuật toán hash tùy chỉnh cho lớp.

Ví dụ:

```kotlin
data class Student(val id: String, val name: String) {
    override fun hashCode(): Int {
        return id.hashCode()
    }
    
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Student) return false
        return id == other.id
    }
}
```

**Lưu ý rằng,** để có kết quả chính xác, khi ghi đè phương thức hashCode() bạn cũng nên ghi đè phương thức equals() để đảm bảo tính nhất quán giữa hai phương thức này.