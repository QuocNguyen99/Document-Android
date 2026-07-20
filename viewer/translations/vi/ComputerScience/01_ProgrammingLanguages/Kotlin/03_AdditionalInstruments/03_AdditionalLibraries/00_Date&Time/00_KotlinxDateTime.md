# Thư viện ngày giờ Kotlinx

Kotlinx là collection của các dự án không thuộc thư viện tiêu chuẩn nhưng là các tiện ích mở rộng hữu ích. Một trong những dự án hữu ích nhất là thư viện kotlinx-datetime, đây là thư viện Kotlin đa nền tảng để xử lý dữ liệu ngày và giờ.

## Lập tức

Instant đại diện cho một điểm trên dòng thời gian. Lớp này được sử dụng để biểu thị một thời điểm, thường để so sánh hai thời điểm hoặc lưu trữ ngày giờ trong cơ sở dữ liệu.


## Tạo đối tượng tức thì

Việc tạo một phiên bản Instant khá đơn giản.

Bạn có thể sử dụng phương pháp `now()` để lấy ngày giờ hiện tại, trông như sau:

```kotlin
import kotlinx.datetime.Clock


fun main() {
    val currentInstant = Clock.System.now()
    println(currentInstant) // 2023-07-24T13:39:16.310148200Z your result is another
}
```

nếu bạn cần thời gian tính bằng mili giây, bạn có thể sử dụng `.toEpochMilliseconds()`:

```kotlin
    val currentInstant = Clock.System.now()
    val currentInstantInMillisec = currentInstant.toEpochMilliseconds() // returns current instant in milliseconds
```

hoặc `fromEpochMilliseconds()` để tạo phiên bản dựa trên mili giây.


```kotlin
    val currentInstant = Clock.System.now()
    val currentInstantInMillisec = currentInstant.toEpochMilliseconds() // returns current instant in milliseconds
    val specificInstant = Instant.fromEpochMilliseconds(currentInstantInMillisec) // returns specific instant in milliseconds
```
## Phương thức tức thì

Instant cung cấp một số phương pháp cho phép bạn lấy nhiều dữ liệu khác nhau hoặc chuyển đổi Instant. Ví dụ: các phương thức `plus` và `minus` `Duration` cho phép bạn cộng hoặc trừ các đơn vị thời gian.

```kotlin
import kotlinx.datetime.Clock
import kotlinx.datetime.Instant
import kotlin.time.Duration


fun main() {
    val currentInstant = Clock.System.now()
    val futureInstant = currentInstant.plus(Duration.parse("6h"))
    val pastInstant = currentInstant.minus(Duration.parse("24h"))

    println(currentInstant)
    println(futureInstant)
    println(pastInstant)
}
```
Đầu ra:

```bash
2023-07-24T13:39:16.310148200Z
2023-07-24T19:39:16.310148200Z
2023-07-23T13:39:16.310148200Z
```

## Chuyển đổi giữa các loại ngày và giờ tức thì và khác


Instant có thể dễ dàng được chuyển đổi sang các loại ngày giờ khác và ngược lại.

```kotlin
import kotlinx.datetime.*

fun main() {
    val currentInstant = Clock.System.now() // val currentInstant: Instant

    val zonedDateTime: LocalDateTime = currentInstant
        .toLocalDateTime(TimeZone.currentSystemDefault()) /
    val backToInstant: Instant = zonedDateTime
        .toInstant(TimeZone.currentSystemDefault())
    println(zonedDateTime)
    println(backToInstant)
}
```
## Các phương pháp hay nhất và lỗi thường gặp khi làm việc với Instant

> [!IMPORTANT]
> Điều quan trọng cần nhớ là Instant luôn biểu thị thời gian trong UTC. 

Do đó, nếu bạn muốn hiển thị thời gian theo múi giờ cụ thể, bạn sẽ cần chuyển đổi `Instant` sang loại ngày và giờ khác, chẳng hạn như `LocalDateTime` hoặc `ZonedDateTime`. Ngoài ra, hãy nhớ rằng `Instant` không chứa thông tin về múi giờ.

## Các lớp TimeZone

Lớp `TimeZone` được sử dụng để lưu giữ thông tin múi giờ. Nó có thể được khởi tạo theo nhiều cách.

Hàm thành viên `currentSystemDefault()` cung cấp múi giờ của hệ thống máy tính, trong khi UTC đặt múi giờ thành `UTC` (ký hiệu là Z trong ISO 8601), như trong ví dụ sau:

```kotlin
val tz1 = TimeZone.currentSystemDefault()  // The computer system time zone

val tz2 = TimeZone.UTC                     // UTC time zone
println(tz2)                               // Z
```

Bất kỳ múi giờ nào khác đều được đặt với sự trợ giúp của hàm thành viên `of()`, hàm này lấy một chuỗi làm tham số. Nó có thể là phần bù UTC (ví dụ: "UTC-3" hoặc "UTC-03:00") hoặc tên múi giờ (ví dụ: "Châu Âu/Rome").
Bạn có thể tìm thấy tên múi giờ hợp lệ trong [cơ sở dữ liệu tz](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). Ví dụ:

```kotlin
val tz3 = TimeZone.of("Europe/Paris")      // Paris, France time zone
println(tz3)                               // Europe/Paris

val tz4 = TimeZone.of("UTC+2")             // UTC + 2 hours time zone
println(tz4)                               // UTC+02:00
```
> [!CAUTION]
> Trong trường hợp tham số được cung cấp của hàm `of()` không hợp lệ thì `IllegalTimeZoneException` sẽ bị ném ra.

## Lớp DateTimePeriod

Lớp `DateTimePeriod` được sử dụng để duy trì sự khác biệt giữa hai đối tượng `Instant` được chia thành các thành phần ngày và giờ.

Chúng có thể được truy cập từ các thuộc tính có liên quan có tên `years`, `months`, `days`, `hours`, `minutes`, `seconds` và `nanoseconds`.

Việc in một đối tượng `DateTimePeriod` mang lại sự khác biệt dưới dạng biểu diễn thời lượng ISO 8601.

Có thể đạt được sự khác biệt giữa hai đối tượng `Instant` bằng cách sử dụng hàm thành viên `periodUntil(other: Instant, timeZone: TimeZone)`, trong đó đối tượng khác là `Instant` khác và `timezone` là múi giờ. Ví dụ:

```kotlin
val instant1 = Instant.parse("2000-01-01T20:00:00Z")
val instant2 = Instant.parse("2000-10-14T00:00:00Z")

val period: DateTimePeriod = instant1.periodUntil(instant2, TimeZone.UTC)

println(period)
// P9M12DT4H

println("Months: ${period.months} Days: ${period.days} Hours: ${period.hours}")
// Months: 9 Days: 12 Hours: 4
```

Một cách sử dụng quan trọng của lớp `DateTimePeriod` là áp dụng độ lệch thời gian cho `Instant` bằng hàm `Instant.plus()`, hàm này thêm một lượng thời gian cho `Instant` và hàm `Instant.minus()`, trừ đi một lượng thời gian từ một `Instant`.


```kotlin
val instant = Instant.parse("2000-01-01T00:00:00Z")
println(instant)
// 2000-01-01T00:00:00Z

val period: DateTimePeriod = DateTimePeriod(years = 1, months = 1, days = 1, hours = 1, minutes = 1, seconds = 1, nanoseconds = 123456789L)
println(period)
// P1Y1M1DT1H1M1.123456789S

val after = instant.plus(period, TimeZone.UTC)

println(after)
// 2001-02-02T01:01:01.123456789Z

val before = instant.minus(period, TimeZone.UTC)

println(before)
// 1998-11-29T22:58:58.876543211Z
```

Sau đây là một số ví dụ để mô tả sự khác biệt giữa các lớp `Duration` (`kotlin.time package`) và `DateTimePeriod` (`kotlinx`):

```kotlin
val instant1 = Instant.parse("2100-01-01T00:00:00Z")
val instant2 = Instant.parse("2105-07-09T15:23:40Z")

val duration: Duration = instant2 - instant1
println(duration)                                             // 2015d 15h 23m 40s
println(duration.inWholeDays)                                 // 2015
println(duration.inWholeHours)                                // 48375

println( instant1.periodUntil(instant2, TimeZone.UTC) )       // P5Y6M8DT15H23M40S
println( instant1.periodUntil(instant2, TimeZone.UTC).days )  // 8
```


