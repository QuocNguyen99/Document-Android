# Button 

Jetpack Compose provides us with five main button types, each suited for a slightly different task:

- **Filled Button**: `Button` This is the default button type! It's meant to have a bold visual impact. Use it for primary actions - things like "Submit", "Download", or "Add to cart".

- **Filled Tonal Button**: `FilledTonalButton` This button shares a similar look to the filled button but has a more subtle color variation. It's a medium-emphasis button; can be used where a lower-priority button requires slightly more emphasis.

- **Elevated Button**: `ElevatedButton` This button type stands out with a subtle shadow, great when you need to separate a button on a busy screen visually. Shares similar roles with a filled button.

- **Outlined Button**: `OutlinedButton` The outlined button, just like the name suggests, has an outline (border) around it with a transparent fill. It is useful for secondary actions. Things like "Cancel", "Back", or "Edit". Outlined buttons visually recede in the interface creating a clear hierarchy when used alongside filled, tonal, or elevated buttons.

- **Text Button**: `TextButton` This is a minimalist button, just text with no background or border, ideal for less important actions or places where you want a less button-like feel, like navigation links.

The composable requires two arguments:

- `onClick: () -> Unit`: This lambda function defines the action to execute when the button is clicked.

- `content: @Composable RowScope.() -> Unit`: This is a slot for the button's content. Usually, this will contain the `Text` composable with the button's text.
As the lambda's type indicates, composables placed here will be laid out in a row.

> [!NOTE]
> Here's an interesting fact: Under the hood, all the other button types listed above call the default Button, providing different arguments to achieve their unique look.


> [!NOTE]
> Did you notice that our simple button from the previous section had white text even though we didn't set that?.
> Also, why does the button have a purple background? This is indirectly thanks to the `ButtonDefaults.buttonColors()` default argument passed to the colors parameter.
> The `buttonColors()` method sets the button's container color to the theme's primary color, and the content's color to the theme's onPrimary color.
> In a new Android Studio project, these are purple and white respectively.

## Icon buttons

There are two main types of icon buttons: a **standard** icon button and a **contained** icon button. 

The first one is Icon buttons offer a compact and visually clear way to represent actions within an app.
They are ideal for secondary actions or places with limited space, like toolbars.

Much like the previous buttons, `IconButton` expects an `onClick` lambda and a content lambda that normally is meant to take an `Icon` composable:

```kotlin
IconButton(onClick = { /*TODO*/ }) {
    Icon(Icons.Default.Settings, contentDescription = "Settings")
}
```

![alt text](/resources/compose_icon_button.png)

The second type is: 

`FilledIconButton` has a background or an outline; typically a filled, filled tonal and outlined variations. Note that icon buttons are circular by default.

![alt text](/resources/compose_filled_icon_button.png)

To make the **filled tonal** and the **outlined** variant, we use the `FilledTonalIconButton` and the OutlinedIconButt`on composables respectively

## Floating Action Buttons (FABs)

Floating Action Buttons (FABs) are special buttons designed to draw attention to the most important action(s) on a screen.

Jetpack Compose offers two main types of FABs

### 1. The standard FAB

Use the `FloatingActionButton` composable to create the standard FAB:

There are two variants of the standard FAB that differ in size.
The `SmallFloatingActionButton` and `LargeFloatingActionButton` which take the same parameters as the standard FAB.

```kotlin
@Composable
fun FloatingActionButton(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    shape: Shape = FloatingActionButtonDefaults.shape,
    containerColor: Color = FloatingActionButtonDefaults.containerColor,
    contentColor: Color = contentColorFor(containerColor),
    elevation: FloatingActionButtonElevation = FloatingActionButtonDefaults.elevation(),
    interactionSource: MutableInteractionSource = remember { MutableInteractionSource() },
    content: @Composable () -> Unit,
)
```


### 2. Extended FAB

The Extended FAB, as the name suggests, is an FAB with extra space for text.

```kotlin
@Composable
fun ExtendedFloatingActionButton(
    text: @Composable () -> Unit,
    icon: @Composable () -> Unit,
    onClick: () -> Unit,
    expanded: Boolean = true,
    // ...other customization options...
)

// or

@Composable
fun ExtendedFloatingActionButton(
    onClick: () -> Unit,
    // ...other customization options...
    content: @Composable RowScope.() -> Unit,
)
```


















