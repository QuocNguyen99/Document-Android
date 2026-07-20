# Http Client

To interact over HTTP, we use libraries that are called HTTP clients. 
Their purpose is to send HTTP requests and handle the response.
These are some of the most widely used libraries:

- **HttpURLConnection** is part of the standard Java library. It is the oldest of them all and has the most backward compatibility. It is easy to use but it only offers synchronous/blocking API and doesn't have HTTP/2 support.

- **Java HttpClient** is another native Java library generally available in Java 11. It uses synchronous and asynchronous modes of operations and has HTTP/2 support. However, it doesn't support transparent compression.

- **Apache HttpClient** is an external open-source library and the most commonly used client outside of the Java standard library. It has a rich set of features and configuration options. It is best to use it if you need extreme flexibility in configuring and customizing behavior.

- **OkHttp** is an HTTP and HTTP/2 client used for building Java and Kotlin applications. 

## OkHttp is one of the most commonly used clients, Why **OkHttp**?

Thanks to HTTP, you can now transfer data and media through a client-server communication model.
OkHttp is efficient with:

- connection pooling;

- gzip support, which shrinks download size;

- response caching allows the network not to repeat requests;

- HTTP/2 support.


OkHttp recovers common connection problems, such as sending a request to an alternate address, if a service has multiple IP addresses. 
In addition, it assists with synchronous blocking calls and asynchronous calls with callbacks.

## Response caching with OkHttp

Response caching allows `OkHttp` to avoid repeating requests over the network. That's amazing because it helps speed up application performance and increase efficiency.

**Response caches** will be stored in a directory, meaning that all previously downloaded data will be accessed from locally-cached resources. In Android, a directory with cache data must be private, so untrusted applications can't access the data.

The best practice is to have one instance of `OkHttpClient()` that is accessible throughout the whole application. Otherwise, two cache instances might stomp on each other, corrupt the response cache, and possibly crash your application.
 
`OkHttp` **response caching uses HTTP headers to determine cache behavior**. 
It can be configured on the server, for example, how long responses are cached with response headers like `Cache-Control: max-age=1000`. 

You can also prevent OkHttp from using caches with `CacheControl.FORCE_NETWORK`. Alternatively, you can force it to use cache instead of network with `CacheControl.FORCE_CACHE`. All that can be done by passing a `CacheControl` value into `cacheControl()` method of `Request.Builder`.

> [!CAUTION]
> Be aware that forcing the use of cache can result in response code 504 known as an Unsatisfiable request error if there is no cache data. Otherwise, it will show cached data until the latest data is downloaded.



