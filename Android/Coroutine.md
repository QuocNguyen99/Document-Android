## Difference between coroutine and workmanager

    The scope of both is different. WorkManager is to schedule deferrable (for any later time) or immediately. tasks asynchronously.

    As documentation says:

    The WorkManager API makes it easy to specify deferrable, asynchronous tasks and when they should run. These APIs let you create a task and hand it off to WorkManager to run immediately or at an appropriate time.

On the other hand, coroutines are designed to compute a given task only immediately and asynchronously.

Also Internally, coroutines and WorkManager work differently.  Work manager heavily depends on Android system components like Services, Alarm manager, etc to schedule the work whereas coroutines schedule the work on Worker Threads and also is a language feature unlike WorkManager (API). So it is safe to say that coroutines do not go beyond your application.



 WorkManager can even execute the given tasks when your application is not active. for example, background services.

- Use Kotlin `Coroutine` when a task needs to execute immediately and if the task will end when the user leaves a certain scope or finishes an interaction.

- Use `WorkManager` when a task needs to execute immediately and need continued processing, even if the user puts the application in the background or the device restarts.

- Use `AlarmManager` when a task that needs to be executed at an exact point in time.


