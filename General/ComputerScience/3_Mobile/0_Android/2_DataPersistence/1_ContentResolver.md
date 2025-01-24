# ContentResolver

Applications can exchange data with each other. Every operating system has its own machinery for local data exchange, and Android is not an exception.

## Background

In UNIX operating systems, you can talk to an already running (typically daemon) process using a named channel, which is a special kind of file accessible through the file system. Or you can open a socket to some known port (for example, 5432 for PostgreSQL, or 27015 for Counter-Strike).

The situation is different in Android: the processes are in general short-lived and quite cheap to start, and background processes can easily be killed to free up some memory for the visible application. That means constantly waiting for connections, creating channels, and binding ports becomes quite impractical. On the other hand, Android has a concept of an application which can be identified by its package name and is available for communication with the outside world through components exposed in the manifest file. This allows us to start an application if it has no running process, ask for some data, retrieve the answer, and leave the communication session to let the Android OS kill the process if it's not needed anymore.

For providing data, Android has a concept of ContentProvider. It is a manifest component for file and database operations implemented by the owner of data. For example, the Phone app provides call history, and the Gallery app provides photos and videos. In this topic, we will talk about its counterpart, ContentResolver, which allows retrieving or modifying this data without owning it.

## Querying application content


To perform a query, we need several arguments:

- Content Uri pointing to some data in a specific provider. Generally, Uri syntax is scheme://authority/path?query#fragment, but in our case scheme will be content, authority will be the identifier of a content provider, and the path part is provider-specific.

- Optional projection, an array of table column names for the SQL SELECT statement. If not specified, interpreted as SELECT *.

- Optional selection and its arguments for the SQL WHERE clause.

- Optional sort order for the SQL ORDER BY clause.


To sum up, a query should be interpreted like SELECT projection FROM some.application.provider/path WHERE selection(args) ORDER BY sortOrder. Let's consider an example.

Any application can declare its own content providers, but there are also some built-in ones. For our example, we will use standard MediaStore.Images.Media.

Assuming we have the required android.permission.READ_EXTERNAL_STORAGE permission declared and granted, let's ask Gallery for images and output the result to logcat:

```kotlin
contentResolver.query(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    arrayOf(
        MediaStore.Images.ImageColumns._ID,
        MediaStore.Images.ImageColumns.WIDTH,
        MediaStore.Images.ImageColumns.HEIGHT,
        MediaStore.Images.ImageColumns.DISPLAY_NAME,
    ),
    null, null, null,
)?.use { c ->
    while (c.moveToNext()) {
        println("#${c.getInt(0)} ${c.getInt(1)}x${c.getInt(2)} ${c.getString(3)}")
    }
}
```

Here, contentResolver is requested on a Context object, EXTERNAL_CONTENT_URI is the Uri equal to content://media/external/images/media and pointing to the built-in gallery, _ID, WIDTH, HEIGHT and DISPLAY_NAME are column names, and nulls are for the SQL WHERE and ORDER BY clauses. The query() function itself returns a Cursor which we use to retrieve the requested data. And here's sample output:


```bash
#16381 960x640 IMG_20190612_094235_278.jpg
#16382 1280x1042 IMG_20190612_094319_554.jpg
#20160 960x1280 IMG_20190723_164455_836.jpg
#20184 1280x960 IMG_20190725_101159_817.jpg
#102052 1201x1600 IMG-6ebc062cbe3ae090471ad589956f3728-V.jpg
#106869 1080x1920 Screenshot_20210221-215728_Firefox.png
#114634 1080x1920 Screenshot_20210312-213908_Files.png
#114658 741x721 Drakeposting.jpg
#114679 1080x1920 Screenshot_20210408-025741_Fennec.png
#123136 1080x1920 Screenshot_20210423-000157_Telegram_FOSS.png
#123137 1080x1920 Screenshot_20210423-000208_Telegram_FOSS.png
#123208 1080x1920 Screenshot_20210530-023249_Fennec.png
#128659 300x300 1206-SMD-Resistor-1206-Resistor-.jpg
#132046 937x1070 Big_Smoke.jpg
#136196 1080x1920 Screenshot_20211013-150809_Telegram_FOSS.png
#136198 1080x1920 Screenshot_20211016-022700_Telegram_FOSS.png
#136233 1080x1920 Screenshot_20211109-131236_Slack.png
```

If you need to constrain the query somehow, here's an example of fetching images with width and height greater than 1000px and ordered by area:

```kotlin
contentResolver.query(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    arrayOf(
        MediaStore.Images.ImageColumns._ID,
        MediaStore.Images.ImageColumns.WIDTH,
        MediaStore.Images.ImageColumns.HEIGHT,
        MediaStore.Images.ImageColumns.DISPLAY_NAME,
    ),
    "${MediaStore.Images.ImageColumns.WIDTH} > ? AND ${MediaStore.Images.ImageColumns.HEIGHT} > ?",
    arrayOf("1000", "1000"),
    MediaStore.Images.ImageColumns.WIDTH + " * " +
        MediaStore.Images.ImageColumns.HEIGHT,
)
```

The full range of CRUD operations is available, so you can use the insert, update, delete functions like it's an SQLiteDatabase, if they are supported by the particular ContentProvider used to serve your request.

## Modifying data

Deleting is not rocket science: you just pass an Uri of a specific record, or table Uri and filter condition, to the delete() function and that's it.

Updating and inserting functions are far more interesting because they carry some data. Row contents are represented by ContentValues. It is a heterogeneous map, similarly to Bundle, but with less data types supported. Type set is restricted by SQLite database which can handle only INTEGER (Byte..Long), REAL (Float..Double), TEXT (String), and BLOB (ByteArray).

As a result, the insert() function returns the Uri of the new row. When dealing with MediaStore, we insert() the metadata, openOutputStream(), and feed in media contents.

In a simplified form, this may look like this:

```kotlin
val uri = contentResolver.insert(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    ContentValues().apply {
        put(MediaStore.Images.Media.TITLE, title)
        put(MediaStore.Images.Media.DESCRIPTION, description)
        put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
    }
)
contentResolver.openOutputStream(uri!!)!!.use { out -> 
    sourceFile.inputStream().use {
        it.copyTo(out)
    }
}
```

In practice, an image can be inserted using the MediaStore.Images.Media.insertImage() function, but now you know how to insert data into any content provider, not just MediaStore.

## File operations

In the previous example, the Uri was pointing to a database table. Some other Uris may point to files, meaning that you can read or even write them using ContentResolver. Note that the underlying file system entry may not be accessible to you, or may even not exist if the ContentProvider uses some virtual file system like a zip file. A content provider should be treated like a black box hiding some implementation from you.

Proceeding with the Gallery example, separate images are files. Uris pointing to them can be obtained in several ways, for example:

- By concatenating a path with id. Some utility functions serving this purpose are available.

```kotlin
val imageUri =
    ContentUris.withAppendedId(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, id)
```

- By starting an activity for Intent(Intent.ACTION_PICK, Media.EXTERNAL_CONTENT_URI) to let the user choose a single image from the Gallery. As an activity result, another Intent will be returned with intent.data containing the Uri of the selected image, for example, content://media/external/images/media/149214.


What can we do with it?


- Show the image: just call imageView.setImageURI(intent.data). ImageView will fetch the image on its own. Alternatively, any image loading library like Picasso or Glide can do the same thing asynchronously to avoid freezing UI while the image is being read from the file system and decoded.

- Save Uri and preserve access to it by calling contentResolver.takePersistableUriPermission: this will make that data accessible across device reboots. Keep in mind that this doesn't make the data locked, it can still be deleted by the user.

- Copy the image to your app's private data: contentResolver.openInputStream(intent.data) will return an InputStream which can be read from, and copying InputStream to a file is a common operation.

- Get file descriptor for more advanced file operations: contentResolver.openFileDescriptor returns a ParcelFileDescriptor that enables us to do the same I/O operations as java.io.File does but can also be sent between applications (that's why it's Parcel). The operations involve not only reading and writing, but also locking and mapping. Here's an example of read-only memory-mapping to gain random access to file contents:

```kotlin
contentResolver.openFileDescriptor(intent.data!!, "r")!!.use {
    val buffer = FileInputStream(it.fileDescriptor)
        .channel.map(FileChannel.MapMode.READ_ONLY, 0, it.statSize)
}
```

This technique is used by the MediaPlayer class because, unlike plain sequential InputStream, the file descriptor can give a seekable data source required to let the user play some audio or video from a specific point, not only from the beginning.


## Files and resources

content:// is not the only Uri scheme supported by ContentResolver. There are also android.resource:// and file://.

Opening a file doesn't look like a very practical option because plain files can be opened directly through java.io.File. But this feature provides some compatibility: for example, an application could return a content:// Uri or a file:// one, and its user will see no difference.

The same applies to resource Uris: android.resource://com.example.app/drawable/something_beautiful or "android.resource://com.example.app/" + R.drawable.something_beautiful are just normal Uris that can be treated the same way as it's done with content://.


## Remote method call

Apart from requesting a Cursor, inserting ContentValues, or exchanging files, content provider-resolver machinery supports simple remote method call interface. There's a call(uri: Uri, method: String, arg: String?, extras: Bundle?): Bundle? method to allow ContentProviders implement custom methods, and let ContentResolvers invoke them and receive results.

## Conslusion

ContentResolver is a tool for interacting with other applications' data. It supports CRUD database operations, file operations, and custom method calls. Database operations are widely used across Android OS to access media metadata, call logs, contacts, user's dictionary, and settings. The whole list of built-in content providers is available and could be extremely helpful in certain situations. File operations are necessary for getting media that is too big to be passed as a string or byte array, and require random access for audio and video to be seekable.


## reference
- [ContentResolver](https://hyperskill.org/learn/step/24720)