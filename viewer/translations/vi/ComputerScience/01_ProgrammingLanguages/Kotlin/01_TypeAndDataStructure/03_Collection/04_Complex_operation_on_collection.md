# Gấp và giảm

Với `fold()` và `reduce()`, chúng ta có thể thao tác trên các phần tử của collection dưới dạng một chuỗi và trả về kết quả tích lũy.

- `fold()` lấy giá trị ban đầu, sử dụng giá trị đó làm giá trị tích lũy ở bước đầu tiên và áp dụng thao tác từ trái sang phải kết hợp giá trị tích lũy hiện tại với từng phần tử. **giá trị ban đầu sẽ là giá trị mặc định với collection trống. Chúng ta có thể thay đổi loại giá trị trả về nhờ triển khai hàm này.**

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)
    val sum = list.fold(0) { acc, i ->
        println("acc: $acc, i: $i, acc + i: ${acc + i}")
        acc + i
    }
    println(sum) // 15
    val product = list.fold(1) { acc, i ->
        println("acc: $acc, i: $i, acc * i: ${acc * i}")
        acc * i
    }
    println(product)

    // empty list
    val emptyList = listOf<Int>()

    // fold uses the parameter as the initial value of the accumulator
    val sum1 = emptyList.fold(0) { acc, i ->
        println("acc: $acc, i: $i, acc + i: ${acc + i}") // this line will not run
        acc + i
    }
    println(sum1) // 0


    val string = list.fold(StringBuilder()) { acc, s ->
        acc.append(s)
    }
    println(string) //12345
}
```
đầu ra
```bash
acc: 0, i: 1, acc + i: 1
acc: 1, i: 2, acc + i: 3
acc: 3, i: 3, acc + i: 6
acc: 6, i: 4, acc + i: 10
acc: 10, i: 5, acc + i: 15
15
acc: 1, i: 1, acc * i: 1
acc: 1, i: 2, acc * i: 2
acc: 2, i: 3, acc * i: 6
acc: 6, i: 4, acc * i: 24
acc: 24, i: 5, acc * i: 120
120
0
12345
```

- `reduce()` chuyển đổi collection nhất định thành một kết quả duy nhất. Cần có toán tử hàm lambda để kết hợp một cặp phần tử thành một giá trị tích lũy. Sau đó, nó lặp qua collection và thực hiện thao tác từng bước kết hợp giá trị tích lũy với phần tử tiếp theo trong collection.

```kotlin
// reduce uses the first element as the initial value of the accumulator
val sum = list.reduce { acc, i ->
    println("acc: $acc, i: $i, acc + i: ${acc + i}")
    acc + i
}
println(sum) // 15
product = list.reduce { acc, i ->
    println("acc: $acc, i: $i, acc * i: ${acc * i}")
    acc * i
}
println(product) // 120
```
đầu ra
```bash
acc: 1, i: 2, acc + i: 3
acc: 3, i: 3, acc + i: 6
acc: 6, i: 4, acc + i: 10
acc: 10, i: 5, acc + i: 15
15
acc: 1, i: 2, acc * i: 2
acc: 2, i: 3, acc * i: 6
acc: 6, i: 4, acc * i: 24
acc: 24, i: 5, acc * i: 120
120
```


`reduce` **thực hiện ít hơn một bước vì bộ tích lũy là phần tử đầu tiên.**.

> [!CAUTION]
> giảm sẽ đưa ra một ngoại lệ nếu được thực hiện trên collection trống. 
> Kết quả của thao tác rút gọn sẽ luôn cùng loại (hoặc siêu loại) với dữ liệu đang được rút gọn – chúng ta không thể thay đổi nó sang loại khác.


```kotlin
    // empty list
    val emptyList = listOf<Int>()

    // reduce uses the first element as the initial value of the accumulator
    // Throws exception: Empty collection can't be reduced.
    val sum = emptyList.reduce { acc, i ->
        println("acc: $acc, i: $i, acc + i: ${acc + i}")
        acc + i
     }
     println(sum)

    // with reduce you can't change the type of the accumulator. Compiler error
    val string2 = list2.reduce(StringBuilder()) { acc, s ->
       acc.append(s)
    }
```

## Đảo ngược thứ tự

Đôi khi, chúng ta cần thực hiện các hành động theo thứ tự ngược lại. Chúng ta có thể sử dụng `foldRight()` và `reduceRight()` để áp dụng các thao tác từ phải sang trái. Tuy nhiên, hãy nhớ rằng các đối số hoạt động thay đổi thứ tự của chúng: đầu tiên là phần tử và sau đó là giá trị tích lũy.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)

    // foldRight, use the parameter as the initial value of the accumulator.
    // from right to left
    val sum = list.foldRight(0) { i, acc -> acc + i }
    println(sum) // 15
    product = list.foldRight(1) { i, acc -> acc * i }
    println(product) // 120
    
    // reduceRight, use the last element as the initial value of the accumulator
    // from right to left
    sum = list.reduceRight { i, acc -> acc + i }
    println(sum) // 15
    product = list.reduceRight { i, acc -> acc * i }
    println(product) // 120
}
```

## Tích lũy kết quả với các chỉ số

Trong một số tác vụ, bạn có thể cần sử dụng chỉ mục để thực hiện phép tính. Bạn có thể áp dụng các thao tác lấy chỉ số phần tử làm tham số. Kotlin có `reduceIndexed()` và `foldIndexed()`, sử dụng chỉ mục làm tham số đầu tiên. Ngoài ra, chúng ta có thể sử dụng `reduceRightIndexed()` và `foldRightIndexed()` để thực hiện biểu mẫu hành động từ phải sang trái.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)
   
    // foldIndexed and FoldRightIndexed are similar to Fold and FoldRight,
    // but they have an additional parameter to indicate the index of the element to fold
    // sum of even elements
    val sum = list.foldIndexed(0) { index, acc, i ->
        if (index % 2 == 0) acc + i else acc
    }
    println(sum) // 9
    
    // product of odd elements right to left
    product = list.foldRightIndexed(1) { index, i, acc ->
        if (index % 2 == 1) acc * i else acc
    }
    println(product) // 8

    // reduceIndexed and ReduceRightIndexed are similar to Reduce and ReduceRight,
    // but they have an additional parameter to indicate the index of the element to reduce
    // sum of even elements
    var sum = list.reduceIndexed { index, acc, i ->
        if (index % 2 == 0) acc + i else acc
    }
    println(sum) // 9
    
    // product of odd elements right to left
    product = list.reduceRightIndexed { index, i, acc ->
        if (index % 2 == 1) acc * i else acc
    }
    println(product) // 40
}
```

## Làm việc với các bộ sưu tập có thể rỗng

**Tất cả các thao tác rút gọn mà chúng tôi đã trình bày đều tạo ra một ngoại lệ đối với các bộ sưu tập trống**. Nếu muốn nhận giá trị rỗng, chúng ta phải sử dụng các phương pháp tương tự nhưng kết thúc bằng `*OrNull()`: `reduceOrNull()`, `reduceRightOrNull()`, `reduceIndexedOrNull()` và `reduceRightIndexedOrNull()`.

```kotlin
fun main() {
    
    // fold and reduce with empty collections
    val sum = emptyList<Int>().fold(0) { acc, i -> acc + i }
    println(sum) // 0
    
    // sum = emptyList<Int>().reduce { acc, i -> acc + i } // exception
    // println(sum)
    sum = emptyList<Int>().reduceOrNull { acc, i -> acc + i } ?: 0 // is null
    println(sum) // 0

}
```

### Tích lũy với kết quả trung gian

Cuối cùng, trong một số trường hợp, việc lưu giá trị trung gian của bộ tích lũy là điều thú vị. Với mục đích này, chúng tôi có `runningFold()`, `runningReduce()`, `runningFoldIndexed()` và `runningReduceIndexed()`, trả về một danh sách có kết quả trung gian.

```kotlin
fun main() {
    val list = listOf(1, 2, 3, 4, 5)
  
    println("runningFold and runningReduce")
    
    // runningFold and RunningReduce are similar to Fold and Reduce,
    // but they return a list of intermediate results
    val runningSum = list.runningFold(0) { acc, i -> acc + i }
    println(runningSum) // [0, 1, 3, 6, 10, 15]
}
```

## Mã zip

Nén là một thao tác cho phép chúng ta lấy một cặp dựa trên hai phần tử chiếm cùng một vị trí trong hai bộ sưu tập khác nhau. Bằng cách này, bạn có thể nhận được các cặp collection sau khi áp dụng `zip()`.

> [!NOTE]
> Nếu bộ sưu tập gốc không có cùng kích thước, kết quả sẽ là danh sách các cặp được giới hạn ở kích thước của collection nhỏ hơn, bỏ qua các phần tử còn lại của bộ sưu tập lớn hơn.

## Giải nén

Giải nén giúp chúng ta thực hiện phép biến đổi ngược lại. Với một cặp collection, bạn có thể chuyển đổi nó thành hai bộ sưu tập với `unzip()`. Cái đầu tiên sẽ có các phần tử đầu tiên của cặp, cái thứ hai – phần tử thứ hai.


### Ví dụ nén và giải nén
```kotlin
fun main() {
    val listNumbers = listOf(1, 2, 3, 4, 5)
    val listStrings = listOf("one", "two", "three", "four", "five")

    // Zipping
    val zipped = listNumbers.zip(listStrings)
    println(zipped) // [(1, one), (2, two), (3, three), (4, four), (5, five)]

    // Unzipping
    val unzipped = zipped.unzip()
    println(unzipped) // ([1, 2, 3, 4, 5], [one, two, three, four, five])

    // Zipping with different length
    val numbers = listOf(1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
    // other way to call zip function
    val zippedWithDifferentLength = numbers.zip(listStrings)
    // ignore the rest of numbers
    println(zippedWithDifferentLength) // [(1, one), (2, two), (3, three), (4, four), (5, five)]

    // Zipping with transform
    val zippedWithTransform = numbers.zip(listStrings) { number, string ->
        "$number - $string"
    }
    println(zippedWithTransform) // [1 - one, 2 - two, 3 - three, 4 - four, 5 - five]
}
```

## Kết hợp

Phương thức `associateWith()` cho phép chúng ta thu được bản đồ trong đó các phần tử là khóa. Các giá trị bản đồ thu được với sự trợ giúp của hàm biến đổi. Nếu hai mục giống nhau thì chỉ một trong số chúng sẽ có trên `Map`.

Phương thức `associateBy()` cung cấp cho chúng ta cách tạo bản đồ trong đó các phần tử của collection là các giá trị. Chìa khóa có được nhờ sự trợ giúp của hàm biến đổi. Nếu hai mục có cùng khóa thì chỉ một mục sẽ có trên `Map`.

Bạn cũng có thể lấy bản đồ trong đó khóa hoặc giá trị được lấy từ các phần tử của collection nhờ hàm `associate()`. Hàm này lấy một lambda trả về một Cặp tương ứng với mục nhập bản đồ. **Bạn nên sử dụng nó một cách cẩn thận – khi hiệu suất không quan trọng và khi bạn không thể sử dụng các tùy chọn khác.**


```kotlin
fun main() {

    val listStrings = listOf("one", "two", "three", "four", "five")

    // Associate With
    val associatedWith = listStrings.associateWith { it.length }
    println(associatedWith) // {one=3, two=3, three=5, four=4, five=4}

    // Associate By
    val associatedBy = listStrings.associateBy { it.first().uppercase() }
    println(associatedBy) // {O=one, T=three, F=five}

    // Associate with a lambda
    val associatedWithLambda = listStrings.associate {
        it.first().uppercase() to it.length
    }
    println(associatedWithLambda) // {O=3, T=5, F=4}
}
```




