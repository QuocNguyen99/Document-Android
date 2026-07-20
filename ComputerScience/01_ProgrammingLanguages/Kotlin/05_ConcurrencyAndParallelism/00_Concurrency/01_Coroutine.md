# Coroutine

Coroutines are a Kotlin library developed by JetBrains. It is multiplatform and available for all major Kotlin targets: JVM, JS, Native, and Android.

The library provides many methods of dealing with simultaneous tasks in Kotlin. 

> [!NOTE]
> In Kotlin, a simultaneous task refers to the ability of a coroutine to suspend its execution and allow other coroutines to run,
> giving the illusion of multiple tasks running at the same time within a single thread.

## `kotlinx.coroutines` as a library


Note that coroutines are not bundled with the Kotlin standard library — they are a dependency.  

There are several reasons why coroutines are separated. Here are two major reasons:

- Not every program needs internal concurrency. If coroutines were built-in, all Kotlin programs would take up more memory space because they contain redundant code.
- Some developers don't want to use the official implementation of internal concurrency. When coroutines are a plugable module, you can easily plug not the official one but the one that best suits your particular situation.

















