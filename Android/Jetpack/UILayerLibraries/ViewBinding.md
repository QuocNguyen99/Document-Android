# ViewBinding

View binding is a feature that makes it easier to write code that interacts with views. Once view binding is enabled in a module, it generates a _binding class_ for each XML layout file present in that module. An instance of a binding class contains direct references to all views that have an ID in the corresponding layout.

## Differences from findViewById

View binding has important advantages over using `findViewById`:

* **Null safety:** since view binding creates direct references to views, there's no risk of a null pointer exception due to an invalid view ID. Additionally, when a view is only present in some configurations of a layout, the field containing its reference in the binding class is marked with `@Nullable`.
* **Type safety:** the fields in each binding class have types matching the views they reference in the XML file. This means there's no risk of a class cast exception.

These differences mean incompatibilities between your layout and your code result in your build failing at compile time rather than at runtime.

## Comparison with data binding

View binding and [data binding](https://developer.android.com/topic/libraries/data-binding) **both generate binding classes** that you can use to reference views directly. However, view binding is intended to handle simpler use cases and provides the following benefits over data binding:

* **Faster compilation:** view binding requires no annotation processing, so compile times are faster.
* **Ease of use:** view binding doesn't require specially tagged XML layout files, so it's faster to adopt in your apps. Once you enable view binding in a module, it applies to all of that module's layouts automatically.

On the other hand, view binding has the following limitations compared to data binding:

* View binding doesn't support [layout variables or layout expressions](https://developer.android.com/topic/libraries/data-binding/expressions), so it can't be used to declare dynamic UI content straight from XML layout files.
* View binding doesn't support [two-way data binding](https://developer.android.com/topic/libraries/data-binding/two-way).
