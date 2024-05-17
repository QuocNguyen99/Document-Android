# Constraint Layout

`ConstraintLayout` is a layout that allows you to place composables relative to other composables on the screen. It is an alternative to using multiple nested `Row`, `Column`, `Box` and other custom layout elements. `ConstraintLayout` is useful when implementing larger layouts with more complicated alignment requirements.

**Consider using `ConstraintLayout` in the following scenarios:**

- To avoid nesting multiple Columns and Rows for positioning elements on screen to improve readability of code.
- To position composables relative to other composables or to position composables based on guidelines, barriers or chains.

**In the View system, ConstraintLayout was the recommended way to create large and complex layouts, as a flat view hierarchy was better for performance than nested views are. However, this is not a concern in Compose, which is able to efficiently handle deep layout hierarchies.**

[More info about Constraint Layout](https://developer.android.com/develop/ui/compose/layouts/constraintlayout)