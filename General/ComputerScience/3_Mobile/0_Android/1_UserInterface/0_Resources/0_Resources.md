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

## Resource Qualifier

Resources need to be organized in specific directories with predefined names for Android to know which to choose and display in different scenarios. 

Those special directory names are known as **qualifiers** as they qualify the resources to be selected and displayed instead of the default resources.

Following up on our example of localizing your app, here is the resource directories tree that includes valid qualifiers for different languages:

```
res/
├── drawable/                  
│   └── ...
├── layout/                    
│   └── ...
├── values/            # Default resources for Values
│   ├── strings.xml    # Strings in English
│   └── ...
├── values-es/         # Values Resources for the Spanish language qualifier
│   ├── strings.xml    # Strings in Spanish
│   └── ...
├── values-fr/         # Values Resources for the French language qualifier
│   ├── strings.xml    # Strings in French
│   └── ...
└── ...
```

And here is a snapshot from the English file `values/strings.xml`:

```xml
<resources>
    <string name="app_name">My App</string>
    <string name="toast_message">Welcome to My App!</string>
    <string name="button1_text">Click Me</string>
    ------
</resources>
```

This file is the default file which means that strings would be pulled from it in all cases except only when the user's system languages are Spanish or French as these two have specific resource files defined for them with language qualifiers es and fr respectively.

And here is a snapshot from the Spanish file `values-es/strings.xml`:

```xml
<resources>
    <string name="app_name">Mi Aplicación</string>
    <string name="toast_message">¡Bienvenido a Mi Aplicación!</string>
    <string name="button1_text">Haz Clic</string>
    ------
</resources>
```

As you can see, the string resources for all translation files should have the same names, but with different values relevant to each locale.

## Screen orientation qualifiers

These qualifiers allow you to create specific resources customized for each orientation (landscape and portrait).

```
res/
├── drawable/                  
│   └── ...
├── values/                    
│   └── ...
├── layout/                  # Default Layout resource files
│   ├── activity_main.xml
│   └── ...
├── layout-land/
│   ├── activity_main.xml    # Layout resource files for landscape orientation 
│   └── ...
├── layout-port/
│   ├── activity_main.xml    # Layout resource files for portrait orientation
│   └── ...
└── ...
```
## Screen size qualifiers

Screen size qualifiers categorize Android devices based on their screen sizes
They are divided into 4 categories to provide optimized layouts and alternative resources for the different screen sizes.

- **small**: similar size to a low-density QVGA screen (320x426 dp units).
- **normal**: similar size to a medium-density HVGA screen (320x470 dp units).
- **large**: similar size to a medium-density VGA screen (480x640 dp units).
- **xlarge**: larger than a medium-density HVGA screen (720x960 dp units).




