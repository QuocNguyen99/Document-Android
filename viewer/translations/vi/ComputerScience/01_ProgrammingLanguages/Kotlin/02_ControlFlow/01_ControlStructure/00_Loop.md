# Vòng lặp


Kotlin cung cấp một số câu lệnh đặc biệt để lặp lại các khối mã nhiều lần. Những câu lệnh này được gọi là vòng lặp

## Vòng lặp: câu lệnh lặp lại

Để sử dụng vòng lặp đơn giản nhất, hãy viết `repeat(n)` và một chuỗi các câu lệnh trong dấu ngoặc nhọn `{...}`. `n` là một số nguyên xác định số lần lặp lại các câu lệnh này.


```kotlin
repeat(n) {
    // statements
}
```

> [!NOTE]
> Nếu n bằng 0 hoặc số âm, Kotlin sẽ bỏ qua vòng lặp. Nếu n bằng 1 thì các câu lệnh sẽ chỉ được thực thi một lần.

## Vòng lặp while

```kotlin
    while (i < 5) {
        println(i)
        i++
    }
```
## Vòng lặp Do...while

Vòng lặp `do...while` được thực thi trước tiên, sau đó chương trình sẽ kiểm tra một điều kiện.

```kotlin
do {
    // body: do something
} while (condition)
```

## Vòng lặp For

Đây là cú pháp của vòng lặp for:
```kotlin
for (element in source) {
    // body of loop
}
```
Lặp lại qua một phạm vi

```kotlin
for (i in 1..4) {
    println(i)    
}
```

Lặp lại theo thứ tự lùi

```kotlin
for (i in 4 downTo 1) {
    println(i)
}
```

> [!NOTE]
> Lưu ý rằng cần phải sử dụng trong 4 downTo 1, không phải trong 4..1, để lặp lại phạm vi theo thứ tự ngược lại.

Không bao gồm giới hạn trên

```kotlin
for (i in 1 until 4) {
    println(i)
}
```

Chỉ định một bước

```kotlin
for (i in 1..7 step 2) {
    println(i)
}
//output
//1
//3
//5
//7

```
Bạn cũng có thể sử dụng nó để lặp lại.

```kotlin
for (i in 7 downTo 1 step 2) {
    println(i)
}
```

Lặp lại thông qua MutableList

```kotlin
for (element in mutList) {
    // body of loop
}
```
Lặp lại theo chỉ mục

```kotlin
for (index in daysOfWeek.indices){
   // body of loop
}

```

## Nhãn

Về mặt kỹ thuật, nó chỉ là một mã định danh có ký hiệu @ ở cuối, ví dụ: `loop@`, `kotlin@`. Bạn có thể sử dụng hầu hết mọi từ với nó, ngoại trừ các từ dành riêng trong Kotlin. Bạn cần nhãn để làm gì? Chà, bạn có thể thêm nhãn của mình vào một vòng lặp:


```kotlin
loop@ for (i in 1..3) { 
    for (j in 1..3) {
        println("i = $i, j = $j")   
        if (j == 3) break@loop  
    }  
}  
```

Cả vòng lặp for bên trong và bên ngoài đều kết thúc ở lần lặp thứ ba. Đầu ra là thế này:

```bash
i = 1, j = 1
i = 1, j = 2
i = 1, j = 3
```





