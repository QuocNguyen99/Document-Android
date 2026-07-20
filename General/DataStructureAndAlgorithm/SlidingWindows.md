# Sliding Window Algorithm

## Introduction
The Sliding Window is a common technique in programming used to optimize algorithms related to arrays or strings, especially when dealing with consecutive subarrays or substrings. This technique helps reduce the complexity from O(n * m) (when using two loops) to O(n) (with just a single loop).

## How It Works
Sliding Window uses a "window" with a fixed size to cover a segment of elements in an array or string. The window slides gradually from left to right while maintaining its size. Instead of recalculating the entire value for each new window, we only update the changes as the window moves.

## Example: "Birthday Chocolate" Problem

### Problem Description
Given an array `s[]` representing the size of chocolate pieces on a bar, a value `d` representing the sum of a segment of chocolate pieces you want to select, and `m` as the number of consecutive pieces to be chosen. The task is to count how many ways you can select consecutive segments where the sum of the pieces equals `d`.

### Implementation Using Sliding Window Algorithm

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