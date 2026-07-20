# Lớp lồng nhau và lớp bên trong

Lớp lồng nhau là lớp được khai báo bên trong một lớp khác.
Chúng giúp chúng ta nhóm các lớp một cách hợp lý và tăng encapsulation cho mã của chúng ta.

Ví dụ:

```kotlin
class Superhero {
    class MagicCloak {
    }

    class Hammer {
    }
}
```

Cả hai lớp `MagicCloak` và `Hammer` đều là các lớp lồng nhau. 
Lớp `Superhero` thường được gọi là lớp bên ngoài, trong khi lớp lồng nhau, cùng với các thuộc tính, hàm và hàm tạo của nó, là thành viên của lớp bên ngoài.

Vấn đề ở đây là `MagicCloak` và `Hammer` không thực sự bị ràng buộc với `Superhero`.
Nếu bạn cần sử dụng `MagicCloak` và `Hammer` bên ngoài lớp `Superhero`, bạn phải tạo các đối tượng tương ứng:

```kotlin
val cloak = Superhero.MagicCloak()
val hammer = Superhero.Hammer()
```

## Lớp bên trong

Chúng ta sẽ tập trung vào một trường hợp đặc biệt của **các lớp lồng nhau** — các lớp bên trong.

Một lớp lồng nhau thông thường không thể truy cập các thành viên của lớp bên ngoài của nó. Nhưng một lớp lồng nhau được đánh dấu là lớp `inner` thì có thể.

Ví dụ:

```kotlin
class Cat(val name: String) {
    inner class Bow(val color: String) {
        fun printColor() {
            println("The cat named $name has a $color bow.") // access members of its outer class   
        }
    }
}

fun main() {
    val cat: Cat = Cat("Bob")
    val bow: Cat.Bow = cat.Bow("red")

    bow.printColor()
}
```

## Phạm vi của lớp bên trong

Bạn có thể gặp các lớp bên trong có các thành viên có cùng tên với lớp bên ngoài của chúng. 
Ví dụ: cả `Cat` và `Bow` đều có thể có thuộc tính `color`. Làm cách nào bạn có thể truy cập các thành viên của lớp bên ngoài từ lớp bên trong trong những trường hợp như vậy? 

**Biểu thức đủ điều kiện này sẽ giúp ích!**

Viết `this@Cat.color` vào mã lớp bên trong và bạn sẽ nhận được màu của lớp bên ngoài, còn sử dụng màu hoặc `this.color` sẽ luôn cung cấp cho bạn thuộc tính màu của lớp hiện tại


### Quy tắc cho các lớp Nội

- Lớp bên trong có thể truy cập tất cả các thành viên của lớp bên ngoài.

- Để truy cập lớp bên trong, trước tiên bạn cần khởi tạo lớp bên ngoài vì các lớp bên trong được liên kết với một thể hiện của lớp kèm theo chúng