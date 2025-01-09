# Resources

A resource in an Android app is a file (for example, a layout file), or some value like a simple string. Resources can be layout files, strings, sound files, image files, and so on. All those resources are stored in the res folder.

Subdirectories are created in the res directory according to the resource types:


| Resource Type | Description                                                                                   |
|---------------|-----------------------------------------------------------------------------------------------|
| animator      | XML files that define property animation. Creates an animation by modifying an object's property values over a set period of time. |
| color         | XML files that define colors                                                                  |
| drawable      | Raster (.png, 9.png, .jpg, .gif) or XML (shape, selector, vector) files.                      |
| font          | Font files (.ttf, .otf, or .ttc) or XML files that include a `<font-family>` element          |
| mipmap        | Drawable files used for app icons of different screen densities                                |
| layout        | XML files that define the user interface of our app                                           |
| menu          | XML files that define menus                                                                   |
| raw           | Arbitrary files to save in their raw format (sounds, for example)                             |
| values        | XML files that contain strings, styles, dimensions                                            |
| xml           | Arbitrary XML files that can be parsed manually                                               |

Some subdirectories are present by default, while some others can be added manually.

There are two ways to access resources: in Java or Kotlin files, and in XML files. Let's take a look at both ways in detail.

## Accessing resources in XML

Links to the resources in XML files have the following syntax: `@[package_name:]resource_type/resource_name`, where:

- `package_name` represents the name of the package where the resource is located. If your resource is in the same package, package_name is optional.
- `resource_type` matches a resource subdirectory like drawable or layout, or a value resource type like color or string.
- `resource_name` is the filename without extension or the value of android:name attribute in the XML element.

Example:

```xml
<TextView
    android:layout_width="wrap_content"
    android:layout_height="wrap_content"
    android:text="@string/app_name" />
```

We can also use **built-in Android resources** by specifying android package: `android:text="@android:string/ok"`.

## Accessing resources in code

The build system generates `R.java` file containing identifiers for all application resources.

Even an empty project contains `res/layout/activity_main.xml`, and MainActivity makes it show in `onCreate()` method:

```kotlin
setContentView(R.layout.activity_main)
```

> [!CAUTION]
> Keep in mind: R class contains integer identifiers, not values. This is especially important when dealing with colors: they are integers, too.

