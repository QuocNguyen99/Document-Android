# Linear, Frame, Relative layouts

## LayoutParams

Before we get on with our layouts, we need to understand what `LayoutParams` are.

`LayoutParams` are used by Views to tell their parents how they want to be laid out.

The base `LayoutParams` class describes how big the view wants to be in terms of both width and height.
In this case, it can be `match_parent`, `wrap_content`, or an exact number. The `match_parent` fills the parent view completely, ` ` takes as much space as the contents need, and an exact number specifies the exact size for your View.

There are also subclasses of `LayoutParams` for the subclasses of ViewGroups like `FrameLayout`, `LinearLayout`, and so on.

## LinearLayout

This type of layout is simple. All elements in LinearLayout are lined up vertically or horizontally along a single line

There are two main arguments for this layout: `android:orientation`, which is the main attribute for the layout itself, and the `android:layout_weight` attribute for the Views.


## FrameLayout


All child elements of the FrameLayout are usually placed in the top left corner of the screen.

Every element of this layout will be drawn on top of the previous one, so it's better to use this layout to hold a single `View` with `height` and `width` attributes set to `"match_parent"` because otherwise, it can be difficult to control them on different screen sizes.

The only way to control children positioning is by using the layout_gravity and layout_margin attributes.

## RelativeLayout

RelativeLayout contains child views in relative positions, meaning that each element can be positioned relative to another one, or relative to the layout itself (top, bottom, left, right, center).

By default, each element is horizontally aligned to the left and vertically to the top of your layout. If you don't change these attributes, each element will be placed on top of the previous one. 

- `android:layout_above` places the bottom edge of the element above the chosen element.
- `android:layout_below` places the top edge of the element below the chosen element.
- `android:layout_toStartOf` places the end edge of this element to the beginning of the chosen element.
- `android:layout_toEndOf` places the start edge of this element to the end of the chosen element.
- `android:layout_toLeftOf` places the right edge of the element to the left edge of the chosen element.
- `android:layout_toRightOf` places the left edge of the element to the right edge of the chosen element.

## RTL layout support





