# Date and time standards

## UTC and UTC-SLS standards

Coordinated Universal Time (UTC) is the world's principal time standard for regulating clocks and time.
It has effectively replaced the Greenwich Mean Time (GMT), which is the yearly average of the time at the Royal Observatory Greenwich.


UTC uses the International Atomic Time (IAT) in order to keep the correct time, which is the mean time of 400 atomic clocks around the globe.

Although we can measure time with great accuracy, the Earth's rotating speed isn't that stable.
Due to earthquakes, tides, etc., the time we measure isn't synchronized with the astronomical time.

that is, what the time should be according to the Earth's position relative to the Sun.
The Coordinated Universal Time with Smoothed Leap Seconds (UTC-SLS) standard is effectively the same as the UTC standard, the difference being that it takes into account the leap seconds correction.

## Time zones

UTC provides the correct time for the longitude equal to zero degrees, but the rest of the world has its own local time. 

Thus, the countries are divided into different Time Zones, whose local time ranges from UTC minus 12 hours to UTC plus 14 hours. 

The local time of a time zone is represented as `UTC+<hours:minutes>` or `UTC-<hours:minutes>`. For example:


```kotlin
UTC-05:00
UTC+00:00
UTC+02:00
UTC+05:45
```

Time zones may also be denoted by alphabetic abbreviations, for example "MUT" stands for "Mauritius Time", that is UTC+04:00.

Following are some examples of time zones. Note that normally, countries have a single time zone, but some large countries may be divided into several time zones.

| Country | Time zone | Abbr | Time zone name                                 |
|---------|-----------|-----|----------------------------------------------|
| Japan    | UTC+09:00 | JST | Japan Standard Time                          |
| Italy    | UTC+01:00 | CET | Central European Time                        |
| Sri Lanka| UTC+05:30 | SLST| Sri Lanka Standard Time                        |
| Peru     | UTC-05:00 | PET | Peru Time                                  |
| Greece   | UTC+02:00 | EET | Eastern European Time                        |
| China    | UTC+08:00 | CST | China Standard Time                           |
| Brazil   | UTC-02:00 | FNT | Fernando de Noronha Time                      |
| Brazil   | UTC-03:00 | BRT | Brasília Time                                |
| Brazil   | UTC-04:00 | AMT | Amazon Time                                 |
| Brazil   | UTC-05:00 | ACT | Acre Time                                   |
| Mexico   | UTC-05:00 | EST | Eastern Standard Time                        |
| Mexico   | UTC-06:00 | CST | Central Standard Time                         |
| Mexico   | UTC-07:00 | MST | Mountain Standard Time                       |


Many countries adjust their clocks seasonally by implementing Daylight Saving Time (DST). This practice involves shifting clocks forward in spring and back to standard time in autumn. The adjusted time during the summer months is called summer time. The primary goal of DST is to maximize daylight hours during the evening, which can potentially lead to energy savings.
## The ISO 8601 standard

ISO is the abbreviation for the International Organization for Standardization, an international non-governmental organization for issuing various standards. ISO 8601 is an international standard for the text representation of date and time. It is used for the correct date and time data communication and is country-independent.

**This standard defines the notation for dates, times, time zones, and time intervals.**

There are 2 categories of notations:
1. the basic notation, where the minimum required number of characters is used
2. the extended notation, which is more human-friendly.

## The ISO 8601 date and time representation

A date is formatted as `YYYY-MM-DD` (**extended**) or `YYYYMMDD` (**basic**), where `Y` denotes the year digits, `M` denotes the month digits, and `D` denotes the day digits. For example:

```kotlin
2000-01-01
2001-12-31
20100207
20121120
```

Time is formatted as `Thh:mm:ss.fff` (**extended**), `Thh:mm:ss` (**basic**), `Thhmmss`(**basic**) or `Thhmmss.fff` (**extended**)

where 
- `T` is used as an indicator that the string that follows represents time.
- `h` denotes the hour digits
- `m` the minutes digits
- `s` the seconds
- `f` the seconds' decimal digits (depending on the accuracy)

> [!NOTE]
>  Also, note that midnight may only be referred as 00:00:00 and not 24:00:00

```bash
T12:00:15
T120015
T14:01:34.55
14:01:34.55
T170517.3432
T00:00:00
00:00:00
```

The time zone indicator is formatted as `Z` (for UTC standard time), `±hh:mm`, `±hhmm`, or `±hh`

> [!NOTE]
> All time data have a fixed number of digits, and if the actual numbers have less digits, then they have to be padded with leading zeros. For example, the correct date format is 2022-02-02 and not 2022-2-2.

Date and time together are represented in the format of `<date>T<time><time zone indicator>`. The time indicator `T` cannot be omitted here, while the time zone indicator is optional.

Following are some examples of the ISO 8601 date-time representation:

```bash
2022-02-16T16:31:03+02:00
2022-02-16T16:31:03Z
20220216T163103Z
```

## The ISO 8601 duration representation

Time duration is represented as `P<n>Y<n>M<n>DT<n>H<n>M<n>S`

where 

- `P` denotes that this string represents time duration
- `Y` denotes years
- `M` months
- `D` days
- `T` is the days-time divider
- `H` denotes hours
- the `M` after `T` denotes minutes
- `S` – seconds.
- `<n>` denotes the value of the time element that follows it.

```bash
P2Y11M5DT4H10M3S
```
The string denotes the duration of 2 years, 11 months, 5 days, 4 hours, 10 minutes, and 3 seconds.

If the value of a time item is zero, it can be omitted. For example:

```bash
P4Y      Duration of 4 years
PT3H5M   Duration of 3 hours and 5 minutes
P7DT6H   Duration of 7 days and 6 hours
```
The last item may also have decimal digits. For example:

```kotlin
P12.5Y         Duration of 12.5 years
PT2H3M10.23S   Duration of 2 hours, 3 minutes and 10.23 seconds
P2M7.3D        Duration of 2 months and 7.3 days
```

## The ISO 8601 time interval representation

Time intervals can be expressed in the following formats:
1. `<Starting date-time>/<Ending date-time>`

For example:
```bash
2022-12-01T00:00:00Z/2022-12-31T23:59:59Z
2000-01-01T00:00:00+03:00/2011-01-01T00:00:00+03:00
2022-02-01T14:00:00-05:00/2022-02-01T14:15:59-05:00
```
2. `<Starting date-time>/<Duration>`

For example:

```bash
2000-01-01T00:00:00Z/P3Y10M4DT2H11M13S
2012-07-19T17:12:00Z/PT35M
111
```

3. `<Duration>/<Ending date-time>`

For example:

```bash
P1Y1M2DT21H9M7S/2000-01-01T00:00:00Z
P3Y/2021-01-01T01:00:00Z
```