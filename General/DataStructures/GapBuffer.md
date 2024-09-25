# Gap Buffer

Gap Buffer is an efficient data structure used in text editors to handle character insertion and deletion operations. It maintains a gap in a buffer, allowing quick editing operations near the cursor position.

## Main Idea:

Instead of storing a text sequence as a contiguous array, Gap Buffer maintains a gap inside the array. This gap acts as a buffer, allowing new characters to be inserted at the current cursor position without shifting other elements in the array.

## Operations:

### 1. Initialization

- Initially, the Gap Buffer is created with a fixed-size array, and the gap is placed at the start of the array.

### 2. Left side

- Moves the gap left by shifting the characters.
- Updates the `gap_left` and `gap_right` indices.

### 3. Right side

- Moves the gap right by shifting the characters.
- Updates the `gap_left` and `gap_right` indices.

### 2. Growth

- Expands the gap when there isn't enough space to insert a character.
- Creates a new gap in the buffer at the specified position and shifts the characters after that position.

### 3. Insertion

- When inserting a character, if the current cursor is not within the gap, the gap is moved to the cursor's position.
- The new character is inserted at the start of the gap, and the gap's size decreases by 1.
- If the gap becomes empty, the array is expanded to create more space.

### 4. Deletion

- When deleting a character, if the current cursor is not within the gap, the gap is moved to the cursor's position.
- The character at the cursor's position is deleted, and the gap's size increases by 1.

### 5. Cursor Movement

- Moving the cursor left or right is done by adjusting the gap's position. (Controls the position of the gap by determining if the cursor is to the left or right of gap_left, deciding whether to move the gap left or right.)

## Example:


Suppose we have a Gap Buffer with an initial size of 10, and the gap has a size of 5:

```mathematica
_ _ _ _ _ A B C D E
^        ^
gap_left gap_right
```

- `gap_left` points to the beginning of the gap.
- `gap_right` points to the end of the gap.

If we insert the string "HELLO" at the current cursor position, the result will be:

```mathematica
H E L L O A B C D E
^           ^
gap_left    gap_right
```

## Advantages:

- Efficient insertion/deletion: Inserting and deleting characters at the cursor's position has a time complexity of `O(1)` in the best case and `O(n)` in the worst case (when the gap needs to be moved).

- Easy to implement: The algorithm is relatively simple to understand and implement.

## Disadvantages

- Expensive gap movement: In the worst case, moving the gap can take O(n) time.
- Fixed array size: The array size must be predetermined, which can lead to memory wastage if the text is too short or require expansion if the text is too long.

## Kotlin code example

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

Output:

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