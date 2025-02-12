# Parcel And Bundle

Quite often, you need to pass some objects between activities, store transient states across configuration changes, or send objects to system components or other applications.

In Android, we use a `Bundle` to pass data to Android components as a `key-value` data store. A `Bundle` can contain only certain types of objects:

- **Primitive types**
- **String**
- **Serializable** (a standard Java interface)
- **Parcelable** (an Android-specific interface)
- **Lists and arrays** of the types listed above

In this topic, we'll focus on `Parcelable` objects.

## Why do we need Parcelable?

`Parcelable` is an Android-specific approach for object serialization.
It was designed with certain optimizations to perform faster than the standard Java solution, but this is not our concern right now, especially given that you can get approximately equal speeds. The thing is that with `Parcelable` you can be sure at compile time that your object can be actually serialized, which is not the case if you use Java serialization.


> [!NOTE]
> Object Serialization is the process of converting an object into a format that can be easily stored, transmitted, and later reconstructed. This process is commonly used in programming to save objects to a file, send them over a network, or store them in a database.

## How do we implement it?


There are two simple ways to implement `Parcelable` in your project.

- You can create a class that implements `Parcelable`, override some methods, and add the static field:

```kotlin
class Person(
    val id: String?,
    val name: String?,
    val age: Int,
) : Parcelable {
    override fun describeContents(): Int {
        return 0
    }

    override fun writeToParcel(dest: Parcel, flags: Int) {
        dest.writeString(id)
        dest.writeString(name)
        dest.writeInt(age)
    }

    companion object {
        @JvmField
        val CREATOR: Parcelable.Creator<Person> = object : Parcelable.Creator<Person> {
            override fun createFromParcel(parcel: Parcel): Person {
                // we retrieve values in the same order we put it in
                return Person(parcel.readString(), parcel.readString(), parcel.readInt())
            }

            override fun newArray(size: Int): Array<Person?> {
                return arrayOfNulls(size)
            }
        }
    }
}
```

- Also, Kotlin provides us with an easy way to make an existing class `Parcelable`. We can use a special `@Parcelize` annotation on the class. Now you don't have to worry about overriding the `writeToParcel()` and `createFromParcel()` methods and creating the static `CREATOR` field — they will be created automatically.

To use this annotation, you should add a new plugin to the `build.gradle` file:

```groovy
plugins {
    ...
    id 'kotlin-parcelize'
}
```

Let's modify the previous version of the `Person` class with an annotation:

```kotlin
@Parcelize
class Person(
    val id: String,
    val name: String,
    val age: Int,
) : Parcelable
```

## Parcelable in a Bundle

As we said earlier, we use `Bundle` to pass data between activities and other Android components. A `Bundle` can hold Primitives, Strings, arrays of them, and `Parcelable`.

```kotlin
val bundle = Bundle()
bundle.putString("key", "value")
bundle.putParcelable("PersonKey", Person("0", "John", 22))
```
And, as simply as we put it in, we can retrieve the data:

```kotlin
val stringValue = bundle.getString("key") // "value"
val parcelableValue = bundle.getParcelable<Person>("PersonKey") // Person("0", "John", 22)
```

Where can we use it? For example, we can pass data to our activity with `Intent`:

```kotlin
val intent = Intent(this, Activity::class.java)
val bundle = Bundle()
bundle.putString("key", "value")
intent.putExtras(bundle)
startActivity(intent)
```

In the previous snippet, we added the bundle with the `putExtras()` method.
But how does it work? In fact, the intent has its own bundle `Intent.extras` that holds our values.
That is, we can add `Parcelable` right into Intent like this:

```kotlin
val intent = Intent(context, Destination::class.java)

intent.putExtra("person", Person("0", "John", 22))
context.startActivity(intent)
```

And this is how we retrieve data at the destination:

```kotlin
val person = if (Build.VERSION.SDK_INT >= 33) {
    // this is the new method but it could be used only with API >= 33
    intent.getParcelableExtra("person", Person::class.java)
} else {
    // the following method is deprecated in the API 33 but if your application minSdk < 33 you should use it
    intent.getParcelableExtra<Person>("person")
}
```

## PersistableBundle

Unlike `Serializable`, `Parcelable` is not designed to persistently store data. 

So if you want to save it persistently you have to convert it back and forth to some kind of persistable representation.
To solve this problem and use one class for both runtime and persistent data you can use `PersistableBundle`.

It is a persistent class that maps string keys to different types, which can be saved and later retrieved for use.
However, `PersistableBundle` supports fewer types than `Bundle`.

A regular `Bundle` can contain different (and also complex) custom data types, but it can be tricky to save that data persistently.

`PersistableBundle` supports the following types:

- Int
- Long
- Double
- IntArray
- DoubleArray
- PersistableBundle
- Boolean

But how can we write it persistently somewhere? If your app runs on API >= 30,
you can use `readFromStream()` and `writeToStream()` methods like this:

```kotlin
// Initialize OutputStream to the destination of your choice
val outputStream: OutputStream = ...

try {
    // Write serialized object to that destination
    persistableBundle.writeToStream(outputStream)
} finally {
    // Don't forget to close stream after you wrote your data
    outputStream.close()
}
// Initialize InputStream
// It is important that source file was written by writeToStream() of appropriate PersistableBundle,
// else it would be impossible to read
val inputStream: InputStream = ...

try {
    // Retrieve the object equal to original
    val retrievedPersistableBundle = PersistableBundle.readFromStream(inputStream)
} finally {
    // Close stream to avoid memory leaks
    inputStream.close()
}
```

if you want to store your bundle persistently, choose `PersistableBundle`.

































