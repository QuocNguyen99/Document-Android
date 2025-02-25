# Jetpack Compose Project Structure

Android View Project and Jetpack Compose Project are so differences about the project structure and
particular code part. So let's check some of that.

## The MainActivity class

Let's take a peek inside the `MainActivity` class 

```kotlin 
class MainActivity : ComponentActivity() {
   override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(savedInstanceState)
       setContent {
           HyperskillTheme {
               Text("Hello, Compose!")
           }
       }
   }
}
```
you can see the method `setContent` that composes the given Composable functions into the current activity to build the UI.

- `setContent` is a higher-order extension function of the `ComponentActivity` class that can take Composable functions as an argument of the `content` parameter.
**These Composable functions will become the root elements in the hierarchy of UI elements.**

## Theme files
there is a `ui` package, inside of which you can find another one — `theme`. 
This package contains four files: `Color.kt`, `Shape.kt`, and `Type.kt` that contain values used by your app's theme defined in the last one, `Theme.kt`

## References

- https://hyperskill.org/learn/step/25491

































