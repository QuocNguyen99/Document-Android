# Local date and time

While the `Instant` class of the `kotlinx-datetime` library can be used for date and time handling as far as the UTC is concerned, it can't handle regional time. For this reason, the library provides two classes named `LocalDateTime` and `LocalDate`.

## LocalDateTime class

The `LocalDateTime` class is used to represent date and time data for a **certain time zone** and can provide human-readable date and time components. **It doesn't hold a specific moment in time** (as the `Instant` class does), but identifies the time and date in a certain country or time zone.

`LocalDateTime` can be instantiated from an `Instant` with the help of the `Instant` class `toLocalDateTime(timezone: TimeZone)` member function, which takes a `TimeZone` object as a parameter, as in the following example:


```kotlin
val dateTime: Instant = Instant.parse("2022-02-17T19:00:00Z")

val tz: TimeZone = TimeZone.of("UTC+2")

val local: LocalDateTime = dateTime.toLocalDateTime(tz)

println(local)  // prints 2022-02-17T21:00
```

Additionally, a `LocalDateTime` object can be directly created with the `LocalDateTime` class constructors:

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

It can be also created from an ISO 8601 string with the help of the `String` extension function `toLocalDateTime()`:

```kotlin
val dateTime4: LocalDateTime = "2022-02-22T22:10:00".toLocalDateTime()
```

Alternatively, you can use the `LocalDateTime.parse()` function with an **ISO 8601 format string** as a parameter:

```kotlin
val dateTime5: LocalDateTime = LocalDateTime.parse("2022-01-01T12:30:00Z")
```

## LocalDate class

The `LocalDate` class is similar to the `LocalDateTime` class, the difference is that it holds only the local date information. 

It can be **instantiated directly**, from **an ISO 8601 string**, or from `LocalDateTime` as follows:

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

## LocalDateTime and LocalDate properties

Various date or time-specific data can be acquired from the `LocalDateTime` and `LocalDate` properties. Below you can see some examples of these properties; the property names are self-explanatory:

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

## LocalDate and LocalDateTime operations

`LocalDate` operations are similar to those of `Instant`. For example:

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

For `LocalDate`, we can get the help of the `DatePeriod` class, which is a subclass of the `DateTimePeriod` class and for which only the date- (and not time-) related properties have any significance. For example:


```kotlin
// periodUntil() function
val date1 = LocalDate(2022, 1, 1)
val date2 = LocalDate(2024, 3, 2)

val period = date1.periodUntil(date2)

println("Years: ${period.years} Months: ${period.months} Days: ${period.days}")
// Years: 2 Months: 2 Days: 1
```

More examples:

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
> `LocalDateTime` arithmetic operations are purposefully left out due to the daylight saving time transitions. 
> The library authors suggest doing all date and time arithmetic operations with the `Instant` class and converting to `LocalDateTime` only when needed.

An `Instant` can be instantiated from `LocalDateTime` with the help of the `LocalDateTime` class `toInstant(timezone: TimeZone)` member function, which takes a `TimeZone` object as a parameter, as in the following example:

```kotlin
val dateTime: LocalDateTime = LocalDateTime(2022, 1, 1, 0, 0,0)
println(dateTime)
// 2022-01-01T00:00

val tz = TimeZone.of("Asia/Seoul")

val instant = dateTime.toInstant(tz)
println(instant)
// 2021-12-31T15:00:00Z
```

