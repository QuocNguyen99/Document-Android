# System Navigation

## Principle of navigation

    Navigation between different screens and apps is a core part of the user experience.

### Fixed start destination

    Every app you build has a fixed start destination. This is the first screen the user sees when they launch your app from the launcher.

**Note:** An app might have a one-time setup or series of login screens. These [conditional screens](https://developer.android.com/topic/libraries/architecture/navigation/navigation-conditional) should not be considered start destinations because users see these screens only in certain cases.

### Navigation state is represented as a stack of destinations

    When your app is first launched, a [new task](https://developer.android.com/guide/components/activities/tasks-and-back-stack) is created for the user, and app displays its start destination. This becomes the base destination of what is known as the _back stack_ and is the basis for your app’s navigation state.

### Up and Back are identical within your app's task

    **The Back button appears in the system navigation bar at the bottom of the screen** and is used to navigate in reverse-chronological order through the history of screens the user has recently worked with. When you press the Back button, the current destination is popped off the top of the back stack, and you then navigate to the previous destination.

The Up button appears in the app bar at the top of the screen. Within your app's task, the Up and Back buttons behave identically.
### The Up button never exits your app

    If a user is at the app's start destination, then the Up button does not appear, because the Up button never exits the app. The Back button, however, is shown and does exit the app.

When your app is launched using a deep link on another app's task, Up transitions users back to your app’s task and through a simulated back stack and not to the app that triggered the deep link. The Back button, however, does take you back to the other app.

### Deep linking simulates manual navigation

    When deep linking to a destination within your app’s task, any existing back stack for your app’s task is removed and replaced with the deep-linked back stack.
