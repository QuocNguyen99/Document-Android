# RecyclerView

**RecyclerView** is a component for creating scrollable lists. It's used in almost every modern Android app and was introduced as a replacement for **ListView**, which has a lot of flaws. In this topic, you'll discover that RecyclerView isn't as scary as it might initially seem and learn how to use it in your projects.

## About RecyclerView

RecyclerView was introduced with Android 5.0. It's available in the Support Library and can also be used with older Android versions.

The main idea of RecyclerView is to create dynamic lists. It's flexible, feature-rich, and efficient in terms of resource usage. It contains the word "Recycler" in its name for a reason: when the View is scrolled off the screen, it disappears but isn't destroyed. Instead, it will be reused by new items that are about to be shown on the screen. ListView can technically do this, too. But it needs the help of an **Adapter** with a **ViewHolder**, and this requires a lot of boilerplate code. RecyclerView's performance is much better, so it's great for working with large data sets. All you have to do is define how the items should look and supply the necessary data.

RecyclerView can host Views in several different ways: vertically, horizontally, or in a grid. A **LayoutManager** is used to arrange them. And the RecyclerView library provides three LayoutManagers out of the box: `LinearLayoutManager`, `GridLayoutManager`, and `StaggeredGridLayoutManager`. It's also possible to create your own LayoutManager or use a third-party one.

As explained, RecyclerView is used to display data. The way each item looks can be defined in the relevant XML files. And `RecyclerView.Adapter` is utilized to make a View for each item and fill it with your data. You may already be familiar with Adapters: they're also used with `Spinner`, `GridView`, `ListView`, etc.

## recyclerview adapter method

- `onCreateViewHolder()` creates ViewHolders, as its name implies. ViewHolders are needed for all the items that will be shown in the RecyclerView. They're created for the number of items that can fit on the screen at any one time and will be reused.
- `onBindViewHolder()` is used to bind the data from the item to the View. It gets called multiple times with the same set of holders to enable reuse.
- `getItemCount()` allows RecyclerView to determine the total number of items in the list.

You might be wondering, "what is `LayoutInflater` and what's actually happening here?" `LayoutInflater` is a class that can turn layouts into View objects, which is exactly what we need. The method responsible for this is `inflate()`. And we pass it three arguments: the ID of the layout resource we require, the root **ViewGroup** to use, and `false`, which specifies that an attachment should not be made to the parent. We are then able to receive a View object.

## reference:

- [Recyclerview](https://hyperskill.org/learn/step/18600)
























