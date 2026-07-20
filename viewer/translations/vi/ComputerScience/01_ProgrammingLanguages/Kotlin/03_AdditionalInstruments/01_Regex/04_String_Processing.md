# Xử lý chuỗi bằng Regexps

## Biểu thức chính quy và phân tách()

Định nghĩa trông như sau:

```kotlin
fun CharSequence.split(
    regex: Regex,
    limit: Int = 0
): List
```

- Đối số `regex` chịu trách nhiệm về regular expression xác định dấu phân cách
- và `limit` đặt số lượng chuỗi con tối đa cần trả về. **Không theo mặc định có nghĩa là không có giới hạn nào được đặt**

Ví dụ Chúng tôi chia số điện thoại của Mỹ thành mã quốc gia, mã vùng, mã văn phòng trung tâm và các chữ số còn lại khác:

```kotlin
val number = "+1-213-345-6789"
val parts = number.split("-") // {"+1", "213", "345", "6789"}
```

Bây giờ hãy làm cho vấn đề được xem xét trước đó trở nên phức tạp hơn. Có thể có dấu ngoặc đơn trong số. Hoặc có thể không có. Chúng ta cần phải giải quyết cả hai trường hợp này.

**Đây là nơi biểu thức chính quy giúp chúng ta**! Hãy soạn một regular expression sẽ khớp với dấu phân cách `"-"` hoặc `"-("` hoặc `")-"`. Chúng tôi sẽ sử dụng `toRegex()` để tạo regular expression từ một chuỗi.

```kotlin
val regex = "(-\\(|\\)-|-)".toRegex()
val number = "+1-213-345-6789"
val brackets = "+1-(213)-345-6789"
// splitting all substrings in number with brackets
val splitBrackets = brackets.split(regex) // {"+1", "213", "345", "6789"}
// splitting only two substring
val splitFirstBrackets = number.split(regex, 2) // {"+1", "213-345-6789"}
// splitting all substrings in number without brackets
val splitNumber = number.split(regex) // {"+1", "213", "345", "6789"}
```

## Regexp và thay thế()

Hãy xem xét tình trạng quá tải của `replace()` đối với các biểu thức chính quy:

```kotlin
fun CharSequence.replace(
    regex: Regex,
    replacement: String
): String
```

Là đối số, nó chấp nhận `regex`, tìm kiếm các phần có thể thay thế trong văn bản và `string` mà chúng sẽ được thay thế.

ví dụ :

```kotlin
val withDigits = "The first test flight of Falcon 9 was on June 4, 2010, " +
        "from Cape Canaveral, Florida, and the first resupply mission " +
        "to the ISS was made on October 7, 2012."
val processedString = withDigits.replace("\\d+".toRegex(), "[digits]")
println(processedString)
```
kết quả:
```bash
The first test flight of Falcon [digits] was on June [digits], [digits], from Cape Canaveral, Florida, and the first resupply mission to the ISS was made on October [digits], [digits].
```
## tìm() và findAll()

Hàm `find()` được sử dụng để tìm **kết quả trùng khớp đầu tiên** của regular expression trong đầu vào. Nó tìm kiếm từ chỉ mục bắt đầu của chuỗi đầu vào.

```kotlin
val regex = """[+]?[(]?[0-9]{1,4}[)]?[-0-9]*""".toRegex() // phone number template
val matchResult = regex.find("Her phone number is +1-234-567-89-01. You can also call the second one: +1-111-568-01-01")!!
print(matchResult.value) // +1-234-567-89-01
```

> [!WARNING]
> Lưu ý rằng chúng tôi quan tâm đến null safety. Văn bản có thể không chứa kết quả trùng khớp nào cả và kết quả của find() là Chuỗi? vì vậy bạn nên sử dụng toán tử `!!` hoặc toán tử Elvis.

Hàm `findAll()` là bắt buộc nếu bạn muốn tìm **tất cả các kết quả trùng khớp**. Nó trả về tất cả các chuỗi con phù hợp cùng một lúc:

```kotlin
val regex = """\d{4}-\d{2}-\d{2}""".toRegex() // date template in format YYYY-MM-DD 
val matchResult =
    regex.findAll("Harry was born 1980-07-31 in the Godric's Hollow."
                  + "In 1997-12-24, on Christmas Eve, he returned there" 
                  + "for the legendary Gryffindor sword")
for (matches in matchResult) println(matches.value)
//1980-07-31
//1997-12-24
```
