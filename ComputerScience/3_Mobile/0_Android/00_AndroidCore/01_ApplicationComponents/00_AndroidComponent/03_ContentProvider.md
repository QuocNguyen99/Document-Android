# Android Content Provider

## Overview

A **Content Provider** is one of the primary building blocks of Android application architecture. It manages access to a structured set of data and encapsulates the data, providing mechanisms for defining data security.

Content Providers are primarily used to:
- Share data between different apps.
- Access and manage app-private data using a standard interface.

## Use Cases

- Sharing contact information, media files, or calendar events across apps.
- Reading/writing data in SQLite databases, files, or other persistent storage.

## Key Components

### 1. `ContentProvider` Class

This is the abstract class that must be implemented to create a content provider. Key methods include:
- `onCreate()`: Initialize the provider.
- `query()`: Retrieve data.
- `insert()`: Add new data.
- `update()`: Modify existing data.
- `delete()`: Remove data.
- `getType()`: Return MIME type for the data.

### 2. `ContentResolver`

Used by client apps to access data from a content provider. It acts as a bridge between the provider and the consumer app.

### 3. `Uri`

A uniform resource identifier used to identify the data provided. Common URI format:


`content://<authority>/<path>/<id>`


## Creating a Content Provider

### 1. Extend `ContentProvider`

```java
public class MyProvider extends ContentProvider {
    @Override
    public boolean onCreate() {
        // Initialization logic
        return true;
    }

    @Override
    public Cursor query(...) {
        // Return data
    }

    @Override
    public Uri insert(...) {
        // Insert data
    }

    @Override
    public int delete(...) {
        // Delete data
    }

    @Override
    public int update(...) {
        // Update data
    }

    @Override
    public String getType(Uri uri) {
        // Return MIME type
    }
}
```
### 2. Declare in `AndroidManifest.xml`



```xml
<provider
    android:name=".MyProvider"
    android:authorities="com.example.myapp.provider"
    android:exported="true" />
```

## Accessing Data via `ContentResolver`

```kotlin
ContentResolver resolver = getContentResolver();
Cursor cursor = resolver.query(Uri.parse("content://com.example.myapp.provider/items"), null, null, null, null);
```

## Security and Permissions
- Use permissions (`android:permission`, `android:readPermission`, `android:writePermission`) to control access.

- Set `android:exported` to `false` to make a provider private.


## MIME Types
Custom MIME types should be used to describe data:

- Single item: `vnd.android.cursor.item/vnd.com.example.item`
- Multiple items: `vnd.android.cursor.dir/vnd.com.example.items`

## Best Practices
- Use `CursorLoader` or `LiveData` to access provider data asynchronously.
- Avoid blocking UI threads with direct queries.
- Handle `Cursor` lifecycle properly (close it when done).





















