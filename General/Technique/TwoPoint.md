
# Two Pointers Technique

## Overview
The **Two Pointers** technique is a general approach used to solve problems involving searching or optimizing pairs/subarrays efficiently. It is particularly effective with sorted data, reducing time complexity compared to brute-force methods.

## Concept
Two Pointers involves maintaining two indices (pointers) that traverse an array or sequence from different positions, typically adjusting based on conditions. This technique avoids iterating over all possible pairs.

## Common Use Cases
1. **Finding a pair with a specific sum in a sorted array**: 
   - Use two pointers, one at the start and one at the end, adjusting based on the sum of the current elements.
2. **Merging two sorted arrays**:
   - Use two pointers, one for each array, to merge them efficiently.
3. **Finding the longest subarray/subsequence**:
   - Use two pointers to maintain a sliding window that satisfies certain conditions.

## Example: Finding Two Numbers with a Given Sum
```kotlin
fun findPairWithSum(arr: IntArray, target: Int): Pair<Int, Int>? {
    var left = 0
    var right = arr.size - 1
    while (left < right) {
        val sum = arr[left] + arr[right]
        if (sum == target) return Pair(arr[left], arr[right])
        else if (sum < target) left++
        else right--
    }
    return null
}
```

- **Time complexity**: \(O(n)\)
- **Space complexity**: \(O(1)\)

## When to Use Two Pointers
- Leverage sorted data or when sorting is feasible.
- Problems involving comparisons, pair finding, or subarray optimizations.
- Reduces complexity from \(O(n^2)\) to \(O(n)\) or \(O(n + m)\).

## Advantages
- **Efficiency**: Reduces time complexity significantly.
- **Simplicity**: Easier to implement once the logic is understood.
