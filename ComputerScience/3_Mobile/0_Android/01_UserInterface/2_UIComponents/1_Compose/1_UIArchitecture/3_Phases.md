# Jetpack Compose phases 

Giống như hầu hết các UI tool kit khác, Compose render frame qua nhiều giai đoạn riêng biệt

If we look at the Android View system, it has three main phases: measure, layout, and drawing. Compose is very similar but has an important additional phase called composition at the start.

Composition is described across our Compose docs, including [Thinking in Compose](../Introduction/ThikingInCompose.md) and [State and Jetpack Compose.](./ManagingState.md)

## The three phases of a frame

Compose has three main phases:

1. **Composition**: What UI to show. Compose runs composable functions and creates a description of your UI.
2. **Layout**: Where to place UI. This phase consists of two steps: measurement and placement. Layout elements measure and place themselves and any child elements in 2D coordinates, for each node in the layout tree.
3. **Drawing**: How it renders. UI elements draw into a Canvas, usually a device screen.


![](../../../../../resources/state_and_recomposition.avif)

Thứ tự các giai đoạn này thường giống nhau, cho phép dữ liệu chảy theo một hướng từ bố cục, composition đến layout để vẽ tạo ra một khung hình(also known as [unidirectional data flow](../../../../../General/DesignPattern/UnidirectionalDataFlow.md)). `BoxWithConstraints` and `LazyColumn` and `LazyRow` là những ngoại lệ đáng chú ý, trong đó thành phần của các con của nó phụ thuộc vào layout phase của parent.

Bạn có thể giả định một cách an toàn rằng ba giai đoạn này hầu như diễn ra cho mọi khung hình, nhưng vì mục đích hiệu suất:
- Compose tránh lặp lại công việc sẽ tính toán cùng một kết quả từ cùng một dữ liệu đầu vào trong tất cả các giai đoạn này. 
- Compose bỏ qua việc chạy một hàm composable nếu hàm đó có thể sử dụng lại kết quả cũ và giao diện người dùng Compose không bố cục lại hoặc vẽ lại toàn bộ tree nếu không cần thiết.
- Compose chỉ thực hiện khối lượng công việc tối thiểu cần thiết để cập nhật giao diện người dùng.
- Việc tối ưu hóa này có thể thực hiện được vì Compose theo dõi state reads trong các giai đoạn khác nhau.

## Understand the phases

Phần này mô tả cách thực thi ba giai đoạn Compose cho các composables một cách chi tiết hơn.

### Composition

In the composition phase.the Compose runtime executes composable functions and **outputs a tree structure** that represents your UI. 


![](../../../../../resources/composition.gif)

The tree representing your UI that is created in the composition phase.

A subsection of the code and UI tree looks like the following:
![](../../../../../resources/code-subsection.png)

Trong các ví dụ này, mỗi hàm có khả năng kết hợp trong mã sẽ ánh xạ tới một nút bố cục duy nhất trong cây giao diện người dùng. Trong các ví dụ phức tạp hơn, các thành phần kết hợp có thể chứa logic và luồng điều khiển, đồng thời tạo ra một cây khác với các State khác nhau.

### Layout

Trong Layout phase, Compose sử dụng UI tree được tạo trong giai đoạn composition làm đầu vào. Tập hợp các nút bố trí chứa tất cả thông tin cần thiết để quyết định kích thước và vị trí của từng nút trong không gian 2D.

![](../../../../../resources/layout.gif)

During the layout phase, the tree is traversed using the following **three step algorithm**:

1. **Measure children**: Một nút đo lường các nút con của nó nếu có.
2. **Decide own size**: Dựa trên các phép đo này, một nút sẽ quyết định kích thước của chính nó.
3. **Place children**: Mỗi nút con được đặt tương ứng với vị trí của nút đó.

**At the end of this phase, each layout node has:**
- Chiều rộng và chiều cao được chỉ định
- Tọa độ x, y nơi cần vẽ


Nhớ lại cây giao diện người dùng từ phần trước:

![](../../../../../resources/code-subsection.png)

Đối với cây này, thuật toán hoạt động như sau:

1. The `Row` measures its children, `Image` and `Column`.
2. The `Image` is measured. It doesn't have any children, so it decides its own size and reports the size back to the `Row`.
3. The `Column` is measured next. It measures its own children (two Text composables) first.
4. The first Text is measured. It doesn't have any children so it decides its own size and reports its size back to the `Column`.
    - The second Text is measured. It doesn't have any children so it decides its own size and reports it back to the `Column`.
5. The `Column` uses the **child measurements** to decide its own size. It uses the maximum child width and the sum of the height of its children.
6. The `Column` places its children relative to itself, putting them beneath each other vertically.
7. The `Row` uses the child measurements to decide its own size. It uses the maximum child height and the sum of the widths of its children. It then places its children.


> [!NOTE]
>Lưu ý rằng mỗi nút chỉ được truy cập một lần. Compose runntime chỉ yêu cầu một lần duyệt qua cây giao diện người dùng để đo lường và đặt tất cả các nút, giúp cải thiện hiệu suất. Khi số lượng nút trong cây tăng lên, thời gian duyệt qua nó sẽ tăng theo kiểu tuyến tính. Ngược lại, nếu mỗi nút được truy cập nhiều lần thì thời gian duyệt qua các node sẽ tăng theo cấp số nhân.

#### Build the custom layout in Compose

Calling the layout composable is the starting point of both the layout phase and building a custom layout. It accepts a composable content as it's children and measure policy for measuring and positioning it elements.All higher-level layout, like `Column` and `Row`, use this composable under the hood. Layout composable has currently three overloads. 

**1.** Layout for measuring and placing zero or more children, which accept one composable as content. 

```kotlin
//Layout.kt
inline fun Layout(
    content: @Composable @UiComposable () -> Unit,
    modifier: Modifier = Modifier,
    measurePolicy: MeasurePolicy
) {
    ..
}
```


**2.** Layout for leaf nodes of the UI tree, with precisely zero children, so it doesn't have content paramenter.

```kotlin
//Layout.kt
@Suppress("NOTHING_TO_INLINE")
@Composable
@UiComposable
inline fun Layout(
    modifier: Modifier = Modifier,
    measurePolicy: MeasurePolicy
) {..}
```

**3.** Layout that accepts content list for passing multiple different composables..

```kotlin
//Layout.kt
@Suppress("ComposableLambdaParameterPosition", "NOTHING_TO_INLINE")
@UiComposable
@Composable
inline fun Layout(
    contents: List<@Composable @UiComposable () -> Unit>,
    modifier: Modifier = Modifier,
    measurePolicy: MultiContentMeasurePolicy
) {...}
```


Once we entered the layout phase, wee see that it consists of two steps, **measurement and palcement**, in that specific order. Sizes of the child elements are calculated during the measure pass and their positions during the placement pass. The order of these steps is enforced with Kotlin DSL scopes, the content of the layout can be accessed as measureables, components that are now ready to be measured. Inside layout, measurables come as list by default. Depending on the requirements of your layout, you could either take this list and measure evey item with the same incoming constraints to keep its original predefined size or tweak its measurements as needed by copying over constraints you wish to keep and overriding the ones you wish to change.


```kotlin
@Composable
fun CustomLayout(
    content: @Composable () -> Unit,
    modifier: Modifier = Modifier
) {
    Layout(content  = { //TODO },measurePolicy = { measurables, constraints ->
        // MEASUREMENT SCOPE
        // 1. Measurement step
        // Determine sizes of components

        measurables // Ready to measured!

        /**
        **Very important feature of the layout phase is single pass measurement.** 
        This mean the layout element may not measure at any of its children more than once. 
        Single pass element is good for performance, allow Compose to efficiently handle deep UI trees. 
        Measuring a list of measurables would, in return, give a list of placeables
        **/

        val placeables = measurables.map{ 
            it.measure(
                constraints.copy(
                    minWidth = constraints.minWidth + 10
                    maxWidth = constraints.maxWidth + 10
                )
            )
        }


        layout(placeables.sumOf { it.width }, placeables.sumOf{ it.height }){
            //PLACEMENT SCOPE
            /**
            The placement step starts by calling the layout function and entering placement scope. 
            At this point, the parent layout will be able to decide on its own size, 
            for example , by summing up the widths and the heights of all its child placeables.
            **/
            //2. Placement step
            /**
             Placement scope now allows us use all placeables that came as result of measurement. 
            To start placing children, we need their starting x and y coordinates.
            Once we define where we want the children to be positioned
            **/
            val xPosition = 0
            val yPosition = 0

            placeables // Ready to placed

            /**
                 we call `place()` to conclude with the placement pass.
                 And with that, we end the placement step, as well as the layout phase.
                 Your custom layout is now ready to be used and reused.
            **/
            placeables.map { it.place(xPosition, yPosition)}

        }

    })
}

```

Using the layout composable to create a custom layout enable to you mainipulate all children elements and manually control their sizing and positioning.

**However, there are cases when creating a custom layout just from controlling one specific element is overkill and not necessary.** In this casses, rather than using custom layout, use the layout Modifier, which allow you to measure and layout just one single wrapped element

Example :
<div style="display: flex; align-items: center;">
  <img src="../../../../../resources/layout_modifier.png" alt="Image" style="margin-right: 10px; width:30%"/>
  <p>

```kotlin
@Composable
fun LayoutModifierExample(){
    Coulmn(
        modifier = Modifier
        .fillMaxWidth
        .background(Color.LightGray)
        .padding(40.dp)
    ){
        Element()
        Element()
        //Item below should rebel against the enforced padding and go edge to edge
        Element(modifier = Modifier.layout{ measurables, constraints ->
            val placeable = measureable.measure(
                constraints.copy(
                    maxWidth = constraints.maxWidth + 80.dp.roundToPx()
                )
            )

            layout(placeabe.width, placeable.height){
                placeable.place(x = 0,y = 0)
            }
        })
        Element()
    }
}
```

  </p>
</div>

#### Subcompose Layout

<details>
  <summary style="color: orange;">
  <b>
  Think about usecases
  </b>
  </summary>
  
  <p>
  
you're building a list of 1000 item that simply cannot fit on the screen at the same time. In that case, composing all these child items would be unnecessary waste of resources.
Instead, a better approach would be to measure all of list items to obtain their sizes, then base on that, calculate how many items can fit available viewport.
And finally


  </p>
</details>

**Compose only items that would be visible. This is the main ideas behind `Subcompose Layout`. It needs to do the measurement pass first for some child composeables, and then secondly to use that size information to determine whether to compose other children**. Meaning the measurement step in the layout phase need to happen before the composition phase of some children.This deferred composition is called subcomposition,and it is precisely why lazy components are build on top of subcompose layout, which enables them to add content on demand while scrolling.

![](../../../../../resources/subcomnpose_layout.png)

#### BoxWithConstraints

BoxWithConstraints also uses subcompose layout under the hood, It grants you access to incoming constraints like max height, from the parent, whitch are not available in regular layouts. This is because the layout the measurement step of some children is done before the composition of others.You can use obtain constraints to decide whether to compose a child or not.


> [!CAUTION]
> Subcompose layout can have impact on performance because a Subcomposed lauyout changes the usual flow of compose phase, There are certain costs and limitations when it comses to performance. so you need to decide whether to compose a child or not.
>|       ✅      |       ❌       |
>| -------------- | -------------- |
>| At least one child's composition depends on the result of another child's measurement | Requiring one child's measurement to measure other children |

#### Instrinsic measurements

There are use cases when the parent layout needs to know some information about its children before measurung them so that it can use this information for defining and passing down constraints And this is precisely what intrinsic measurements do. They let you query children before they're measured.

<details>
  <summary style="color: orange;">
  <b>
For example
  </b>
  </summary>
  
  <p>

We want this column items to have the same width or to be more precise, have each item's width as that
of widest child. In our case, the and modifiers item. But we also want that child to take as much width as it needs.

```kotlin

@Composeable
fun IntrinsicExample(){
    Column(modifier = Modifier.background(Color.LightGray).width(InstrinsicSize.Max)){
        ...
    }
}

```


  </p>
</details>

### Drawing

Trong giai Drawing, cây lại được duyệt từ trên xuống dưới và lần lượt từng nút sẽ tự vẽ trên màn hình.

![](../../../../../resources/drawing.gif)

**Figure 1**. The drawing phase draws the pixels on the screen.

Sử dụng ví dụ trước, nội dung cây được vẽ theo cách sau:

- The `Row` draws any content it might have, such as a background color.

- The `Image` draws itself.

- The `Column` draws itself.

- The first and second `Text` draw themselves, respectively.

![](../../../../../resources/drawing-ui-tree.gif)

**Figure 1**. A UI tree and its drawn representation.

## State reads

When you read the value of a snapshot state during one of the phases listed above, Compose automatically tracks what it was doing when the value was read. This tracking allows Compose to re-execute the reader when the state value changes, and is the basis of state observability in Compose.

State thường được tạo bằng cách sử dụng mutableStateOf() rồi truy cập thông qua một trong hai cách: bằng cách truy cập trực tiếp vào thuộc tính value hoặc bằng cách sử dụng ủy quyền thuộc tính Kotlin. Bạn có thể đọc thêm về chúng trong State trong các thành phần kết hợp. Vì mục đích của hướng dẫn này, "state reads" đề cập đến một trong các phương thức truy cập tương đương đó.

```kotlin
// State read without property delegate.
val paddingState: MutableState<Dp> = remember { mutableStateOf(8.dp) }
Text(
    text = "Hello",
    modifier = Modifier.padding(paddingState.value)
)
```

```kotlin
// State read with property delegate.
var padding: Dp by remember { mutableStateOf(8.dp) }
Text(
    text = "Hello",
    modifier = Modifier.padding(padding)
)
```

Bên dưới vỏ bọc của property delegate, các hàm "getter" và "setter" được sử dụng để truy cập và cập nhật giá trị của State. Các hàm getter và setter này chỉ được gọi khi bạn tham chiếu thuộc tính dưới dạng giá trị chứ không phải khi nó được tạo, đó là lý do tại sao hai cách trên là tương đương nhau.

> [!NOTE]
> Each block of code that can be re-executed when a read state changes is a restart scope. Compose keeps track of state value changes and restart scopes in different phases.

## Phased state reads

As mentioned above, there are three main phases in Compose, and Compose tracks what state is read within each of them. **This allows Compose to notify only the specific phases that need to perform work for each affected element of your UI.**

> [!NOTE]
> Việc tạo và lưu trữ một thể hiện state (state instance) ít ảnh hưởng đến các giai đoạn (phases), điều quan trọng chỉ là khi và nơi mà một giá trị state được đọc.

### Phase 1: Composition

State reads within a @Composable function or lambda block affect composition and potentially the subsequent phases. When the state value changes, the recomposer schedules reruns of all the composable functions which read that state value. Note that the runtime may decide to skip some or all of the composable functions if the inputs haven't changed. See [Skipping if the inputs haven't changed](../UIArchitecture/LifecycleOfComposables.md) for more information.


```kotlin
var padding by remember { mutableStateOf(8.dp) }
Text(
    text = "Hello",
    // The `padding` state is read in the composition phase
    // when the modifier is constructed.
    // Changes in `padding` will invoke recomposition.
    modifier = Modifier.padding(padding)
)

```


### Phase 2: Layout

The layout phase consists of two steps: **measurement** and **placement**. The measurement step runs the measure lambda passed to the `Layout` composable, the `MeasureScope.measure` method of the `LayoutModifier` interface, and so on. The placement step runs the placement block of the layout function, the lambda block of `Modifier.offset { … }`, and so on.

State reads during each of these steps affect the layout and potentially the drawing phase. When the state value changes, Compose UI schedules the layout phase. It also runs the drawing phase if size or position has changed.

To be more precise, **the measurement step and the placement step have separate restart scopes, meaning that state reads in the placement step don't re-invoke the measurement step before that**. However, these two steps are often intertwined, so a state read in the placement step can affect other restart scopes that belong to the measurement step.

```kotlin
var offsetX by remember { mutableStateOf(8.dp) }
Text(
    text = "Hello",
    modifier = Modifier.offset {
        // The `offsetX` state is read in the placement step
        // of the layout phase when the offset is calculated.
        // Changes in `offsetX` restart the layout.
        IntOffset(offsetX.roundToPx(), 0)
    }
)
```

### Phase 3: Drawing

State reads during drawing code affect the drawing phase. Common examples include `Canvas()`, Modifier.drawBehind, and `Modifier.drawWithContent`. When the state value changes, Compose UI runs only the draw phase.

```kotlin
var color by remember { mutableStateOf(Color.Red) }
Canvas(modifier = modifier) {
    // The `color` state is read in the drawing phase
    // when the canvas is rendered.
    // Changes in `color` restart the drawing.
    drawRect(color)
}
```

![](../../../../../resources/phases-state-read-draw.svg)

## Optimizing state reads

As Compose performs localized state read tracking, **we can minimize the amount of work performed by reading each state in an appropriate phase.**

Let’s take a look at an example. Here we have an Image() which uses the offset modifier to offset its final layout position, resulting in a parallax effect as the user scrolls.


For Example:

```kotlin
Box {
    val listState = rememberLazyListState()

    Image(
        // ...
        // Non-optimal implementation!
        Modifier.offset(
            with(LocalDensity.current) {
                // State read of firstVisibleItemScrollOffset in composition
                (listState.firstVisibleItemScrollOffset / 2).toDp()
            }
        )
    )

    LazyColumn(state = listState) {
        // ...
    }
}
```

This code works, but results in nonoptimal performance.
 As written, the code reads the value of the `firstVisibleItemScrollOffset` state and passes it to the `Modifier.offset(offset: Dp)` function. As the user scrolls the `firstVisibleItemScrollOffset` value will change. As we know, Compose tracks any state reads so that it can restart (re-invoke) the reading code, which in our example is the content of the `Box`.

This is an example of state being read within the composition phase. This is not necessarily a bad thing at all, and in fact is the basis of recomposition, allowing data changes to emit new UI.

In this example though it is nonoptimal, because every scroll event will result in the entire composable content being reevaluated, and then also measured, laid out and finally drawn. 

**We’re triggering the Compose phase on every scroll even though what we are showing hasn’t changed, only where it is shown. We can optimize our state read to only re-trigger the layout phase.**

```kotlin
Box {
    val listState = rememberLazyListState()

    Image(
        // ...
        Modifier.offset {
            // State read of firstVisibleItemScrollOffset in Layout
            IntOffset(x = 0, y = listState.firstVisibleItemScrollOffset / 2)
        }
    )

    LazyColumn(state = listState) {
        // ...
    }
}
```

So why is this more performant? The lambda block we provide to the modifier is invoked during the layout phase (specifically, during the layout phase's placement step), **meaning that our `firstVisibleItemScrollOffset` state is no longer read during composition.** Because Compose tracks when state is read, this change means that if the firstVisibleItemScrollOffset value changes, **Compose only has to restart the layout and drawing phases.**

> [!NOTE]
> You might wonder if taking a lambda parameter might add extra cost compared to taking a simple value. It does. **However, the benefit of limiting the state read to the layout phase overweighs the cost in this case.** The value of firstVisibleItemScrollOffset changes every frame during scroll, and by deferring the state read to the layout phase, we can avoid recompositions all along.

> [!IMPORTANT]
> Try to localize state reads to the lowest possible phase, enabling Compose to perform the minimum amount of work.

## Recomposition loop


Trước đó, chúng ta đã đề cập rằng các giai đoạn của Compose luôn được gọi theo cùng một thứ tự và không có cách nào để quay lại trong cùng một khung hình. Tuy nhiên, điều đó không ngăn cản ứng dụng rơi vào composition loops qua các khung hình khác nhau. Hãy xem xét ví dụ sau:

```kotlin
Box {
    var imageHeightPx by remember { mutableStateOf(0) }

    Image(
        painter = painterResource(R.drawable.rectangle),
        contentDescription = "I'm above the text",
        modifier = Modifier
            .fillMaxWidth()
            .onSizeChanged { size ->
                // Don't do this
                imageHeightPx = size.height
            }
    )

    Text(
        text = "I'm below the image",
        modifier = Modifier.padding(
            top = with(LocalDensity.current) { imageHeightPx.toDp() }
        )
    )
}
```
> **Note**
>Here we have (badly) implemented a vertical column, with the image at the top, and then the text below it. We’re using Modifier.onSizeChanged() to know the resolved size of the image, and then using Modifier.padding() on the text to shift it down. The unnatural conversion from Px back to Dp already indicates that the code has some issue.

> **Note**
>**The issue with this example is that we don’t arrive at the "final" layout within a single frame**. The code relies on multiple frames happening, which performs unnecessary work, and results in UI jumping around on screen for the user.

Readmore the reason at [here](https://developer.android.com/develop/ui/compose/phases#phase1-comp)

> **The fix for the sample above is to use the proper layout primitives**. The example above can be implemented with a simple Column(), but you may have a more complex example which requires something custom, which will require writing a custom layout. See the Custom layouts guide for more information.

**The general principle here is to have a single source of truth for multiple UI elements that should be measured and placed with regards to one another**. Using a proper layout primitive or creating a custom layout means that the minimal shared parent serves as the source of truth that can coordinate the relation between multiple elements. Introducing a dynamic state breaks this principle.