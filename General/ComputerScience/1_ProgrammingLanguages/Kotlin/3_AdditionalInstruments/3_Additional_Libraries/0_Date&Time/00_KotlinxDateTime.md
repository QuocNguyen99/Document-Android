# Kotlinx datetime library

Kotlinx is a collection of projects that aren't part of the standard library but are useful extensions. One of the most useful projects is the kotlinx-datetime library, which is a multiplatform Kotlin library for handling date and time data.

## Instant

Instant represents a point on the timeline. This class is used to represent a moment in time, usually for comparing two moments in time or storing a date-time in a database.


## Creating Instant Objects

Creating an instance of Instant is quite straightforward.

You can use the `now()` method to get the current date and time, looks:

```kotlin
import kotlinx.datetime.Clock


fun main() {
    val currentInstant = Clock.System.now()
    println(currentInstant) // 2023-07-24T13:39:16.310148200Z your result is another
}
```

if you need time in milliseconds you can use `.toEpochMilliseconds()`:

```kotlin
    val currentInstant = Clock.System.now()
    val currentInstantInMillisec = currentInstant.toEpochMilliseconds() // returns current instant in milliseconds
```

or `fromEpochMilliseconds()` to create an instance based on milliseconds.


```kotlin
    val currentInstant = Clock.System.now()
    val currentInstantInMillisec = currentInstant.toEpochMilliseconds() // returns current instant in milliseconds
    val specificInstant = Instant.fromEpochMilliseconds(currentInstantInMillisec) // returns specific instant in milliseconds
```
## Instant Methods

Instant offers a number of methods that allow you to obtain various data or transform the Instant. For example, `plus` and `minus` `Duration` methods allow you to add or subtract temporal units.

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
Output:

```bash
2023-07-24T13:39:16.310148200Z
2023-07-24T19:39:16.310148200Z
2023-07-23T13:39:16.310148200Z
```

## Conversion Between Instant and Other Date and Time Types


Instant can easily be converted to other date and time types and vice versa.

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
## Best Practices and Common Mistakes When Working with Instant

> [!IMPORTANT]
> It's important to remember that Instant always represents time in UTC. 

Therefore, if you want to display time in a specific time zone, you will need to convert the `Instant` to another date and time type such as `LocalDateTime` or `ZonedDateTime`. Also, remember that `Instant` does not contain information about the time zone.

## TimeZone classes

The `TimeZone` class is used to keep time zone information. It can be initialized in many ways.

The `currentSystemDefault()` member function provides the computer system time zone, while UTC sets the time zone to `UTC` (denoted as Z in ISO 8601), as in the following example:

```kotlin
val tz1 = TimeZone.currentSystemDefault()  // The computer system time zone

val tz2 = TimeZone.UTC                     // UTC time zone
println(tz2)                               // Z
```

Any other time zone is set with the help of the `of()` member function, which takes a string as a parameter. It can be either the UTC offset (e.g., "UTC-3" or "UTC-03:00") or the time zone name (e.g., "Europe/Rome").
You can find the valid time zone names in [the tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). For example:

```kotlin
val tz3 = TimeZone.of("Europe/Paris")      // Paris, France time zone
println(tz3)                               // Europe/Paris

val tz4 = TimeZone.of("UTC+2")             // UTC + 2 hours time zone
println(tz4)                               // UTC+02:00
```
> [!CAUTION]
> In case the provided parameter of the `of()` function isn't valid, the `IllegalTimeZoneException` is thrown.

## DateTimePeriod class

The `DateTimePeriod` class is used for keeping the difference between two `Instant` objects split into date and time components.

These can be accessed from the relevant properties named `years`, `months`, `days`, `hours`, `minutes`, `seconds`, and `nanoseconds`.

Printing a `DateTimePeriod` object gives the difference as an ISO 8601 duration representation.

A difference between two `Instant` objects can be acquired with the use of the `periodUntil(other: Instant, timeZone: TimeZone)` member function, where other is another `Instant` and `timezone` is a time zone. For example:

```kotlin
val instant1 = Instant.parse("2000-01-01T20:00:00Z")
val instant2 = Instant.parse("2000-10-14T00:00:00Z")

val period: DateTimePeriod = instant1.periodUntil(instant2, TimeZone.UTC)

println(period)
// P9M12DT4H

println("Months: ${period.months} Days: ${period.days} Hours: ${period.hours}")
// Months: 9 Days: 12 Hours: 4
```

An important use of the `DateTimePeriod` class is to apply a time offset to an `Instant` with the `Instant.plus()` function, which adds an amount of time to an `Instant`, and the `Instant.minus()` function, which subtracts an amount of time from an `Instant`.


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

Following are some examples to depict the differences between the `Duration` (`kotlin.time package`) and the `DateTimePeriod` (`kotlinx`) classes:

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


