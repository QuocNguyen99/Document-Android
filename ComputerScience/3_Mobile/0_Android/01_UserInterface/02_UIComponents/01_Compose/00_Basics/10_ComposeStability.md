# Jetpack Compose Stability

Have you ever measured the performance of your composable and discovered it is recomposing more code than you expect? *“I thought Compose was meant to intelligently skip composables when state hasn’t changed?”* you might ask. Or when reading Compose code you might see classes annotated with `@Stable` or `@Immutable` and wonder what those mean? These concepts can be explained by Compose stability.

## TL,DR

- Compose determines the stability of each parameter of your composables to work out if it can be skipped or not during recomposition.
- If you notice your composable isn’t being skipped and it is causing a performance issue, you should check the obvious causes of instability like `var` parameters first.
- We can use the compiler reports to determine what stability is being inferred about your classes, And we can Use  [Composable metrics](https://chrisbanes.me/posts/composable-metrics/) or third party library like [Mendable](https://github.com/jayasuryat/mendable)
- Collection classes like `List`, `Set` and `Map` are always determined unstable as it is not guaranteed they are immutable. You can use [Kotlinx immutable collections](https://github.com/Kotlin/kotlinx.collections.immutable) instead or annotate your classes as `@Immutable` or `@Stable`.

- Classes from modules where the Compose compiler is not run are always determined to be unstable. Add a dependency on compose runtime and mark them as stable in your module or wrap the classes in UI model classes if required.
- Should every Composable be skippable? **No.**

## Recomposition

> [!NOTE]
> Following the Ofiical Document
“Recomposition is the process of calling your composable functions again when inputs change. This happens when the function’s inputs change. When Compose recomposes based on new inputs, it only calls the functions or lambdas that might have changed, and skips the rest. By skipping all functions or lambdas that don’t have changed parameters, Compose can recompose efficiently.“

Compose will trigger recomposition when snapshot state changes, and skip any composables that haven’t changed. Importantly though a composable will only be skipped if Compose can be sure that none of the parameters of a composable have been updated. Otherwise, if Compose can’t be sure, it will always be recomposed when its parent composable is recomposed. If Compose didn’t do this, it would lead to very hard to diagnose bugs with recomposition not triggering. It is much better to be correct and slightly less performant than incorrect but slightly faster.

### Using immutable objects

First, let’s say that we define the Contact class as an immutable data class, so it cannot be changed without creating a new object:

```kotlin
data class Contact(val name: String, val number: String)
```


When it comes to the `ContactDetails` composable, Compose will skip recomposing it. This is because it can see that none of the parameters, in this case `contact`, have changed. `ToggleButton`, on the other hand, inputs have changed and so it is recomposed correctly.


### Using mutable objects

What about if our Contact class was defined like so?

```kotlin
data class Contact(var name: String, var number: String)
```

Now our `Contact` **class is no longer immutable**, its properties could be changed without Compose knowing. Compose will no longer skip the `ContactDetails` composable as this class is now considered “unstable” (more details on what this means below). As such, anytime selected is changed, `ContactRow` will also recompose.


### Implementation in the Compose compiler

Now we know the theory on what Compose is trying to determine, let’s have a look at how it actually happens in practice.

1. Functions could be skippable and/or restartable:

**Skippable**
- when called during recomposition, **compose is able to skip the function if all of the parameters are equal with their previous values.**

**Restartable** 
- This function serves as a “scope” where recomposition can start (**In other words, this function can be used as a point of entry for where Compose can start re-executing code for recomposition after state changes**).

2. Types could be immutable or stable:

**Immutable** 
- Indicates a type where the value of any properties will never change after the object is constructed, and all methods are referentially transparent. All primitive types (String, Int, Float, etc) are considered immutable.

**Stable** 
- Indicates a type that is mutable, but the Compose runtime will be notified if and when any public properties or method behavior would yield different results from a previous invocation.

**When the Compose compiler is run on your code, it is looking at every function and type and tagging any that match these definitions**. Compose looks at the types passed in to composables to determine the skippability of that composable. It’s important to note that the parameters don’t have to be immutable, they can be mutable as long as the Compose runtime is notified of all changes. For most types, it would be difficult to follow this rule. However, Compose provides mutable classes, like `MutableState` and `SnapshotStateMap`/`List`, that handle this for you. As a result, using these types for your mutable properties will allow your class to uphold the contract of `@Stable`. In practice this would look something like the following

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

@Stable
class MyStateHolder {
  var isLoading by mutableStateOf(false)
}
```

When Compose state changes, **Compose looks for the nearest restartable function above all of the points in the tree where those state objects are read.**

Ideally this will be the direct ancestor to re-run the smallest possible code. It is here that recomposition restarts. When re-executing the code, any skippable functions will be skipped if their parameters have not changed. Let’s take a look again at our earlier example

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

data class Contact(val name: String, val number: String)

fun ContactRow(contact: Contact, modifier: Modifier = Modifier) {
  var selected by remember { mutableStateOf(false) }
  Row(modifier) {
    ContactDetails(contact)
    ToggleButton(selected, onToggled = { selected = !selected })
  }
}
```

Here when selected is changed, the nearest “restartable” function/composition scope to where the state is actually read is `ContactRow`.

You might be wondering why `Row` is not being selected as the nearest restartable scope? `Row` (as well as many other foundation composables like `Column` and `Box`) is actually an inline function.

So `ContactRow` is the next highest scope and therefore `ContactRow` re-executes. The first composable it sees is `Row`, as already detailed this is not a restartable scope, this also means it is not skippable and is always re-executed on recomposition.

The next composable is `ContactDetails`, `ContactDetails` has been tagged as skippable because the `Contact` class has been inferred as **immutable**, so the generated code added by the Compose compiler checks if any of the composables parameters have changed. As contact has remained the same, ContactDetails is skipped.


Next, `ToggleButton`. `ToggleButton` is skippable but in this case it does not matter, one of its parameters, selected, has changed and as such it is re-executed. That brings us to the end of our restartable function/scope and the recomposition ends.

### Conclusions
- The goal is to have the compiler optimize code that you write naturally to be efficient.
Skipping composable functions is an important ingredient to make that happen, but it’s also something that needs to be 100% safe or else it would result in very hard to diagnose bugs.For this reason, the requirements for a function to be skipped are strong.

- **We are working to improve the compiler’s inference of skippability but there will always be situations where it is impossible for the compiler to work out.**


- Understanding how skipping functions works under the hood in this situation can aid you in improving your performance but it should be considered only in cases where you have a measured performance issue caused by stability.

-  A composable not being skippable may have no effect at all if the composable is lightweight or itself just contains skippable composables.


## Debugging Stability

How do you know if your composables are being skipped or not? You can see it in the `Layout Inspector`! `Android Studio Dolphin` includes support for Compose in the `Layout Inspector`, it will also show you a count of how many times your composables are being recomposed and skipped.

But what do you do when you can’t spot anything obviously wrong?

## Compose Compiler Reports

The compose compiler can output the results of its stability inference for inspection. Using this output you can determine which of your composables are skippable and which are not. 

> [!WARNING]
> You should only use this technique if you are actually experiencing performance issues related to stability. Trying to make your entire UI skippable is a premature optimization that could lead to maintenance difficulties in the future. Before optimizing for stability, ensure you are following best practices for Compose performance official.

The compiler compiler reports are not enabled by default. They are enabled via a compiler flag, the exact setup varies depending on your project but for most projects you can paste the following script into your root `build.gradle` file.

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

subprojects {
 tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
  kotlinOptions {
    if (project.findProperty("composeCompilerReports") == "true") {
      freeCompilerArgs += [
        "-P",
        "plugin:androidx.compose.compiler.plugins.kotlin:reportsDestination=" +
        project.buildDir.absolutePath + "/compose_compiler"
        ]
      }
      if (project.findProperty("composeCompilerMetrics") == "true") {
        freeCompilerArgs += [
          "-P",
          "plugin:androidx.compose.compiler.plugins.kotlin:metricsDestination=" +
          project.buildDir.absolutePath + "/compose_compiler"
        ]
      }
    }
  }
}
```

For debugging the stability of your composables you can run the task as follows:

```bash
./gradlew assembleRelease -PcomposeCompilerReports=true
```

> [!WARNING]
> Make sure to always run this on a release build to ensure accurate results.

This task will output three files.

`<modulename>-classes.txt` — A report on the stability of classes in this module.

`<modulename>-composables.txt` — A report on the restartability and skippability of the composables in this module.

`<modulename>-composables.csv` — A csv version of the above text file for importing into a spreadsheet or processing via a script.

If you instead run the `composeCompilerMetrics` task you will get overall statistics of the number of composables in your project and other similar info. This isn’t covered in this post as it’s not as useful for debugging.

Open up the `composables.txt` file and you will see all of your composable functions for that module and each will be marked with whether they are restartable, skippable and the stability of their parameters.

For Example :


```txt
restartable skippable scheme(“[androidx.compose.ui.UiComposable]”) fun SnackCollection(
   stable snackCollection: SnackCollection
   stable onSnackClick: Function1<Long, Unit>
   stable modifier: Modifier? = @static Companion
   stable index: Int = @static 0
   stable highlight: Boolean = @static true
)
```

This SnackCollection composable is completely restartable, skippable and stable. This is generally what you want, when possible, although far from mandatory (further detail at the end of the post).

However, let’s take a look at another example.

```txt
restartable scheme(“[androidx.compose.ui.UiComposable]”) fun HighlightedSnacks(
   stable index: Int
   unstable snacks: List<Snack>
   stable onSnackClick: Function1<Long, Unit>
   stable modifier: Modifier? = @static Companion
)
```

The `HighlightedSnacks` composable is not skippable — anytime this is called during recomposition, it will also recompose, even if none of its parameters have changed.

This is being caused by the unstable parameter, `snacks`.

Now we can switch to the `classes.txt` file to check the stability of `Snack`.


```txt
unstable class Snack {
   stable val id: Long
   stable val name: String
   stable val imageUrl: String
   stable val price: Long
   stable val tagline: String
   unstable val tags: Set<String>
   <runtime stability> = Unstable
}
```

For reference, this is how Snack is declared

```kotlin
/* Copyright 2022 Google LLC.
SPDX-License-Identifier: Apache-2.0 */

data class Snack(
  val id: Long,
  val name: String,
  val imageUrl: String,
  val price: Long,
  val tagline: String = "",
  val tags: Set<String> = emptySet()
)
```

`Snack` is unstable. It has mostly stable parameters but the tags set is considered unstable. But why is this? `Set` appears to be immutable, it is not a `MutableSet`.

Unfortunately `Set` (as well as `List` and other standard collection classes, more on that soon) are defined as interfaces in Kotlin, this means that the underlying implementation may still be mutable. For example, you could write

The variable is constant, its declared type is not mutable but its implementation is still mutable. The Compose compiler cannot be sure of the immutability of this class as it just sees the declared type and as such declares it as unstable. Let’s now look into how we can make this stable.

## Stabilizing the unstable

- Make all var properties `val`, and all of those properties immutable types.

- If this is impossible, then you will have to use Compose state for any mutable properties. This means in practice, any mutable property should be backed by Compose state e.g `mutableStateOf(…)`.


## Kotlinx Immutable Collections

Version 1.2 of the Compose compiler includes support for Kotlinx Immutable Collections. These collections are guaranteed to be immutable and will be inferred as such by the compiler.

Switching the tags declaration to the following makes the `Snack` class stable.

```kotlin
val tags: ImmutableSet<String> = persistentSetOf()
```

## Annotate with Stable or Immutable

Classes can also be annotated with either `@Stable` or `@Immutable` based on the rules above.

> [!CAUTION]
> It is very important to note that this is a contract to follow the corresponding rules for the annotation. It does not make a class Immutable/Stable on its own. Incorrectly annotating a class could cause recomposition to break.


**Annotating a class is overriding what the compiler inferred about your class**, in this way it is similar to the `!!` operator in Kotlin. You should be very careful about the usage of these annotations as overriding the compiler behavior could lead you to unforeseen bugs should you get it wrong. If it is possible to make your class stable without an annotation, you should strive to achieve stability that way.

Parameters face the same problem as classes when it comes to collection types, **List is always determined to be unstable, even when it is a collection of stable types**.You cannot mark an individual parameter as stable either, nor can you annotate a composable to always be skippable.


For Example :

Annotating the Snack example would be done as follows

```kotlin
@Immutable
data class Snack(
  val id: Long,
  val name: String,
  val imageUrl: String,
  val price: Long,
  val tagline: String = "",
  val tags: Set<String> = emptySet()
)
```


Whichever method chosen, the Snack class will be inferred as Stable.

However, returning to the HighlightedSnacks composable, HighlightedSnacks is still not marked as skippable:

```txt
unstable snacks: List<Snack>
```

So what can you do?

- Use a kotlinx immutable collection, instead of List.

```kotlin
  @Composable
  private fun HighlightedSnacks(
    index: Int,
-   snacks: List<Snack>,
+   snacks: ImmutableList<Snack>,
    onSnackClick: (Long) -> Unit,
    modifier: Modifier = Modifier
  )
```

- If you cannot use an immutable collection, you could wrap the list in an annotated stable class in the simplest case to mark it as immutable for the Compose compiler.

```kotlin
@Immutable
data class SnackCollection(
  val snacks: List<Snack>
)
```

```kotlin
  @Composable
  private fun HighlightedSnacks(
    index: Int,
-   snacks: List<Snack>
+   snacks: SnackCollection,
    onSnackClick: (Long) -> Unit,
    modifier: Modifier = Modifier
  )
```

After taking either of these approaches, the HighlightedSnacks composable is now both skippable and restartable.

```txt
restartable skippable scheme(“[androidx.compose.ui.UiComposable]”) fun HighlightedSnacks(
   stable index: Int
   stable snacks: ImmutableList<Snack>
   stable onSnackClick: Function1<Long, Unit>
   stable modifier: Modifier? = @static Companion
)
```

`HighlightedSnacks` will now skip recomposition when none of its inputs change.

## Multiple Modules

Another common issue you may run into has to do with multi-module architecture. The Compose compiler will only be able to infer whether a class is stable if all of the non-primitive types that it references are either explicitly marked as stable or in a module that was also built with the Compose compiler. If your data layer is in a separate module to your UI layer, [which is the recommended approach](https://developer.android.com/topic/architecture), this may be an issue you will encounter. To solve this issue you can either:
- Enable the Compose compiler on your data layer modules, or tag your classes with `@Stable` or `@Immutable` where appropriate.
- This will involve adding a Compose dependency to your data layer, **however it will just be the dependency for the compose runtime and not for Compose-UI.**
- Wrap your data layer classes in UI specific wrapper classes inside your UI module.

## Should every Composable be skippable?

No. Chasing complete skippability for every composable in your app is a premature optimization. There are many other situations where being skippable won’t have any real benefit and will just lead to hard to maintain code. For example:

- A composable that is not recomposed often, or at all.
- A composable that in itself just calls skippable composables.


