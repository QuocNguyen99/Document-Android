

## Schedule task with WorkManager

        `WorkManager` is the recommended solution for persistent work. Work is persistent when it remains scheduled through app restarts and system reboots. Because most background processing is best accomplished through persistent work, WorkManager is the primary recommended API for background processing.

Types of persistent work
------------------------

WorkManager handles three types of persistent work:

* **Immediate**: Tasks that must begin immediately and complete soon. May be expedited.
* **Long Running**: Tasks which might run for longer, potentially longer than 10 minutes.
* **Deferrable**: Scheduled tasks that start at a later time and can run periodically.
