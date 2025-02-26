# Composition Local


Jetpack Compose is designed using a declarative approach, enabling the creation of highly reusable and intuitive UI layouts. However, a challenge arises when the information provided at the root of the layout is needed at the very end of the node. There's no issue with simple UI structures, but consider a scenario like the figure below where you need to construct a highly complex layout involving more than ten levels of various Composable function calls.

![](../../../../../resources/composition_local.avif)

In such a scenario, you would need to relay the necessary information from the root to the end, and all Composable functions situated in between must also transmit this information, even if they don't actually utilize it. This approach complicates the entire set of Composable functions, making them more extensive and burdened with unrelated information. Consequently, it could potentially reduce the maintainability of your code.

To tackle this issue, **Compose offers CompositionLocal which allows you to create tree-scoped named objects that can be used as an implicit way to have data flow through the UI tree, enabling access to the required information at any time and at any level of the node whenever needed like the figure below:**

![](../../../../../resources/composition_local_provider.avif)


In many scenarios, **CompositionLocal** is used to pass relatively "static" information that doesn’t change much once created. A familiar example might be the MaterialTheme object, which aids in ensuring consistency across your Compose UI components.

For example:

```kotlin
@Composable
fun MaterialTheme(
    ..
) {
    ..
    CompositionLocalProvider(
        LocalColors provides rememberedColors,
        LocalContentAlpha provides ContentAlpha.high,
        LocalIndication provides rippleIndication,
        LocalRippleTheme provides MaterialRippleTheme,
        LocalShapes provides shapes,
        LocalTextSelectionColors provides selectionColors,
        LocalTypography provides typography
    ) {
        ..
    }
}
```


In the internal implementation of MaterialTheme, it defines all aspects of the theme, including color, alpha, indication, shapes, and typography. Consequently, all Jetpack Compose Material UI components used within the MaterialTheme Composable will consistently apply the theme's properties. This uniformity is maintained regardless of the developers' usage patterns, as they can access the theme information via **CompositionLocal**.

On the other hand, overusing **CompositionLocal** can lead to difficulties in debugging and maintaining your code. Therefore, using it judiciously and avoiding excessive reliance on it in your codebase is crucial. If you want to learn more about **CompositionLocal**, check out Locally scoped data with **CompositionLocal**.


To provide a new value to a CompositionLocal, use the CompositionLocalProvider and its provides infix function that associates a CompositionLocal key to a value. The content lambda of the CompositionLocalProvider will get the provided value when accessing the current property of the CompositionLocal. When a new value is provided, Compose recomposes parts of the Composition that read the CompositionLocal.


## Creating a CompositionLocal

There are two APIs to create a CompositionLocal:

- `compositionLocalOf`: Changing the value provided during recomposition invalidates only the content that reads its current value.

- `staticCompositionLocalOf`: Unlike compositionLocalOf, reads of a staticCompositionLocalOf are not tracked by Compose. Changing the value causes the entirety of the content lambda where the CompositionLocal is provided to be recomposed, instead of just the places where the current value is read in the Composition.

If the value provided to the CompositionLocal is highly unlikely to change or will never change, use staticCompositionLocalOf to get performance benefits.

<details>
  <summary style="color: orange;">
  <b>
  For example
  </b>
  </summary>
  
  <p>

 an app's design system might be opinionated in the way composables are elevated using a shadow for the UI component. Since the different elevations for the app should propagate throughout the UI tree, we use a CompositionLocal. As the CompositionLocal value is derived conditionally based on the system theme, we use the compositionLocalOf API:

 ```kotlin
 // LocalElevations.kt file

data class Elevations(val card: Dp = 0.dp, val default: Dp = 0.dp)

// Define a CompositionLocal global object with a default
// This instance can be accessed by all composables in the app
val LocalElevations = compositionLocalOf { Elevations() }
```


  </p>
</details>

## Providing values to a CompositionLocal

The CompositionLocalProvider composable binds values to CompositionLocal instances for the given hierarchy. To provide a new value to a CompositionLocal, use the provides infix function that associates a CompositionLocal key to a value as follows:

```kotlin
// MyActivity.kt file

class MyActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            // Calculate elevations based on the system theme
            val elevations = if (isSystemInDarkTheme()) {
                Elevations(card = 1.dp, default = 1.dp)
            } else {
                Elevations(card = 0.dp, default = 0.dp)
            }

            // Bind elevation as the value for LocalElevations
            CompositionLocalProvider(LocalElevations provides elevations) {
                // ... Content goes here ...
                // This part of Composition will see the `elevations` instance
                // when accessing LocalElevations.current
            }
        }
    }
}
```

## Consuming the CompositionLocal

CompositionLocal.current returns the value provided by the nearest CompositionLocalProvider that provides a value to that CompositionLocal:

```kotlin
@Composable
fun SomeComposable() {
    // Access the globally defined LocalElevations variable to get the
    // current Elevations in this part of the Composition
    Card(elevation = LocalElevations.current.card) {
        // Content
    }
}
```

## Alternatives to consider

A CompositionLocal might be an excessive solution for some use cases. If your use case doesn't meet the criteria specified in the Deciding whether to use CompositionLocal section, another solution might likely be better suited for your use case.

### Pass explicit parameters

Being explicit about composable's dependencies is a good habit. We recommend that you **pass composables only what they need**. To encourage decoupling and reuse of composables, each composable should hold the least amount of information possible.


```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    MyDescendant(myViewModel.data)
}

// Don't pass the whole object! Just what the descendant needs.
// Also, don't  pass the ViewModel as an implicit dependency using
// a CompositionLocal.
@Composable
fun MyDescendant(myViewModel: MyViewModel) { /* ... */ }

// Pass only what the descendant needs
@Composable
fun MyDescendant(data: DataToDisplay) {
    // Display data
}
```

### Inversion of control

Another way to avoid passing unnecessary dependencies to a composable is via inversion of control. Instead of the descendant taking in a dependency to execute some logic, the parent does that instead.

<details>
  <summary style="color: orange;">
  <b>
  For example
  </b>
  </summary>
  
  <p>

See the following example where a descendant needs to trigger the request to load some data

```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    MyDescendant(myViewModel)
}

@Composable
fun MyDescendant(myViewModel: MyViewModel) {
    Button(onClick = { myViewModel.loadData() }) {
        Text("Load data")
    }
}
```

Depending on the case, MyDescendant might have a lot of responsibility. Also, passing MyViewModel as a dependency makes MyDescendant less reusable since they're now coupled together. Consider the alternative that doesn't pass the dependency into the descendant and uses inversion of control principles that makes the ancestor responsible for executing the logic:

```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    ReusableLoadDataButton(
        onLoadClick = {
            myViewModel.loadData()
        }
    )
}

@Composable
fun ReusableLoadDataButton(onLoadClick: () -> Unit) {
    Button(onClick = onLoadClick) {
        Text("Load data")
    }
}
```

Similarly, @Composable **content lambdas can be used in the same way to get the same benefits**:


```kotlin
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    ReusablePartOfTheScreen(
        content = {
            Button(
                onClick = {
                    myViewModel.loadData()
                }
            ) {
                Text("Confirm")
            }
        }
    )
}

@Composable
fun ReusablePartOfTheScreen(content: @Composable () -> Unit) {
    Column {
        // ...
        content()
    }
}
```


  </p>
</details>