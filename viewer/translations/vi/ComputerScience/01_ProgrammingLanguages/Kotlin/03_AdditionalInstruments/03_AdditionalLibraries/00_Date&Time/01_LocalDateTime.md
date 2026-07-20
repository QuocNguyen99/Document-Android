# Ngày giờ địa phương

Mặc dù lớp `Instant` của thư viện `kotlinx-datetime` có thể được sử dụng để xử lý ngày và giờ theo UTC nhưng nó không thể xử lý giờ khu vực. Vì lý do này, thư viện cung cấp hai lớp có tên `LocalDateTime` và `LocalDate`.

## Lớp LocalDateTime

Lớp `LocalDateTime` được sử dụng để biểu thị dữ liệu ngày và giờ cho **múi giờ nhất định** và có thể cung cấp các thành phần ngày và giờ mà con người có thể đọc được. **Nó không lưu giữ một thời điểm cụ thể** (như lớp `Instant`), nhưng xác định ngày và giờ ở một quốc gia hoặc múi giờ nhất định.

`LocalDateTime` có thể được khởi tạo từ `Instant` với sự trợ giúp của hàm thành viên `toLocalDateTime(timezone: TimeZone)` của lớp `Instant`, hàm này lấy đối tượng `TimeZone` làm tham số, như trong ví dụ sau:


```kotlin
val dateTime: Instant = Instant.parse("2022-02-17T19:00:00Z")

val tz: TimeZone = TimeZone.of("UTC+2")

val local: LocalDateTime = dateTime.toLocalDateTime(tz)

println(local)  // prints 2022-02-17T21:00
```

Ngoài ra, một đối tượng `LocalDateTime` có thể được tạo trực tiếp bằng các hàm tạo của lớp `LocalDateTime`:

```kotlin
// The parameters are: Year, month, day, hour, minutes
val dateTime1: LocalDateTime = LocalDateTime(2022, 2, 1, 17, 0)
println(dateTime1)  // 2022-02-01T17:00

// The parameters are: Year, month, day, hour, minutes, seconds
val dateTime2: LocalDateTime = LocalDateTime(2022, 2, 1, 17, 0, 16)
println(dateTime2)  // 2022-02-01T17:00:16

// The parameters are: Year, month, day, hour, minutes, seconds, nanoseconds
val dateTime3: LocalDateTime = LocalDateTime(2022, 2, 1, 17, 0, 16, 3456)
println(dateTime3)  // 2022-02-01T17:00:16.000003456
```

Nó cũng có thể được tạo từ chuỗi ISO 8601 với sự trợ giúp của hàm mở rộng `String` `toLocalDateTime()`:

```kotlin
val dateTime4: LocalDateTime = "2022-02-22T22:10:00".toLocalDateTime()
```

Ngoài ra, bạn có thể sử dụng hàm `LocalDateTime.parse()` với **chuỗi định dạng **ISO 8601** làm tham số:

```kotlin
val dateTime5: LocalDateTime = LocalDateTime.parse("2022-01-01T12:30:00Z")
```

## Lớp LocalDate

Lớp `LocalDate` tương tự như lớp `LocalDateTime`, điểm khác biệt là nó chỉ chứa thông tin ngày địa phương. 

Nó có thể được **khởi tạo trực tiếp**, từ **chuỗi ISO 8601** hoặc từ `LocalDateTime` như sau:

```kotlin
// The parameters are: Year, month, day
val date1: LocalDate = LocalDate(2022, 2, 1)
println(date1)  // 2022-02-01

val date2: LocalDate = "2000-01-01".toLocalDate()
println(date2)  // 2000-01-01

val date3: LocalDate = LocalDate.parse("2022-01-01")
println(date3)  // 2022-01-01

val datetime: LocalDateTime = LocalDateTime(2022, 1, 1, 12, 0)
val date4: LocalDate = datetime.date
println(date4))  // 2022-01-01

// Get the current date at UTC+01:00
val today: LocalDate = Clock.System.todayIn(TimeZone.of("UTC+1"))
```

## Thuộc tính LocalDateTime và LocalDate

Có thể lấy nhiều dữ liệu theo ngày hoặc giờ cụ thể khác nhau từ các thuộc tính `LocalDateTime` và `LocalDate`. Dưới đây bạn có thể xem một số ví dụ về các thuộc tính này; tên thuộc tính là tự giải thích:

```kotlin
val dateTime: LocalDateTime = LocalDateTime(2023, 2, 1, 23, 22,21, 123456789)
println(dateTime.year)        // 2023
println(dateTime.month)       // FEBRUARY
println(dateTime.monthNumber) // 2
println(dateTime.dayOfYear)   // 32
println(dateTime.dayOfWeek)   // WEDNESDAY
println(dateTime.date)        // 2023-02-01
println(dateTime.dayOfMonth)  // 1
println(dateTime.hour)        // 23
println(dateTime.minute)      // 22
println(dateTime.second)      // 21
println(dateTime.nanosecond)  // 123456789

val date: LocalDate = LocalDate(2023, 2, 1)
println(date.year)            // 2023
println(date.month)           // FEBRUARY
println(date.monthNumber)     // 2
println(date.dayOfYear)       // 32
println(date.dayOfWeek)       // WEDNESDAY
println(date.dayOfMonth)      // 1
```

## Hoạt động LocalDate và LocalDateTime

Các hoạt động của `LocalDate` tương tự như `Instant`. Ví dụ:

```kotlin
// Find difference in DateTimeUnit units
val date1 = LocalDate(2022, 1, 1)
val date2 = LocalDate(2022, 3, 1)
println(date1.until(date2, DateTimeUnit.DAY))  // 59

// Compare LocalDate objects
if (date1 > date2)
    println(date1)
else
    println(date2)
// 2022-03-01
```

Đối với `LocalDate`, chúng ta có thể nhận được sự trợ giúp của lớp `DatePeriod`, một lớp con của lớp `DateTimePeriod` và chỉ có các thuộc tính liên quan đến ngày (chứ không phải thời gian-) mới có ý nghĩa. Ví dụ:


```kotlin
// periodUntil() function
val date1 = LocalDate(2022, 1, 1)
val date2 = LocalDate(2024, 3, 2)

val period = date1.periodUntil(date2)

println("Years: ${period.years} Months: ${period.months} Days: ${period.days}")
// Years: 2 Months: 2 Days: 1
```

Thêm ví dụ:

```kotlin
// plus() and minus() functions
val date = LocalDate(2000, 1, 1)
println(date)
// 2000-01-01

val manyDays: DatePeriod = DatePeriod(days = 101)

val after = date.plus(manyDays) // or val after = date + manyDays
println(after)
// 2000-04-11

val before = date.minus(manyDays) // or val before = date - manyDays
println(before)
// 1999-09-22
```

> [!CAUTION]
> Các phép toán số học `LocalDateTime` bị loại bỏ một cách có chủ đích do sự chuyển đổi thời gian tiết kiệm ánh sáng ban ngày. 
> Các tác giả thư viện khuyên bạn nên thực hiện tất cả các phép tính số học ngày và giờ với lớp `Instant` và chỉ chuyển đổi sang `LocalDateTime` khi cần.

Một `Instant` có thể được khởi tạo từ `LocalDateTime` với sự trợ giúp của hàm thành viên `LocalDateTime` lớp `toInstant(timezone: TimeZone)`, lấy đối tượng `TimeZone` làm tham số, như trong ví dụ sau:

```kotlin
val dateTime: LocalDateTime = LocalDateTime(2022, 1, 1, 0, 0,0)
println(dateTime)
// 2022-01-01T00:00

val tz = TimeZone.of("Asia/Seoul")

val instant = dateTime.toInstant(tz)
println(instant)
// 2021-12-31T15:00:00Z
```

