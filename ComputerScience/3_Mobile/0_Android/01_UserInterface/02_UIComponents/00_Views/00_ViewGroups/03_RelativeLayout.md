# RelativeLayout

`RelativeLayout` contains child views in relative positions, meaning that each element can be positioned relative to another one, or relative to the layout itself (top, bottom, left, right, center).

By default, each element is horizontally aligned to the left and vertically to the top of your layout. If you don't change these attributes, each element will be placed on top of the previous one. 

- `android:layout_above` places the bottom edge of the element above the chosen element.
- `android:layout_below` places the top edge of the element below the chosen element.
- `android:layout_toStartOf` places the end edge of this element to the beginning of the chosen element.
- `android:layout_toEndOf` places the start edge of this element to the end of the chosen element.
- `android:layout_toLeftOf` places the right edge of the element to the left edge of the chosen element.
- `android:layout_toRightOf` places the left edge of the element to the right edge of the chosen element.
