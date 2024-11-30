# Files

Data is stored on disks under certain addresses. For a computer, such addresses are numbers. It uses them to find the corresponding information. However, humans are not that good at memorizing sets of numbers.

## Definition

A file is associated with a piece of data. However, there are some restrictions on naming a file. For example, filenames must contain only those characters that are supported by a specific file system

## File extensions

Operating systems use filename extensions to remember which program to use to open files with a certain extension. Filename extensions aren’t strictly necessary, though: they just eliminate the need to guess the format of a file.


Now you know that a file extension is the service information used by a computer. Let's find out what other information a file has that helps computers understand what properties it has. This information is called file metadata.


## File metadata

Metadata stands for "data about data". One of the most common pieces of such data is the filename as we've discussed above. Other examples are the file size, creation time, the last access time, etc.


Also, metadata consists of file attributes. Each attribute has two possible states: set (toggled on) or cleared (toggled off). File attributes tell the file system or operating system if a file should get some special treatment. For example, if a file has a read-only attribute set, its contents can be read, but all attempts to modify them will be prevented by the file system until this attribute gets cleared. If a file has a hidden attribute set, it won’t show up in a graphical user interface unless the user explicitly tells the operating system to show all hidden files. Attributes can also be used to restrict file access to specific groups of users.

## Absolute and relative paths

In order to find a file, we need to know the path to it. The path is a character set indicating the location of a file in the system. The file path can be seen in the file manager (Explorer in Windows). **There are two types of paths: an absolute or a relative path.**


A path to a file that starts with a root directory is called an **absolute path** and serves as the file’s unique identifier.

There is a catch with absolute paths though. When you write a program that will be installed on different computers, you know your own program’s directory, but you don’t know where other users of this program will install it. Your program’s directory can end up in any parent directory on a user’s computer, so you can't use an absolute path in your program to point to its directory.

This is where **relative paths** come into play. Each process that runs on a computer is associated with a **working directory** on this computer; it is tracked and managed by the operating system. This basically means that the operating systems of other users will be focused on your program’s directory when they run it.

Your program can address the working directory by using a special character . instead of the directory’s actual name, so you can use a path like `./my_file` without specifying the whole path from a root. You just let the user’s operating system figure it out! You can also use `..` to address a parent directory of the working directory.