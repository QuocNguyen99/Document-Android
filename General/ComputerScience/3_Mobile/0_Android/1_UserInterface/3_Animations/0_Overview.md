# Animation APIs overview

In this topic, we will explore various animation APIs available in Android, including the `animateLayoutChanges` attribute, the ViewPropertyAnimator class,
the `ObjectAnimator` class, and the `LayoutTransition` class for custom animations.


## animateLayoutChanges attribute

When you set this attribute to `true` on a ViewGroup, such as a `LinearLayout` or `RelativeLayout`, any changes to the layout, such as adding or removing views, will be animated automatically. The types of animations applied include fading in/out and sliding.

## Custom Layout Animations with `LayoutTransition`

For scenarios where you want to implement custom animations for layout changes, you can create a `LayoutTransition` object.
This object allows you to define specific animations for adding, removing, and changing views within the layout.

```kotlin
val transition = LayoutTransition().apply {
    enableTransitionType(LayoutTransition.CHANGING)
}
container.layoutTransition = transition
```

## Custom Animations with `ViewPropertyAnimator`

The `ViewPropertyAnimator` class is a powerful tool for creating custom animations on individual views. 
It allows you to animate various properties of a view, such as its alpha (transparency), translation (position), scale (size), and rotation.

To use `ViewPropertyAnimator`, you first need to obtain a reference to the view you want to animate. 

```kotlin
val myView = findViewById<View>(R.id.my_view)
myView.animate()
    .alpha(0f) // Fade out
    .translationYBy(200f) // Move down
    .setDuration(500) // Duration of 500 milliseconds
    .start()
```
## Combining Animations with `AnimatorSet`

You can also create more complex animations by combining multiple `ObjectAnimator` instances using an `AnimatorSet`. 
This allows you to play animations sequentially or in parallel, creating intricate and visually appealing effects.

```kotlin
val scaleXAnimator = ObjectAnimator.ofFloat(myView, "scaleX", 1f, 1.5f)
val scaleYAnimator = ObjectAnimator.ofFloat(myView, "scaleY", 1f, 1.5f)

val animatorSet = AnimatorSet()
animatorSet.playTogether(scaleXAnimator, scaleYAnimator)
animatorSet.duration = 500
animatorSet.start()
```
















