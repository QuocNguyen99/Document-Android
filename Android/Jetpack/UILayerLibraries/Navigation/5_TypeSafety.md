# Type safety in Kotlin DSL and Navigation

## Safe Args

The Navigation component has a Gradle plugin called Safe Args that generates simple object and builder classes for type-safe navigation and access to any associated arguments. Safe Args is strongly recommended for navigating and passing data, because it ensures type safety.

After you've enabled Safe Args, your generated code contains the following type safe classes and methods for each action as well as with each sending and receiving destination.

- A class is created for each destination where an action originates. The name of this class is the name of the originating destination appended with the word "Directions". For example, if the originating destination is a fragment that is named `SpecifyAmountFragment`, the generated class is called `SpecifyAmountFragmentDirections`.

- A class is created for the receiving destination. The name of this class is the name of the destination appended with the word "Args". For example, if the destination fragment is named `ConfirmationFragment`, the generated class is called `ConfirmationFragmentArgs`. Use this class's `fromBundle()` method to retrieve the arguments.

Example:

```kotlin
override fun onClick(v: View) {
   val amountTv: EditText = view!!.findViewById(R.id.editTextAmount)
   val amount = amountTv.text.toString().toInt()
   val action = SpecifyAmountFragmentDirections.confirmationAction(amount)
   v.findNavController().navigate(action)
}
```

In the code for the receiving destination, use the getArguments() method to retrieve the bundle and use its contents.

```kotlin
val args: ConfirmationFragmentArgs by navArgs()

override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    val tv: TextView = view.findViewById(R.id.textViewAmount)
    val amount = args.amount
    tv.text = amount.toString()
}
```

## From Navigation 2.8.0


You can use built-in type safe APIs to provide compile-time type safety for your navigation graph. 
They are available as of Navigation 2.8.0.
These APIs are equivalent to what Safe Args provides to navigation graphs built using XML.

## Define routes
To use type-safe routes in Compose, you first need to define serializable classes or objects that represent your routes.

- **Object**: Use an object for routes without arguments.
- **Class**: Use a class or data class for routes with arguments.
- `KClass<T>`: Use if you don't need to pass arguments, such as a class without parameters, or a class where all parameters have default values
For example: Profile::class

For optional arguments, create nullable fields with a default value.
In either case, the object or class must be serializable.

example:
```kotlin
// Define a home route that doesn't take any arguments
@Serializable
object Home

// Define a profile route that takes an ID
@Serializable
data class Profile(val id: String)
```

Build your graph

```kotlin
NavHost(navController, startDestination = Home) {
     composable<Home> {
         HomeScreen(onNavigateToProfile = { id ->
             navController.navigate(Profile(id)) // Navigate to type safe route
         })
     }
     // composable() takes a type parameter. That is, composable<Profile>.
     // Defining the destination type is a more robust approach than passing a route string as in composable("profile").
     composable<Profile> { backStackEntry ->  
        // For the profile route, the toRoute() extension method recreates the 
        // Profile object from the NavBackStackEntry and its arguments.
        // Then read the args.
         val profile: Profile = backStackEntry.toRoute()
         ProfileScreen(profile.id)
     }
}
```

