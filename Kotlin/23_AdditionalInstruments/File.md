# File

The core class for file processing is **File** from the `java.io` package. Kotlin provides additional functionality over Java implementation through **Extension Functions**. This means that by just importing `java.io.File` into your project, you can use functionality from both Java and Kotlin File implementations. Let's take a closer look at these extension functions.

### readText
First, there is `readText()` which helps you read the whole file in just one String variable.

```kotlin
import java.io.File


val fileName = "src/reading.txt"
val lines = File(fileName).readText()
print(lines)
```

As you see, we made a mistake and tried to read a different file – new.txt. If there is no such file in the file system, then `FileNotFoundException` is thrown.

Actually, our `file` variable didn't open the file, it just provided a reference with the path to it. What's more, `readText()` automatically opened and closed the file!


We can also provide specific charset for reading the file:

```kotlin
val line = File(fileName).readText(Charsets.US_ASCII)
```

Just keep it in mind that by default `readText()` has `UTF-8` charset encoding, but you can change it whenever you want. Also, Kotlin doesn't recommend using this function with files larger than 2 Gb, because this may cause `OutOfMemoryError`.

### readLines

Function `readLines()` provides the functionality of reading all lines from a file and storing them in a **List**:

```kotlin
val fileName = "src/reading.txt"
val lines = File(fileName).readLines()
for (line in lines){
    println(line)
} 
```

### readBytes


Function `readBytes()` may be helpful if you need to store file contents as an array of bytes:

> [!NOTE]
> This function returns the ByteArray. The Array structure is similar to the MutableList, you cannot resize it, but you can modify elements. You can easily convert MutableList to ByteArray and vice versa with toByteArray() and toMutableList() functions.


It's still not recommended using this option with large files (2 Gb or more). This method is used as an implementation of `readText()` function with conversion to String in Kotlin source files.

### forEachLine

`forEachLine()` is the recommended way of reading large files:

```kotlin
val fileName = "src/reading.txt"
File(fileName).forEachLine { println(it) }
```

This lambda reading approach provides an action (println() in our case) for each line.


It's always a possibility that the file you're going to read has already been opened in another process, or it might have access restrictions. In such cases, `AccessDeniedException` is thrown.

### File separator

In our examples, we used the `fileName` variable with the path value `src/reading.txt`. Note that the file path separator is a platform-dependent character. For example, for Windows it is `\`, and for UNIX and MAC it is `/`.

To avoid errors when accessing the file, we can use `File.separator` from the library `java.io.File`. `File.separator` returns the value of the system separator depending on the system used. Thus, our example can be as follows:

```kotlin
val separator = File.separator
val fileName = "src${separator}reading.txt"
val lines = File(fileName).readLines()
for (line in lines){
    println(line)
}
```

### Writing files

Writing files with `writeText()`.  create a `File(pathName: String)` object, and use the `writeText(text: String)` function which sets the text content of a file:


```kotlin
val myFile = File("MyFile.txt") //file name must be indicated in parentheses 
myFile.writeText("It is awfully hard work doing nothing!")
```

**Notice, if you just create a File object, you will not create a file, it's just an object.**

If the file has access restrictions or has already been opened in another process, `AccessDeniedException` is thrown.

### Overwriting and appending

For this, you can use the same feature `writeText()` for `File()`, which specifies the path to the document we want to overwrite. 

Okay, and what if you wanted to retain the current content of the file and add something else to it? Then we’ll need the `appendText(text: String)` function:

### Writing byte arrays

Sometimes you need to write `Bytes`, not `Strings`. Let's briefly consider two other options for file writing. 
- `writeBytes(array: ByteArray)` – with this function, we can write an array of bytes to this file.

```kotlin
val arrayOfBytes = byteArrayOf(1, 2, 3) // create an array
File(fileName).writeBytes(arrayOfBytes)
```
- `appendBytes(array: ByteArray)` – this function is analogous to the `appendText()` method, only applied to an array of bytes:

```kotlin
val arrayOfBytes = byteArrayOf(0, 1, 2)
File(fileName).appendBytes(arrayOfBytes)
```
## File Hierarchies
You can organize the data you store on a disk by arranging files into directories. A parent directory can include other directories, also known as subdirectories, resulting in a file hierarchy. 

### Files and Directories

Kotlin offers various methods to work with directories and files. For instance, you might use the `java.io` library. Let's review some of the most popular methods:

- `File.isDirectory` checks if the File is a directory.

- `File.isFile` verifies if the File is indeed a file.

- `File.exists()` checks for the file's existence.

- `File.resolve(String)` returns a file with the name String in a - directory.

- `File.resolve(File)` returns a file File from a directory.

- `File.createNewFile()` creates a new file.

- `File.mkdir()` crafts a new directory.

### Methods for Iterating Through File Hierarchies

You can navigate through file hierarchy using the `java.io.File` methods:

- `File.getParentFile()` returns an instance of `java.io.File` that represents the parent directory of a file, or `null` if the file doesn't have a parent (indicating it is the root).

- `File.getParent()` returns a string representation of the parent directory of a file, or `null` if the file doesn't have a parent.

- `File.listFiles()` returns an array of files located in a given directory, or `null` if the instance is not a directory.

- `File.list()` returns an array of files and directories in the directory specified by this abstract pathname.

The `kotlin.io` provides special methods that enable you to go through the entire file hierarchy. Let's examine three fundamental methods:

- `File.walk(direction)`: `FileTreeWalk` provides the files and directories in this directory that you can visit; you need to specify the way you'll iterate (up or down the hierarchy structure).

- `File.walkBottomUp()`: `FileTreeWalk` offers the directories and files in this directory that you can visit. It employs a depth-first search, visiting directories after all their files have been visited.

- `File.walkTopDown()`: `FileTreeWalk` offers the directories and files in this directory for you to visit. A depth-first search is used, and the directories are visited before all their files.

The `FileTreeWalk` class is designed to `iterate` through a given file system. It lets you traverse all the files within a directory. The iterator method returns an iterator that traverses the files. You can `iterate` over this structure or convert it to a list with the `toList()` function.

## Path

In kotlin `Path` converts the name sequence specified with the base path string and a number of subpaths additional names to a Path object of the default filesystem to perform basic operations on files and directories easily. 

- `Path.listDirectoryEntries()`: we can obtain the list of files in a given directory.

- `Path.copyTo()`: copy a source to a destination.

- `Path.moveTo()`: move a file to a new destination.

- `Path.writeText()`: create a new text file.

- `Path.readText()`: read the full file as string.

- `Path.readLines()`: read a full file as a collection of lines.

- `Path.walk()`: for visiting directories recursively in an efficient manner.

- `Path.copyToRecursively()`: for copying a whole directory and its content to another path.


## Working with File Hierarchies 

### Getting directory contents and directory's /file's parent with File and Path

The `Files.listFiles()` function prints the contents (files and directories) of a chosen directory 
also you can use `Path.listDirectoryEntries()`.

```kotlin
// with File
val helloWorld = File("/Files/CompletedProjects/HelloWorld")
val helloWorldFilesNames = helloWorld.listFiles().map{it.name} // [Doc.pdf, Reviews.txt]

val reviews = File("/Files/CompletedProjects/HelloWorld/Reviews.txt")
val reviewsFiles = reviews.listFiles() // null

val soundtracks = File("/Files/Music/SoundTracks")
val soundtracksFiles = soundtracks.listFiles() // []

// with Path
val helloWorld = Path("/Files/CompletedProjects/HelloWorld")
val helloWorldFilesNames = helloWorld.listDirectoryEntries().map { it.name } // [Doc.pdf, Reviews.txt]

val reviews = Path("/Files/CompletedProjects/HelloWorld/Reviews.txt")
val reviewsFiles = if (reviews.isDirectory()) reviews.listDirectoryEntries() else emptyList() // []

val soundtracks = Path("/Files/Music/SoundTracks")
val soundtracksFiles = if (soundtracks.isDirectory()) soundtracks.listDirectoryEntries() else emptyList() // []
```

`reviewsFiles` is `null` because reviews is not a directory at all 
and can't include other files or subdirectories. 
On the other hand, `soundtracks` is a directory without files, so the result is an empty array.

The `File.parent` or `Path.parent` property gives you the name of a file's or directory's parent.


`The File.parentFile` or `Path.parentFile` property provides a file's or directory's parent as a `File`.

We have mentioned the `File.walk(direction)` method for going through file hierarchy before.
The direction attribute outlines the way we traverse our file hierarchy; it can be either `FileWalkDirection.BOTTOM_UP` or `FileWalkDirection.TOP_DOWN`.
Also, you can use `Path.walk()` and use the sequence or iterable option to perform the direction.

```kotlin
// with File
val files: File = File("/Files")
println("TOP_DOWN: ")
files.walk(FileWalkDirection.TOP_DOWN).forEach { println(it) }

println("BOTTOM_UP: ")
files.walk(FileWalkDirection.BOTTOM_UP).forEach { println(it) }

// with Path
val dir: Path = Path("/Files")
println("TOP_DOWN: ")
dir.walk().forEach { println(it) }

println("BOTTOM_UP: ")
dir.walk().asIterable().reversed().forEach { println(it) }
```

You can reach the same result using these methods:

- `File.walkBottomUp()` (same as `File.walk(FileWalkDirection.BOTTOM_UP)`);

- `File.walkTopDown()` (same as `File.walk(FileWalkDirection.TOP_DOWN)`).

Therefore, these three methods let us traverse the entire file structure recursively.

### Working with Hierarchies

Assuming we have an instance of `java.io.File` named `completedProjects`, which refers to the `CompletedProjects` directory.
We will now get the two subdirectories containing project data.

```kotlin
// with File
val completedProjects: File = File("/Files/CompletedProjects")
val projects = completedProjects.walk()
projects.maxDepth(1) // HelloWorld and JCalculator

// with Path
val completedProjects: Path = Path("/Files/CompletedProjects")
val projects = Files.walk(completedProjects, 1)
```

To find the `HelloWorld` project, we will traverse the file tree:

```kotlin
val helloWorldProject: File = projects.first { it.name == "HelloWorld" }
```

You can also obtain the `HelloWorld` directory by using the `File.listFiles()` method:

```kotlin
val helloWorldProject: File = completedProjects.listFiles().first { it.name == "HelloWorld" }
```

### File Copying

If you need to copy a file, use the `copyTo()` function:

```kotlin 
// with File
val fileIn = File("newFile.txt")
val fileOut = File("copyNewFile")
fileIn.copyTo(fileOut)

// with Path
val fileIn = Path("newFile.txt")
val fileOut = Path("copyNewFile.txt")
fileIn.copyTo(fileOut)
```
Be aware that if you need to overwrite the file, you should include an `overwrite` parameter:

// With File
val fileIn = File("newFile.txt")
val fileOut = File("copyNewFile")
fileIn.copyTo(fileOut, overwrite = true)

// With Path
val fileIn = Path("newFile.txt")
val fileOut = Path("copyNewFile.txt")
fileIn.copyTo(fileOut, overwrite = true)
```

To copy a whole directory recursively, you can use the `copyRecursively()` function:

```kotlin 
// with File
val fileIn = File("outDir")
val fileOut = File("newDir")
fileIn.copyRecursively(fileOut)

// with Path
val pathIn = Path("outDir")
val pathOut = Path("newDir")
pathIn.copyToRecursively(pathOut)
```

Remember that if you need to overwrite folders and files, you should also introduce an `overwrite` parameter or follow the links (only in Path) with `followLinks` option:

```kotlin 
// with File
val fileIn = File("outDir")
val fileOut = File("newDir")
fileIn.copyRecursively(fileOut, overwrite = true)

// with Path
val pathIn = Path("outDir")
val pathOut = Path("newDir")
pathIn.copyToRecursively(pathOut, overwrite = true, followLinks = true)
```

### ZipFile with java.util.zip

The `java.util.zip.ZipFile` class in the Java API is meant for reading entries from ZIP files.
It acts as an access point to the compressed data within a ZIP archive,
enabling developers to conveniently extract files and directories while efficiently managing resources.

Here's a simple example of using `ZipFile` to list out ZIP file entries:

```kotlin

import java.util.zip.ZipFile;
import java.util.Enumeration;
import java.util.zip.ZipEntry;

public class ZipFileExample {
    public static void main(String[] args) {
        try (ZipFile zipFile = new ZipFile("example.zip")) {
            Enumeration<? extends ZipEntry> entries = zipFile.entries();
            
            while (entries.hasMoreElements()) {
                ZipEntry entry = entries.nextElement();
                System.out.println("Entry Name: " + entry.getName());
            }
        } catch (IOException e) {
            System.err.println("Error opening ZIP file: " + e.getMessage());
        }
    }
}
    
```

### Opening and Accessing ZipFile in Java

The` java.util.zip.ZipFile` class is used to read entries from a ZIP file. 
Here how you can open a ZIP file and cycle through its entries using the `Enumeration` interface.


```kotlin 
import java.util.zip.ZipFile
import java.util.Enumeration
import java.util.zip.ZipEntry

fun openAndAccessZipFile(filePath: String) {
    // First, you need to create a `ZipFile` instance by specifying the file path of the ZIP file you want to open:
    val zipFile = ZipFile(filePath)
    //Once you have the `ZipFile` instance, you can get an enumeration of the ZIP file entries:
    val entries: Enumeration<*> = zipFile.entries()
    // Then, you can cycle through the entries using a while loop:
    while (entries.hasMoreElements()) {
        val entry = entries.nextElement() as ZipEntry
        println("Entry name: ${entry.name}")
        // Now you can extract the entry or read its contents
    }
    zipFile.close()
}

fun main() {
    val zipFilePath = "path/to/your/zipfile.zip"
    openAndAccessZipFile(zipFilePath)
}
```

### Reading ZipEntry Contents

To read the contents of a `ZipEntry`, you must first obtain an `InputStream` for the entry using the `getInputStream` method of `ZipFile`.
This allows you to read bytes from the entry just like any other input stream in Java.

```kotlin 
import java.util.zip.ZipFile;
import java.util.zip.ZipEntry;
import java.io.InputStream;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ZipEntryReader {
    public static void main(String[] args) {
        String zipFilePath = "path/to/your/zipfile.zip";
        String entryName = "example.txt"; // Name of the ZipEntry you want to read

        try (ZipFile zipFile = new ZipFile(zipFilePath)) {
            ZipEntry entry = zipFile.getEntry(entryName);
            if (entry != null) {
                try (InputStream stream = zipFile.getInputStream(entry);
                     BufferedReader reader = new BufferedReader(new InputStreamReader(stream))) {
                    String line;
                    while ((line = reader.readLine()) != null) {
                        System.out.println(line);
                    }
                }
            } else {
                System.out.println("Entry not found in the zip file");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

### Extracting files from ZipFile in Java

To extract files from a ZipFile to a given directory in Java, follow these steps:

```kotlin
//Open the zip file: Utilize the ZipFile class from the java.util.zip package to open the zip file.
ZipFile zipFile = new ZipFile("path/to/your.zip");
//Create Output Directory: Ensure the directory where you want to extract files exists or create it.
File destDir = new File("output/directory/path");
if (!destDir.exists()) {
    destDir.mkdir();
}
// Iterate through the entries: Get the ZIP file entries and iterate through them.
Enumeration<? extends ZipEntry> entries = zipFile.entries();
Explain code
while (entries.hasMoreElements()) {
    ZipEntry entry = entries.nextElement();
    File entryDestination = new File(destDir, entry.getName());
    if (entry.isDirectory()) {
        entryDestination.mkdirs();
    } else {
        entryDestination.getParentFile().mkdirs();
        InputStream in = zipFile.getInputStream(entry);
        OutputStream out = new FileOutputStream(entryDestination);
        IOUtils.copy(in, out); // Apache Commons IO
        in.close();
        out.close();
    }
}
// Handle IOException: Use try-catch blocks to handle potential IOExceptions.
try {
    // ... code to extract files ...
} catch (IOException e) {
    // ... handle exception ...
}
// Close the zip file: Lastly, remember to close the ZipFile.
zipFile.close();
```

> [!NOTE]
> Don't forget to properly handle resources to avoid leaks. 
> You can use the try-with-resources statement for automatic resource management.


