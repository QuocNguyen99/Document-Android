# Separation of concerns principle

## Definition
Separation of Concerns có thể hiểu là phân **tách phụ thuộc** hay **chia tách quan hệ**

Tư tưởng của `Separation of Concerns` là phân tách hệ thống ra thành các thành phần, chức năng nhỏ hơn, sao cho chúng càng ít điểm chung (về mặt chức năng), hay càng ít phụ thuộc vào nhau càng tốt. Khi các thành phần được ghép nối vào trong hệ thống, chúng sẽ tương tác với nhau thông qua thông tin về Interface, hay các open API, mà không cần phải biết các thành phần kia được xây dựng như thế nào, bên trong đó được lập trình (implement) ra sao.

Các lợi ích mà Separation of Concerns đem lại thì có rất nhiều, có thể kể ra một vài cái như:
- **Modularity**: SoC encourages breaking down complex systems into smaller, more manageable parts, each addressing a single concern. This modular approach makes it easier to understand, develop, and maintain software systems, as developers can focus on individual components without being overwhelmed by the system as a whole.
- **Maintainability**: By separating concerns, changes and updates to one aspect of the system are less likely to impact other parts. This reduces the risk of unintended side effects and makes it easier to maintain and evolve the software over time. Additionally, when modifications are required, developers can locate and modify the relevant module without affecting the entire system.
- **Scalability**: SoC promotes a design that allows for easy scalability. As the requirements of a system change or grow, new concerns can be addressed by adding or modifying individual modules without necessitating extensive changes to other parts of the system. This flexibility allows software systems to adapt to evolving needs efficiently.
- **Reusability**: Separating concerns often leads to the creation of reusable components. Once a concern has been isolated into a distinct module, it can be reused across different parts of the system or even in entirely different projects. This reduces development time and effort and promotes consistency across applications.
- **Parallel Development**: SoC facilitates parallel development by providing clear boundaries between different parts of the system. Multiple developers can work on separate concerns concurrently without stepping on each other’s toes, leading to more efficient development workflows and shorter time-to-market.
- **Understanding and Debugging**: With concerns separated into distinct modules, it becomes easier to understand and debug software systems. Developers can focus on one concern at a time, isolating and analyzing issues without being distracted by unrelated functionality. This leads to faster diagnosis and resolution of problems.

**Separation of Concerns** là một design principle (nguyên lý thiết kế) phổ biến trong phát triển phẩn mềm, với rất nhiều các thể hiện, có thể rất quen thuộc với các lập trình viên, nhưng họ lại không hay để ý đến, ví dụ một vài cái đơn giản như:

- HTML/CSS/Javascript với các ngôn ngữ đóng những vai trò khác nhau
- Mô hình MVC, với các tầng Model, View, Controller đảm nhiệm các nhiệm vụ riêng biệt khác nhau
- Kiến trúc Microservices với các service thực hiện những nhiệm vụ khác nhau
- Trong lập trình hướng đối tượng, Separation of Concerns được thể hiện qua một design principle khác là Single Responsibility