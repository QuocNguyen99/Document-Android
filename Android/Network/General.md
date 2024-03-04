# Network

![](../../resources/network.avif)

Network communication is an essential part of any modern-day application. 
However, building our own network solutions requires massive resources, such as connection pooling, 
response caching, HTTP (Hypertext Transfer Protocol) specific features, interceptors, and asynchronous call supports.

Seven to eight years ago, Android developers used HttpURLConnection or Apache’s HttpClient to perform HTTP requests.
However, those libraries require a lot of boilerplate code and do not support Android platform compatibility, 
such as connectivity features, security support, and DNS (Domain Name System) resolution.

In this section we will explore the most popular HTTP libraries to working with Resful API for Android: OkHttp and Retrofit.


## OkHttp

OkHttp was developed by Square and is an HTTP client for JVM and Android built with Okio internally, 
which is a modern I/O library for Android, Java, and Kotlin Multiplatform.

OkHttp works efficiently by default and helps you to establish an HTTP client quickly. 
It has its own recovery systems, so you don’t need to handle it manually when the network is troublesome, such as connection problems.

This library provides modern TLS (Transport Layer Security) features, security support for Android, caching, and Interceptors.

**One of the most capable features in OkHttp is Interceptors, 
which are powerful mechanisms that allow you to log, monitor, modify, rewrite, and retry calls.**

![](../../resources/interceptors@2x.avif)

You can easily transform all network requests as needed, **such as adding an access token**, 
for example, Bearer Authentication to the header, or adding gzip compression to the request body.

## Retrofit

Retrofit is a type-safe HTTP client for Android and JVM and it was also developed by Square. 
Retrofit provides abstraction layers on top of OkHttp, 
allowing you to define request specifications easily and concisely without handling low-level implementations.

You can also build desired HTTP requests easily by supporting URL, header manipulation, the request method, and the body with Retrofit annotations. 
Also, by attaching a pluggable Converter.Factory, you can [serialize](../../Kotlin/Serialize.md) all JSON responses easily without the need to write boilerplate code.


## Apollo

Apollo Android là một thư viện được phát triển bởi tập đoàn Apollo GraphQL, được thiết kế để hỗ trợ việc làm việc với GraphQL trong ứng dụng Android. Dưới đây là các điểm chính về Apollo Android:

1. Hỗ trợ GraphQL: Apollo Android cung cấp một cách tiện lợi để thực hiện các truy vấn (queries), mutation và subscription đến các GraphQL APIs từ ứng dụng Android.

2. Code Generation: Apollo Android sử dụng code generation để tạo ra các lớp Java hoặc Kotlin từ các file schema GraphQL và các file truy vấn (queries). Điều này giúp xây dựng ứng dụng một cách linh hoạt và hiệu quả.

3. Typed Responses: Thông qua code generation, Apollo tạo ra các lớp Java hoặc Kotlin được tạo ra dựa trên schema GraphQL, giúp ta có được typed responses một cách dễ dàng.

4. RxJava và Kotlin Coroutines Support: Apollo hỗ trợ cả RxJava và Kotlin Coroutines để xử lý các responses từ GraphQL queries và mutations một cách linh hoạt.

5. Cache Handling: Apollo Android cung cấp một hệ thống cache mạnh mẽ để giúp tối ưu hóa hiệu suất và giảm thiểu lượng dữ liệu được tải xuống từ server.

6. Error Handling: Apollo Android cung cấp cơ chế xử lý lỗi linh hoạt, cho phép bạn dễ dàng xử lý các lỗi từ GraphQL server.

7. Interceptors và Network Layers: Bạn có thể tùy chỉnh việc giao tiếp với GraphQL server thông qua việc sử dụng interceptors và network layers.

Tóm lại, Apollo Android là một thư viện mạnh mẽ giúp bạn tích hợp GraphQL vào ứng dụng Android của mình một cách linh hoạt và hiệu quả, đồng thời cung cấp các tính năng như code generation, typed responses, cache handling, và error handling để giúp bạn xây dựng ứng dụng một cách dễ dàng và mạnh mẽ.
