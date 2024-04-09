# Constraint And Measure

Measurable and Constraints are key concepts in the Jetpack Compose layout system.

## Measure

Measurable is an interface that represents a child composable in the layout system. It provides a measure function that takes a Constraints object and returns a Placeable object. The measure function is used to determine the size of the child composable based on the provided constraints.  Here is a simplified definition of Measurable:

```kotlin
interface Measurable {
    fun measure(constraints: Constraints): Placeable
}
```

## Constraints

Constraints is a data class in Jetpack Compose that specifies the minimum and maximum width and height that a layout's child can take. It is used to communicate sizing constraints from a parent layout to its children during the measurement phase of the layout process.  Here is a simplified definition of Constraints:

```kotlin
data class Constraints(
    val minWidth: Int,
    val maxWidth: Int,
    val minHeight: Int,
    val maxHeight: Int
)
```

In this class, minWidth and minHeight specify the minimum size the layout can take, while maxWidth and maxHeight specify the maximum size. The actual size of the layout will be a value between the minimum and maximum size, depending on the layout's own sizing behavior and the available space.