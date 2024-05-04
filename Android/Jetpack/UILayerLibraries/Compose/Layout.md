# Layout 
## Definition

In compose you can use composable functions to emit portions of your UI.
But layouts are the ones that specify the precise Arrangement and Alignment of those elements therefore layout whether
you use ones composed provides for free or build your own custom ones are a vital part of the compose world.

## Row Layout


Row is a composable that places its children in a horizontal sequence. 
You can control the alignment of its children in the vertical direction using the verticalAlignment parameter. 
The horizontalArrangement parameter can be used to describe the spacing between the children.

## Column Layout


Column is a composable that places its children in a vertical sequence.
You can control the alignment of its children in the horizontal direction using the horizontalAlignment parameter.
The verticalArrangement parameter can be used to describe the spacing between the children.

## Custom layouts and sub-composition
During the Layout phase, the tree is traversed using the following 3 step algorithm:

1. Measure children: A node measures its children, if any.
2. Decide own size: Based on those measurements, a node decides on its own size.
3. Place children: Each child node is placed relative to a node’s own position."


See the [Example](https://github.com/Meonix/CommonComposable/tree/master/app/src/main/java/com/mionix/commoncomposable/ui/screen/layoutExampleScreens/layoutBasics)