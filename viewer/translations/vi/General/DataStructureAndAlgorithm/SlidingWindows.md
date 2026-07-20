# Thuật toán cửa sổ trượt

## Giới thiệu
Cửa sổ trượt là một kỹ thuật phổ biến trong lập trình được sử dụng để tối ưu hóa các thuật toán liên quan đến mảng hoặc chuỗi, đặc biệt khi xử lý các mảng con hoặc chuỗi con liên tiếp. Kỹ thuật này giúp giảm độ phức tạp từ O(n * m) (khi sử dụng hai vòng lặp) xuống O(n) (chỉ với một vòng lặp).

## Nó hoạt động như thế nào
Cửa sổ trượt sử dụng một "cửa sổ" có kích thước cố định để bao phủ một đoạn phần tử trong một mảng hoặc chuỗi. Cửa sổ trượt dần từ trái sang phải trong khi vẫn giữ nguyên kích thước. Thay vì tính toán lại toàn bộ giá trị cho mỗi cửa sổ mới, chúng ta chỉ cập nhật những thay đổi khi cửa sổ di chuyển.

## Ví dụ: Bài toán "Sô cô la sinh nhật"

### Mô tả vấn đề
Cho một mảng `s[]` đại diện cho kích thước của các miếng sô cô la trên một thanh, một giá trị `d` đại diện cho tổng của một đoạn các miếng sô cô la mà bạn muốn chọn và `m` là số lượng các miếng sô cô la liên tiếp được chọn. Nhiệm vụ là đếm xem có bao nhiêu cách bạn có thể chọn các đoạn liên tiếp trong đó tổng các phần bằng `d`.

### Triển khai bằng thuật toán cửa sổ trượt

```kotlin
fun birthdayOptimized(s: Array<Int>, d: Int, m: Int): Int {
    var totalBarCanBeDivided = 0
    var currentSegmentSum = 0
    
    // Calculate the sum of the initial window
    for (i in 0 until m) {
        currentSegmentSum += s[i]
    }
    
    // Check the initial window
    if (currentSegmentSum == d) {
        totalBarCanBeDivided += 1
    }

    // Slide the window over the remaining elements
    for (i in m until s.size) {
        currentSegmentSum = currentSegmentSum - s[i - m] + s[i] // Remove the left element and add the new right element
        if (currentSegmentSum == d) {
            totalBarCanBeDivided += 1
        }
    }
    
    return totalBarCanBeDivided
}

fun main(args: Array<String>) {
    val n = readLine()!!.trim().toInt()
    val s = readLine()!!.trimEnd().split(" ").map{ it.toInt() }.toTypedArray()
    val first_multiple_input = readLine()!!.trimEnd().split(" ")
    val d = first_multiple_input[0].toInt()
    val m = first_multiple_input[1].toInt()

    val result = birthday(s, d, m)
    println(result)
}