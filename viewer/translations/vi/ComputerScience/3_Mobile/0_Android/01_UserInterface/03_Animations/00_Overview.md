# Tổng quan về API hoạt ảnh

Trong chủ đề này, chúng ta sẽ khám phá nhiều API hoạt ảnh khác nhau có sẵn trong Android, bao gồm thuộc tính `animateLayoutChanges`, lớp ViewPropertyAnimator,
lớp `ObjectAnimator` và lớp `LayoutTransition` cho hoạt ảnh tùy chỉnh.


## Thuộc tính animateLayoutChanges

Khi bạn đặt thuộc tính này thành `true` trên ViewGroup, chẳng hạn như `LinearLayout` hoặc `RelativeLayout`, mọi thay đổi đối với bố cục, chẳng hạn như thêm hoặc xóa chế độ xem, sẽ tự động có hiệu ứng động. Các loại hoạt ảnh được áp dụng bao gồm mờ dần vào/ra và trượt.

## Ảnh động bố cục tùy chỉnh với `LayoutTransition`

Đối với các tình huống mà bạn muốn triển khai hoạt ảnh tùy chỉnh để thay đổi bố cục, bạn có thể tạo đối tượng `LayoutTransition`.
Đối tượng này cho phép bạn xác định các hoạt ảnh cụ thể để thêm, xóa và thay đổi chế độ xem trong bố cục.

```kotlin
val transition = LayoutTransition().apply {
    enableTransitionType(LayoutTransition.CHANGING)
}
container.layoutTransition = transition
```

## Ảnh động tùy chỉnh với `ViewPropertyAnimator`

Lớp `ViewPropertyAnimator` là một công cụ mạnh mẽ để tạo hoạt ảnh tùy chỉnh trên từng chế độ xem. 
Nó cho phép bạn tạo hiệu ứng động cho các thuộc tính khác nhau của chế độ xem, chẳng hạn như alpha (độ trong suốt), dịch (vị trí), tỷ lệ (kích thước) và xoay.

Để sử dụng `ViewPropertyAnimator`, trước tiên bạn cần có được tham chiếu đến chế độ xem mà bạn muốn tạo hiệu ứng. 

```kotlin
val myView = findViewById<View>(R.id.my_view)
myView.animate()
    .alpha(0f) // Fade out
    .translationYBy(200f) // Move down
    .setDuration(500) // Duration of 500 milliseconds
    .start()
```
## Kết hợp Ảnh động với `AnimatorSet`

Bạn cũng có thể tạo các hoạt ảnh phức tạp hơn bằng cách kết hợp nhiều phiên bản `ObjectAnimator` bằng `AnimatorSet`. 
Điều này cho phép bạn phát các hoạt ảnh theo tuần tự hoặc song song, tạo ra các hiệu ứng phức tạp và hấp dẫn về mặt hình ảnh.

```kotlin
val scaleXAnimator = ObjectAnimator.ofFloat(myView, "scaleX", 1f, 1.5f)
val scaleYAnimator = ObjectAnimator.ofFloat(myView, "scaleY", 1f, 1.5f)

val animatorSet = AnimatorSet()
animatorSet.playTogether(scaleXAnimator, scaleYAnimator)
animatorSet.duration = 500
animatorSet.start()
```
















