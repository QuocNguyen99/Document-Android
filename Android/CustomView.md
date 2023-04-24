## Những lưu ý khi custom View

* Luôn sử dụng lại object thay vì tạo mới nó trong onDraw().
* Ko hardcode kích thước View khi vẽ, mà nên vẽ View phụ thuộc vào kích thước nó có, để tránh trường hợp Dev khác sử dụng lại View đó nhưng cần kích thước khác.
* có 2 method để request update lại View: invalidate() và requestLayout()
  * invalidate(): vẽ lại view đơn giản.
  * requestLayout(): tính toán lại kích thước rồi mới vẽ lại.


