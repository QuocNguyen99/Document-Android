# Kiểm tra tham số

Giả sử chúng ta có: 

```kotlin
class Calculator {
    fun maxOf(a: Int, b: Int): Int {
        return if (a >= b) {
            a
        } else {
            b
        }
    }
}
```
Chúng tôi cũng sẽ viết các bài kiểm tra cần thiết để đảm bảo rằng phương pháp này hoạt động chính xác. 

Chúng ta cần kiểm tra ba trường hợp:
- khi đối số thứ nhất lớn hơn đối số thứ hai
- khi đối số thứ nhất nhỏ hơn đối số thứ hai
- khi cả hai đối số đều bằng nhau.

```kotlin
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class CalculatorTest {
    @Test
    fun testMaxFirstArgGreaterThanSecondArg() {
        val calculator = Calculator()
        val result = calculator.maxOf(2, 1)
        val expected = 2
        assertEquals(expected, result)
    }

    @Test
    fun testMaxFirstArgLessThanSecondArg() {
        val calculator = Calculator()
        val result = calculator.maxOf(1, 2)
        val expected = 2
        assertEquals(expected, result)
    }

    @Test
    fun testMaxFirstArgEqualToSecondArg() {
        val calculator = Calculator()
        val result = calculator.maxOf(2, 2)
        val expected = 2
        assertEquals(expected, result)
    }
}
```

Bây giờ, hãy chạy các thử nghiệm này để đảm bảo rằng việc triển khai phương pháp `maxOf` của chúng tôi vượt qua thành công tất cả các thử nghiệm. 

## Cài đặt

Trước tiên, hãy thêm phần phụ thuộc sau vào dự án của chúng ta để JUnit có thể hoạt động với các thử nghiệm được tham số hóa.

```kotlin
dependencies {
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.9.0")
}
```

## @ParameterizedTest

`@ParameterizedTest` cho phép chúng ta gọi một phương thức thử nghiệm nhiều lần, chuyển các đối số khác nhau cho nó. 


```kotlin
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.CsvSource

internal class CalculatorTest {
    @ParameterizedTest
    @CsvSource("2, 1, 2", "1, 2, 2", "1, 1, 1")
    fun testMax(first: Int, second: Int, expected: Int) {
        val calculator = Calculator()
        val result = calculator.maxOf(first, second)
        assertEquals(expected, result)
    }
}
```

Chú thích `@CsvSource` để cung cấp một loạt các đối số như vậy.

JUnit có nhiều chú thích cho các nguồn đối số khác nhau, chẳng hạn như `@ValueSource`, `@EnumSource`, `@MethodSource`, `@CsvSource`, `@CsvFileSource` và `@ArgumentsSource`, một số trong đó chúng ta sẽ thảo luận bên dưới.

## Nguồn lập luận

### @ValueSource

`@ValueSource` là nguồn đối số cung cấp một mảng các giá trị bằng chữ cho các phương thức thử nghiệm với một tham số duy nhất. 


```kotlin
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource

internal class CalculatorTest {

    @ParameterizedTest
    @ValueSource(ints = [0, 2, 4, 1000])
    fun testIsEven(arg: Int) {
        assertTrue(Calculator().isEven(arg))
    }
}
```

Đối với các loại không nguyên thủy, bạn có thể sử dụng chú thích `@EmptySource`, `@NullSource` hoặc `@NullAndEmptySource` để chuyển `null` và các giá trị trống.


```kotlin

internal class CalculatorTest {

    @ParameterizedTest
    @EmptySource
    fun testEmpty(arg: IntArray) {
        assertEquals(0, arg.size)
    }

    @ParameterizedTest
    @NullAndEmptySource
    fun testNullAndEmpty(arg: List<String?>?) {
        assertTrue(arg == null || arg.isEmpty()) // we can also write this line 
                                                 // assertTrue(arg.isNullOrEmpty())
    }
}
```

### @MethodSource

Mỗi phương thức như vậy phải đáp ứng các yêu cầu sau: nó không được chấp nhận bất kỳ đối số nào và phải trả về một luồng, một mảng hoặc collection của các đối số.

```kotlin
import junit.framework.TestCase.assertFalse
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.MethodSource

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class CalculatorTest {

    @ParameterizedTest
    @MethodSource("stringFactory")
    fun testStrings(str: String) {
        assertFalse(str.isEmpty())
    }

    fun stringFactory(): List<String>? {
        return listOf("apple", "banana", "lemon", "orange")
    }
}
```

Nếu một phương thức kiểm tra được tham số hóa có nhiều tham số thì phương thức nguồn đối số của bạn cần trả về collection, một luồng hoặc một mảng `Arguments` hoặc một mảng `Object`:

```kotlin
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.Arguments
import org.junit.jupiter.params.provider.Arguments.arguments
import org.junit.jupiter.params.provider.MethodSource

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class CalculatorTest {

    @ParameterizedTest
    @MethodSource("argFactory")
    fun testStringLength(str: String, length: Int) {
        assertEquals(length, str.length)
    }

    fun argFactory(): List<Arguments?>? {
        return listOf(arguments("apple", 5), arguments("watermelon", 10))
    }
}
```

## Làm việc với CSV

Nó cho phép bạn cung cấp danh sách các đối số dưới dạng các giá trị được phân tách bằng dấu phẩy

```kotlin
@CsvSource({ "apple, 5", "strawberry, 10", "cherry, 6" })
```

JUnit có chú thích `@CsvFileSource`, được sử dụng để tải tệp CSV từ đường dẫn lớp hoặc hệ thống tệp cục bộ


## Và đây là ví dụ về chú thích @CsvFileSource:

```kotlin
@CsvFileSource(resources = "/dataset.csv", numLinesToSkip = 1)
```












