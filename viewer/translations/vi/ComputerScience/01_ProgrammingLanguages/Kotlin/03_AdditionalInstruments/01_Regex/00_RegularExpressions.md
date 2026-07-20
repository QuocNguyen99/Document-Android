# Biểu thức chính quy trong kotlin

Trước tiên hãy xem [định nghĩa cơ bản của Regexps](/General/ComputerScience/00_Fundamentals/00_Essentials/00_ProgrammingConcepts/ProgrammingTechniques/00_RegularExpressions.md)


Cách đầu tiên là tạo một phiên bản `String` rồi gọi phương thức `toRegex()`, phương thức này sẽ tạo một biểu thức chính quy từ chuỗi đó:

```kotlin
val string = "cat" // creating the "cat" string
val regex = string.toRegex() // creating the "cat" regex
```

Một cách khác là gọi hàm tạo Regex:

```kotlin
val regex = Regex("cat") // creating a "cat" regex
```
> [!TIP]
> Kết quả sẽ giống nhau: chúng ta sẽ nhận được regular expression cần thiết. Hiện tại, chúng ta có thể cho rằng các tùy chọn này đều tốt như nhau và việc chọn cái này hay cái kia là vấn đề sở thích cá nhân.

## Kết hợp đơn giản

- `Regex.matches(string: CharSequence)`. Nó được sử dụng để tìm **kết quả khớp hoàn toàn**, nghĩa là toàn bộ chuỗi phải khớp với mẫu. và trả về kết quả boolean.

```kotlin
val regex = Regex("cat") // creating the "cat" regex
    
val stringCat = "cat"
val stringDog = "dog"
val stringCats = "cats"

println(regex.matches(stringCat))   // true
println(regex.matches(stringDog))   // false
println(regex.matches(stringCats))  // false
```

- `Regex.matchAt(input: CharSequence, index: Int)`. Hàm này trả về kết quả khớp nếu tìm thấy hoặc `null` nếu không tìm thấy. Nếu có sự trùng khớp, đối tượng được trả về thuộc loại `MatchResult`, vì vậy chúng ta có thể truy cập `String` khớp bằng cách sử dụng thuộc tính `value`. Đây là một ví dụ:

```kotlin
val regex = Regex("cat")
val stringCat = "The cat is eating."
    
println(regex.matchAt(stringCat, 4)?.value) // cat
println(regex.matchAt(stringCat, 5)?.value) // null
```
