# Fragments

A Fragment is like an Activity that can be connected to different parts of an application.
However, it is important to understand that they are not the same.
This means that a Fragment cannot exist unless it's embedded in an Activity.

Fragments are used in **Single Activity Architecture** to create Navigation and save state.

## Fragment lifecycle

Since Fragments are closely intertwined with Activities, their **lifecycles** are also intertwined.
The lifecycle methods that either aren't present in Activities or that have the same name but perform a different role are detailed below:

- `onAttach()` is called when a Fragment is first attached to its Activity.
- `onCreate()` is very similar to the `onCreate()` Activity method, but it doesn't have access to the UI in Fragments.
- `onCreateView()` creates the Fragment View. Its only recommended use is to inflate the layout.
- `onViewCreated()` is called immediately after `onCreateView()`. It is recommended to use it for logic that works with the View that is returned.
- `onDestroyView()` is a method that reports that the View created in `onCreateView()` is no longer available.
- `onDetach()` detaches a Fragment from its associated Activity.

The `onStart()`, `onStop()`, `onResume()`, and `onPause()` lifecycle callbacks are all identical to the ones inside Activity.

## Fragment manager

Fragments inherit from the `androidx.fragment.app.Fragment` class, which comes from the AndroidX library.
But there are also several Fragment subclasses: `ListFragment`, `DialogFragment`, `PreferenceFragment`, `WebViewFragment`, and others.
There are two methods in `FragmentManager` that can be used to find Fragments associated with an Activity.
These are `findFragmentById(int id)` and `findFragmentByTag(String tag)`.
The `findFragmentById()` method finds a Fragment by an identifier and `findFragmentByTag()` searches by a given tag.
If you want to perform any operations on Fragments, be it replacing, deleting, or hiding them, you need to use the special `androidx.app.FragmentTransaction` class.

The main methods of the `FragmentTransaction` class are below:

- `add()` adds the Fragment to the Activity.
- `remove()` is used to remove the Fragment from the Activity.
- `replace()` replaces one Fragment with another.
- `hide()` is used to hide the Fragment on the screen.
- `show()` shows the Fragment on the screen.

Lastly, it's important to remember that you must call the `commit()` method at the end of every transaction!


















