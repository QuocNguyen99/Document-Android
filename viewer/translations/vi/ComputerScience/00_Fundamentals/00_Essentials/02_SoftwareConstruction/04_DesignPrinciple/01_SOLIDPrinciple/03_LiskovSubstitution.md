# Nguyên tắc thay thế Liskov

Nguyên tắc thay thế Liskov nêu rõ rằng các lớp con phải có thể thay thế được cho các lớp cơ sở của chúng. Điều đó có thể thay thế các đối tượng lớp cơ sở mà không ảnh hưởng đến tính chính xác của chương trình.

## Mẹo tránh vi phạm Nguyên tắc thay thế Liskov

### 1. Đảm bảo các phương thức của lớp con duy trì hành vi của siêu lớp

Một lớp con không được thay đổi ý nghĩa của một phương thức được kế thừa.
Nếu một lớp con ghi đè một phương thức, nó vẫn phải thực hiện một chức năng tương tự thay vì thay đổi hoàn toàn logic.

Ví dụ không chính xác:

```java
class Bird {
    void fly() {
        System.out.println("I'm flying");
    }
}

class Penguin extends Bird {
    @Override
    void fly() {
        throw new UnsupportedOperationException("Penguins can't fly!");
    }
}
```
Vấn đề: `Penguin` không thể thay thế `Bird` vì nó không hỗ trợ bay.

Thay vì kế thừa từ `Bird`, hãy trích xuất giao diện `Flyable` để chỉ những loài chim có thể bay mới thực hiện được giao diện đó.

```java
interface Flyable {
    void fly();
}

class Bird { }

class Sparrow extends Bird implements Flyable {
    @Override
    public void fly() {
        System.out.println("I'm flying");
    }
}

class Penguin extends Bird { }
```

### 2. Tránh những thay đổi trạng thái hoặc hành vi không mong muốn

```java
class Rectangle {
    protected int width, height;

    void setWidth(int w) { width = w; }
    void setHeight(int h) { height = h; }
    int getArea() { return width * height; }
}

class Square extends Rectangle {
    @Override
    void setWidth(int w) {
        super.width = w;
        super.height = w;  // ❌ Height is also changed
    }

    @Override
    void setHeight(int h) {
        super.width = h;  
        super.height = h;  // ❌ Width is also changed
    }
}
```

Vấn đề:

Nếu chúng tôi sử dụng `Rectangle rect = new Square();`, việc sửa đổi `width` hoặc `height` sẽ không hoạt động như mong đợi, gây ra lỗi.

Thay vì kế thừa từ `Rectangle`, hãy tạo các lớp riêng biệt hoặc sử dụng giao diện.

### 3. Sử dụng Composition thay vì Inheritance khi cần thiết



```java
class Engine {
    void start() { System.out.println("Engine started"); }
}

class Car extends Engine { } // ❌ Car is not an Engine
```

Nếu một lớp con không thực sự có thể thay thế cho siêu lớp của nó thì nên sử dụng Composition thay vì inheritance.
```java
class Car {
    private Engine engine = new Engine();
    
    void startCar() {
        engine.start();
    }
}
```

### 4. Áp dụng Interface Segregation để tránh inheritance không đúng

Nếu một lớp con không cần tất cả các phương thức của lớp cha của nó, hãy chia các giao diện ra.

Ví dụ sai:

```java
interface Animal {
    void eat();
    void fly();  // ❌ Not all animals can fly
}

class Dog implements Animal {
    @Override
    public void eat() { System.out.println("Dog eats"); }

    @Override
    public void fly() { throw new UnsupportedOperationException("Dogs can't fly!"); } // ❌
}
```

 Sự cố: `Dog` không thể bay nhưng buộc phải triển khai `fly()`.

```java
interface Eatable { void eat(); }
interface Flyable { void fly(); }

class Dog implements Eatable {
    @Override
    public void eat() { System.out.println("Dog eats"); }
}

class Bird implements Eatable, Flyable {
    @Override
    public void eat() { System.out.println("Bird eats"); }
    
    @Override
    public void fly() { System.out.println("Bird flies"); }
}
```







