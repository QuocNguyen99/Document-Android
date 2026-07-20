# XML Layouts


**Layouts** in Android are used to define the application user interface (UI).

Simply put, a layout is a visual template for your application screen that lets you control the properties and positions of your elements.

Creating layouts in XML files helps you separate your UI from your code. Every layout file should contain only one root element which must be either a **View** or a **ViewGroup** object.

- **ViewGroup** is a special View that can contain other Views. It is the base class for Layouts in Android. In other words, ViewGroup acts as an invisible container for the View objects. 
- **View** objects are simple blocks that respond to the user's actions.


## Connect your XML with the Activity

When you compile your app, all layouts are compiled into **layout** resources. 

When you launch your app, the function `onCreate()` can apply your XML file to the Activity by calling `setContentView()`. To pair XML with your Activity, type its name in the function `setContentView(R.layout.XML_FILENAME)`.

## Attributes


```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <TextView
        android:id="@+id/textView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello World!"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

`xmlns` which declares an XML namespace. Namespaces are used to get rid of tag name conflicts in XML files. In this case, we have `android`, `app`, and `tools`.

- `xmlns:android` namespace is used to access attributes that are provided by the Android platform. For example, you should use android namespace if you need to give some element an ID, set text to TextView, or change width or height.

- `xmlns:tools` is used to display UI elements only for viewing in the design mode and will not affect your built app.

- `xmlns:app` is used to access custom attributes defined in your app, by your code, or by libraries you import: in other words, attributes not defined by the Android.






