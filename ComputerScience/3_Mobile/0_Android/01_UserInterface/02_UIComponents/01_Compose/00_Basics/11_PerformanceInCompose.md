# Performance in Jetpack Compose

## 1. Unstable objects on UI layer.

What is considered stable by the compiler?
- All primitive value types: Boolean, Int, Long, Float, Char, etc.
- Strings
- Lambdas (not always, we will get to it later)

Best practices:
1. Don’t use var when seeking stability. Fields declared as var are considered unstable

```kotlin
data class User(val id: Long, val name: String, var isSelected: Boolean)
```

2. Not all lambdas are considered stable. Let’s look at the following examples

```kotlin
@Composable
fun UnstableLambdaScreen(viewModel: TypicalViewModel = hiltViewModel()) {
    Column {
        // button is not skippable due to usage of viewModel.onContinueClick()
        Button(onClick = { viewModel.onContinueClick() }) {
            Text(text = "button with unstable lambda")
        }
    }
}
```


```kotlin
@Composable
fun UnstableLambdaScreen() {
    val focusRequester = LocalFocusManager.current

    Column {
        // unstable lambda results in unskippable Button
        Button(onClick = { focusRequester.clearFocus() }) {
            Text(text = "button with unstable lambda")
        }
    }
}
```

Since the lambdas capture outside scopes, they won’t be automatically inferred as stable and reused as expected. 

If the lambda requires access to external variables, the compiler will add those variables as fields, which are passed into the constructor of the lambda. We go a 2 ways of dealing with this situation.

3. Use references, it will prevent the creation of a new class that references the outside variable:

```kotlin
@Composable
fun UnstableLambdaScreen(viewModel: TypicalViewModel = hiltViewModel()) {

    Column {
        // stable
        Button(onClick = viewModel::onContinueClick) {
            Text(text = "button with stable lambda")
        }
    }
} 
```

Approach above works great for simple scenarios, but sometimes you have to place a few function calls inside. In such cases we can use remembered lambdas.

4. Explicitly remembering lambdas will ensure that we reuse the same lambda instance across recompositions.

```kotlin
@Composable
fun UnstableLambdaScreen(viewModel: TypicalViewModel = hiltViewModel()) {
    val focusRequester = LocalFocusManager.current
    val onNameEnteredClick: (value: String) -> Unit = remember {
        return@remember viewModel::onNameEntered
    }
    val clearFocus = remember { { focusRequester.clearFocus() } }
    
    Column {
        // stable lambdas, skippable button
        Button(onClick = {
            onNameEnteredClick("..")
            clearFocus()
            someTopLvlFunction()
        }) {
            Text(text = "button with stable lambdas")
        }
    }
}

// top lvl functions without unstable params are stable
fun someTopLvlFunction() {

}
```
Double braces in clearFocus are not needed unless you need to pass it as a function.

5. In case you do need to use an object from a library or multi-module project on UI layer, you need to double check if it’s marked as stable.

```kotlin
// Create your own classes and map from & to them;
// not skippable if User is unstable
@Composable
private fun UserDetails(user: User) {
    Text(text = "name: ${user.name} id:${user.id}")
}

/** 
Pass stable fields directly to the composable which needs them,
so instead of passing user class you pass it’s primitives: 
user.id, user.name

Use a wrapper class marked with @Immutable annotation
**/

@Immutable
data class ImmutableUserWrapper(val user: User)

@Composable
private fun UserDetails(wrapper: ImmutableUserWrapper) {
    Text(text = "name: ${wrapper.user.name} id:${wrapper.user.id}")
}
```

6. Unstable collections. Kotlin lists are read-only, but not immutable, so we can use:

Create a wrapper for list, same as we did when treating entities from another modules, and use it on the UI layer:


```kotlin
@Immutable
class ImmutableListWrapper(val items: List<Int>)

// optimized using @Immutable marked ImmutableWrapper
@Composable
private fun WrappedLazyColumnApproach1(wrapper: ImmutableListWrapper) {
    LazyColumn {
        items(items = wrapper.items, key = { item -> item }) { item ->
            Text(text = "item $item")
        }
    }
}
```

Use immutable collections `from kotlinx.collections.immutable`. 
It’s available as a dependency.

```kotlin

@Composable
private fun WrappedLazyColumnApproach2(items: ImmutableList<Int>) {
   LazyColumn {
        items(items = items, key = { item -> item }) { item ->
            Text(text = "item $item")
        }
    }
}
```

## 2. Inlined composables

It’s important to be aware that Column, Row & Box are inlined, meaning that they don’t produce their own state read scope, only use their parent scope. 
When state is read, it triggers recomposition in the nearest scope.

This can be fixed by the following:

```kotlin

@Composable
fun StateReadsInlinedComposablesScreen() {
    var count by remember { mutableStateOf(0) }

    WrappedColumn {
        Text(text = "count: $count")
        Button(onClick = { count++ }) {
            Text(text = "increase count")
        }
    }
}
@Composable
fun WrappedColumn(content: @Composable ColumnScope.() -> Unit) {
    Column(content = content)
}
```
There is an alternative approach to fix this in the next point.

## 3. State reads from too high scope

Example above illustrated what happens if state read is done in a wrong scope. 
We can provide a smaller read scope when using lambdas which return values, instead of passing values directly into composables. 
Let’s try this on the previous example:

```kotlin

@Composable
fun StateReadsInlinedComposablesSolution2Screen() {
    var count by remember { mutableStateOf(0) }
    Column {
        TextWrapper(provideCount = { count })
        Button(onClick = { count++ }) {
            Text(text = "count++")
        }
    }
}
@Composable
fun TextWrapper(provideCount: () -> Int) {
    Text(text = "Count: ${provideCount()}")
}
```
Passing lambda into the `TextWrapper` to retrieve the value when needed,
creates a state read scope which allows us to get the same results in this exact scenario, meaning that we don’t even need to use `ColumnWrapper` as we did before.

## 4. Use lambda modifiers whenever possible

By switching to the lambda version of the modifier, you can make sure the function reads the scroll state in the layout phase.

As a result, when the scroll state changes, Compose can skip the composition phase entirely, and go straight to the layout phase.

## 5. When to use `remember { }`?
- For any operation which might be executed more than once, **but shouldn’t be** until the key passed in the remember changes.
- When using objects that are not treated by the compiler as stable, including unstable lambdas.
- For unstable lambda such as clickable, navigation ...










