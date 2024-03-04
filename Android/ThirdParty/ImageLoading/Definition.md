# Image Loading

![](../../../resources/image-loading.avif)

Image loading is also an essential part of modern application development, for example, when loading user profiles or other content from the network.

You can implement your own image loading system, but it requires a lot of features under the hood, 
such as downloading an image from the network, resizing, caching, rendering, and memory management.

In this section, we will explore popular image libraries for Android.

## Glide

Glide, developed by bumptech, is one of the most popular image libraries and has been for a long time. 
**It has been used in a lot of global products and open source projects, including Google’s official open source projects.**

**It provides useful features, such as animated GIF support, placeholders, transformations, caching, and resource reuse.**
For more information, check out [Glide’s official documentation](https://github.com/bumptech/glide).

## Coil

Coil, created by Colin White, has become increasingly popular since 2019.

**It is completely written in Kotlin**, and the exposed APIs are Kotlin-friendly. 
One notable point is that **Coil is lighter than alternatives** because it uses other libraries that are already used in Android projects widely, such as OkHttp and Coroutines.

Coil also supports Jetpack Compose, and it provides useful features, such as Transformations,
animated GIF support, SVG support, and Video frames support.

For more information, check out [Coil’s official guide](https://github.com/coil-kt/coil)

## Fresco

Fresco is also a popular image loading library and has been for a long time, along with Glide. It was developed by Meta (Facebook).

Unlike other libraries, **Fresco focuses on working efficiently with memory, especially targeting below Android version 4.x. However, recent projects target at least a minimum SDK of 21 to 23, and the API is complicated. Unless you’re building memory-sensitive applications, choose Glide or Coil instead.**

For more information, check out [Fresco’s official guide](https://github.com/facebook/fresco)

## Picasso

Picasso is a powerful image downloading and caching library for Android, developed by square.
**Honestly, it's that simple. It's this easy to use**
Many common pitfalls of image loading on Android are handled automatically by Picasso:

- Handling ImageView recycling and download cancelation in an adapter.
- Complex image transformations with minimal memory use.
- Automatic memory and disk caching.