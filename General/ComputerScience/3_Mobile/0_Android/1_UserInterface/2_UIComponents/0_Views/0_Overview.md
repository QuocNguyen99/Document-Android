# Overview

## LayoutParams

Before we get on with our layouts, we need to understand what `LayoutParams` are.

`LayoutParams` are used by Views to tell their parents how they want to be laid out.

The base `LayoutParams` class describes how big the view wants to be in terms of both width and height.
In this case, it can be `match_parent`, `wrap_content`, or an exact number. The `match_parent` fills the parent view completely, ` ` takes as much space as the contents need, and an exact number specifies the exact size for your View.

There are also subclasses of `LayoutParams` for the subclasses of ViewGroups like `FrameLayout`, `LinearLayout`, and so on.





