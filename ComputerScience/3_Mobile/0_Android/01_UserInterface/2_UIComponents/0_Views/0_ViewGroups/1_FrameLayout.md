# FrameLayout


All child elements of the FrameLayout are usually placed in the top left corner of the screen.

Every element of this layout will be drawn on top of the previous one, so it's better to use this layout to hold a single `View` with `height` and `width` attributes set to `"match_parent"` because otherwise, it can be difficult to control them on different screen sizes.

The only way to control children positioning is by using the layout_gravity and layout_margin attributes.