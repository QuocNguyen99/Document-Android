# Bộ đệm khoảng cách

Bộ đệm khoảng cách là một data structure hiệu quả được sử dụng trong trình soạn thảo văn bản để xử lý các thao tác chèn và xóa ký tự. Nó duy trì một khoảng trống trong bộ đệm, cho phép thực hiện các thao tác chỉnh sửa nhanh chóng ở gần vị trí con trỏ.

## Ý chính:

Thay vì lưu trữ chuỗi văn bản dưới dạng mảng liền kề, Bộ đệm khoảng cách duy trì một khoảng trống bên trong mảng. Khoảng trống này hoạt động như một bộ đệm, cho phép chèn các ký tự mới vào vị trí con trỏ hiện tại mà không làm dịch chuyển các phần tử khác trong mảng.

## Thao tác:

### 1. Khởi tạo

- Ban đầu, Gap Buffer được tạo với một mảng có kích thước cố định và khoảng trống được đặt ở đầu mảng.

### 2. Bên trái

- Di chuyển khoảng trống sang trái bằng cách dịch chuyển các ký tự.
- Cập nhật chỉ số `gap_left` và `gap_right`.

### 3. Bên phải

- Di chuyển khoảng cách sang phải bằng cách dịch chuyển các ký tự.
- Cập nhật chỉ số `gap_left` và `gap_right`.

### 2. Tăng trưởng

- Mở rộng khoảng cách khi không đủ khoảng trống để chèn ký tự.
- Tạo một khoảng trống mới trong bộ đệm tại vị trí đã chỉ định và dịch chuyển các ký tự sau vị trí đó.

### 3. Chèn

- Khi chèn ký tự, nếu con trỏ hiện tại không nằm trong khoảng trống thì khoảng cách đó sẽ được di chuyển về vị trí của con trỏ.
- Ký tự mới được chèn vào đầu khoảng trống và kích thước của khoảng trống giảm đi 1.
- Nếu khoảng trống trở nên trống, mảng sẽ được mở rộng để tạo thêm không gian.

### 4. Xóa

- Khi xóa một ký tự, nếu con trỏ hiện tại không nằm trong khoảng trống thì khoảng cách đó sẽ được di chuyển đến vị trí của con trỏ.
- Ký tự ở vị trí con trỏ bị xóa và kích thước của khoảng cách tăng thêm 1.

### 5. Di chuyển con trỏ

- Di chuyển con trỏ sang trái hoặc phải được thực hiện bằng cách điều chỉnh vị trí của khoảng trống. (Kiểm soát vị trí của khoảng trống bằng cách xác định xem con trỏ ở bên trái hay bên phải của khoảng cách_left, quyết định xem nên di chuyển khoảng trống sang trái hay phải.)


## Thuận lợi:

- Chèn/xóa hiệu quả: Việc chèn và xóa các ký tự tại vị trí con trỏ có độ phức tạp về thời gian là `O(1)` trong trường hợp tốt nhất và `O(n)` trong trường hợp xấu nhất (khi cần di chuyển khoảng cách).

- Dễ thực hiện: Thuật toán tương đối đơn giản để hiểu và thực hiện.

## Nhược điểm

- Di chuyển khoảng trống tốn kém: Trong trường hợp xấu nhất, việc di chuyển khoảng trống có thể mất O(n) thời gian.
- Kích thước mảng cố định: Kích thước mảng phải được xác định trước, điều này có thể dẫn đến lãng phí bộ nhớ nếu văn bản quá ngắn hoặc yêu cầu mở rộng nếu văn bản quá dài.

## Ví dụ về mã Kotlin

```kotlin
/**
 * You can edit, run, and share this code.
 * play.kotlinlang.org
 */
class GapBufferExample {
    companion object {
        private val buffer = CharArray(50) // The character buffer
        private var gapSize = 10 // Size of the gap
        private var gapStartIndex = 0 // Start index of the gap
        private var gapEndIndex = gapSize - gapStartIndex - 1 // End index of the gap
        private var currentBufferSize = 10 // Current size of the buffer

        // Function to grow the gap at the specified position
        private fun expandGap(newGapSize: Int, position: Int) {
            val tempArray = CharArray(currentBufferSize)
			println("Create tempArray with size = currentBufferSize (${currentBufferSize})")
            // Copy characters of buffer to tempArray after position
            for (i in position until currentBufferSize) {
                tempArray[i - position] = buffer[i]
                println("[expandGap] set tempArray[i(${i}) - position(${position})] = buffer[i](${buffer[i]})")
            }

            // Insert a gap of newGapSize from index position
            // The gap is represented by '_'
            for (i in 0 until newGapSize) {
                buffer[i + position] = '_'
                println("[expandGap]set buffer[i(${i}) + position(${position})] = _ ")
            }

            // Reinsert the remaining array
            for (i in 0 until newGapSize) {
                buffer[position + newGapSize + i] = tempArray[i]
                println("[expandGap] set buffer[position(${position}) + newGapSize(${newGapSize}) + i(${i})}] = tempArray[i](value = '${tempArray[i]}' with i: ${i}) ")
            }

            currentBufferSize += newGapSize // Increase the current size of the buffer
            gapEndIndex += newGapSize // Update the gap end index
            println("[expandGap] set currentBufferSize = ${currentBufferSize}")
            println("[expandGap] set gapEndIndex = ${gapEndIndex}")
        }

        // Function to move the gap left in the array
        private fun moveGapLeft(position: Int) {
            // Move the gap left character by character
            while (position < gapStartIndex) {
                gapStartIndex--
                gapEndIndex--
                buffer[gapEndIndex + 1] = buffer[gapStartIndex]
               	println("[moveGapLeft] set buffer[${gapEndIndex + 1}] = buffer[gapStartIndex(value = ${gapStartIndex})](value = ${buffer[gapStartIndex]})")
                buffer[gapStartIndex] = '_' // Fill the gap
                
                println("[moveGapLeft] set buffer[${gapStartIndex}] = _ to fill the gap")
                
                println()
                println()
                for (i in 0 until currentBufferSize) {
                    print("${buffer[i]} ")
                }
                println()
                println()
            }
        }

        // Function to move the gap right in the array
        private fun moveGapRight(position: Int) {
            // Move the gap right character by character
            while (position > gapStartIndex) {
                gapStartIndex++
                gapEndIndex++
                buffer[gapStartIndex - 1] = buffer[gapEndIndex]
                println("[moveGapRight] set buffer[${gapStartIndex - 1}] = buffer[gapEndIndex(value = ${gapEndIndex})](value = ${buffer[gapEndIndex]})")
                buffer[gapEndIndex] = '_' // Fill the gap
                
                println("[moveGapRight] set buffer[${gapEndIndex}] = _")
                
                println()
                println()
                for (i in 0 until currentBufferSize) {
                    print("${buffer[i]} ")
                }
                println()
                println()
            }
        }

        // Function to control the movement of the gap
        private fun positionCursor(position: Int) {
            if (position < gapStartIndex) {
                println("[positionCursor] Because position < gapStartIndex so moveGapLeft")
                moveGapLeft(position)
            } else {
                println("[positionCursor] Because position >= gapStartIndex so moveGapLeft")
                moveGapRight(position)
            }
        }

        // Function to insert the string into the buffer at the specified position
        private fun insertString(input: String, position: Int) {
            val inputLength = input.length
            var i = 0
			var currPosition = position
            // If the point is not in the gap, check and move the cursor to that point
            if (currPosition != gapStartIndex) {
                println("[insertString] the point is not in the gap. move cursor to that point")
                positionCursor(currPosition)
            }

            // Insert characters one by one
            while (i < inputLength) {
                // If the gap is empty, grow the size
                if (gapEndIndex == gapStartIndex) {
                    val newGapSize = 10
                    println("Because gapEndIndex = gapStartIndex so the gap is empty, expand the Gap")
                    expandGap(newGapSize, currPosition)
                }

                // Insert the character in the gap and move the gap
                println("Inserting the char in the gap and move the gap: set buffer[${gapStartIndex}] = ${input[i]}")
                buffer[gapStartIndex] = input[i]
                gapStartIndex++
                i++
                currPosition++
                 println()
                println()
                for (i in 0 until currentBufferSize) {
                    print("${buffer[i]} ")
                }
                println()
                println()
            }
        }

        // Driver code
        @JvmStatic
        fun main(args: Array<String>) {
            // Initializing the gap buffer with size 10
            for (i in 0 until 10) {
                buffer[i] = '_'
            }

            println("Initializing the gap buffer with size 10")
			println("this is the current gap buffer: ")
            for (i in 0 until currentBufferSize) {
                print("${buffer[i]} ")
            }

            println()

            // Inserting a string into the buffer
            val input1 = "GEEKSGEEKS"
            var position = 0

            insertString(input1, position)

            println("\nInserting the string into the buffer: $input1")
            println("Output: ")
            for (i in 0 until currentBufferSize) {
                print("${buffer[i]} ")
            }

            val input2 = "FOR"
            position = 5
			println("Starting insert 'FOR' in to the buffer with position 5")
            insertString(input2, position)

            println("\nInserting the string into the buffer: $input2")
            print("Output: ")
            for (i in 0 until currentBufferSize) {
                print("${buffer[i]} ")
            }
        }
    }
}
```

Đầu ra:

```sh
Initializing the gap buffer with size 10
this is the current gap buffer: 
_ _ _ _ _ _ _ _ _ _ 
Inserting the char in the gap and move the gap: set buffer[0] = G


G _ _ _ _ _ _ _ _ _ 

Inserting the char in the gap and move the gap: set buffer[1] = E


G E _ _ _ _ _ _ _ _ 

Inserting the char in the gap and move the gap: set buffer[2] = E


G E E _ _ _ _ _ _ _ 

Inserting the char in the gap and move the gap: set buffer[3] = K


G E E K _ _ _ _ _ _ 

Inserting the char in the gap and move the gap: set buffer[4] = S


G E E K S _ _ _ _ _ 

Inserting the char in the gap and move the gap: set buffer[5] = G


G E E K S G _ _ _ _ 

Inserting the char in the gap and move the gap: set buffer[6] = E


G E E K S G E _ _ _ 

Inserting the char in the gap and move the gap: set buffer[7] = E


G E E K S G E E _ _ 

Inserting the char in the gap and move the gap: set buffer[8] = K


G E E K S G E E K _ 

Because gapEndIndex = gapStartIndex so the gap is empty, expand the Gap
Create tempArray with size = currentBufferSize (10)
[expandGap] set tempArray[i(9) - position(9)] = buffer[i](_)
[expandGap]set buffer[i(0) + position(9)] = _ 
[expandGap]set buffer[i(1) + position(9)] = _ 
[expandGap]set buffer[i(2) + position(9)] = _ 
[expandGap]set buffer[i(3) + position(9)] = _ 
[expandGap]set buffer[i(4) + position(9)] = _ 
[expandGap]set buffer[i(5) + position(9)] = _ 
[expandGap]set buffer[i(6) + position(9)] = _ 
[expandGap]set buffer[i(7) + position(9)] = _ 
[expandGap]set buffer[i(8) + position(9)] = _ 
[expandGap]set buffer[i(9) + position(9)] = _ 
[expandGap] set buffer[position(9) + newGapSize(10) + i(0)}] = tempArray[i](value = '_' with i: 0) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(1)}] = tempArray[i](value = '' with i: 1) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(2)}] = tempArray[i](value = '' with i: 2) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(3)}] = tempArray[i](value = '' with i: 3) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(4)}] = tempArray[i](value = '' with i: 4) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(5)}] = tempArray[i](value = '' with i: 5) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(6)}] = tempArray[i](value = '' with i: 6) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(7)}] = tempArray[i](value = '' with i: 7) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(8)}] = tempArray[i](value = '' with i: 8) 
[expandGap] set buffer[position(9) + newGapSize(10) + i(9)}] = tempArray[i](value = '' with i: 9) 
[expandGap] set currentBufferSize = 20
[expandGap] set gapEndIndex = 19
Inserting the char in the gap and move the gap: set buffer[9] = S


G E E K S G E E K S _ _ _ _ _ _ _ _ _ _ 


Inserting the string into the buffer: GEEKSGEEKS
Output: 
G E E K S G E E K S _ _ _ _ _ _ _ _ _ _ Starting insert 'FOR' in to the buffer with position 5
[insertString] the point is not in the gap. move cursor to that point
[positionCursor] Because position < gapStartIndex so moveGapLeft
[moveGapLeft] set buffer[19] = buffer[gapStartIndex(value = 9)](value = S)
[moveGapLeft] set buffer[9] = _ to fill the gap


G E E K S G E E K _ _ _ _ _ _ _ _ _ _ S 

[moveGapLeft] set buffer[18] = buffer[gapStartIndex(value = 8)](value = K)
[moveGapLeft] set buffer[8] = _ to fill the gap


G E E K S G E E _ _ _ _ _ _ _ _ _ _ K S 

[moveGapLeft] set buffer[17] = buffer[gapStartIndex(value = 7)](value = E)
[moveGapLeft] set buffer[7] = _ to fill the gap


G E E K S G E _ _ _ _ _ _ _ _ _ _ E K S 

[moveGapLeft] set buffer[16] = buffer[gapStartIndex(value = 6)](value = E)
[moveGapLeft] set buffer[6] = _ to fill the gap


G E E K S G _ _ _ _ _ _ _ _ _ _ E E K S 

[moveGapLeft] set buffer[15] = buffer[gapStartIndex(value = 5)](value = G)
[moveGapLeft] set buffer[5] = _ to fill the gap


G E E K S _ _ _ _ _ _ _ _ _ _ G E E K S 

Inserting the char in the gap and move the gap: set buffer[5] = F


G E E K S F _ _ _ _ _ _ _ _ _ G E E K S 

Inserting the char in the gap and move the gap: set buffer[6] = O


G E E K S F O _ _ _ _ _ _ _ _ G E E K S 

Inserting the char in the gap and move the gap: set buffer[7] = R


G E E K S F O R _ _ _ _ _ _ _ G E E K S 


Inserting the string into the buffer: FOR
Output: G E E K S F O R _ _ _ _ _ _ _ G E E K S 
```