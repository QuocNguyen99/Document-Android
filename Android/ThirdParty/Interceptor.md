# OkHttp Interceptor

         _Interceptor_ có nghĩa là “làm can thiệp một cái gì đó trong việc đến được đích đến của nó”, tương tự như nghĩa của nó Interceptor can thiệp vào một request, thay đổi request đó và sau đó gửi lại đến điêm đến của nó (server). Các Interceptor là để quan sát, điều chỉnh và có khả năng chặn các request và những phản hồi. Thông thường các Interceptor thực hiện thêm, xóa , chuyển đổi các Headers trên request hoặc trên các phản hồi được trả về (từ server).

Interceptor về căn bản được chia làm 2 loại :

* **Application Interceptor:** Đây là là những interceptor có cấp độ cao được sử dụng để chặn các các request lên hoặc response phản hồi về. Chúng thường được sử dụng để viết lại các header/query ở cả request và response. Những interceptor chắc chắn được gọi một lần ngay cả khi phản hồi được nạp từ bộ lưu trữ (cache).
* **Network Interceptor :** Đây là những interceptor có cấp độ thấp hơn được sử dụng để theo dõi các request và response được truyền quan mạng. Nó thì rất hữu ích để theo dõi việc redirect, retry và tạo ra truy cập đến những chi tiết của request. Chúng không được gọi nếu response đã được lưu trữ.

    ![](../resources/interceptor.webp)

## Implement Interceptor

* Việc khởi tạo hoặc khai báo một Interceptor thì khá dễ dàng. Chúng ta chủ cần phải implement interface Interceptor và override lại method interceptor() như được triển khai dưới đây. Cả 2 loại Interceptor là Application vs Network Interceptor thì được implement bởi cùng một interface :

```java
private static class CustomInterceptor implements Interceptor {

    @Override
    public Response intercept(Chain chain) throws IOException {
    /*
    chain.request() returns original request that you can work with(modify, rewrite)
    */
    Request request = chain.request();

    // Here you can rewrite the request

        /*
    chain.proceed(request) is the call which will initiate the HTTP work. This call invokes the request and returns the response as per the request.
        */
        Response response = chain.proceed(request);
	
        //Here you can rewrite/modify the response

    return response;
    }
}
```

* Một cuộc gọi đến _chain.proceed(request)_ là một phần quan trọng của mỗi implement của interceptor. Cái method trông có vẻ đơn gian này là nơi tất cả các công việc của HTTP xảy ra, đây là nơi request được khởi tạo và một response sẽ được nạp về để đáp ứng request đó.
* Một khi bạn đã định nghĩa interface interceptor như trên, bạn đã có thể triển khai nói với OkHttp Client như ở dưới đây. Và bây giờ bạn nên đăng ký với Retrofit.Buider, bằng cách này cho tất cả các request OkHttp Client sẽ dược sử dụng và Interceptor của bạn sẽ được gọi đến và có hiệu lực.

```java
OkHttpClient okHttpClient = new OkHttpClient.Builder()
    .addInterceptor(new CustomInterceptor()) // This is used to add ApplicationInterceptor.
	.addNetworkInterceptor(new CustomInterceptor()) //This is used to add NetworkInterceptor.
	.build();

	//Defining the Retrofit using Builder
Retrofit retrofit = new Retrofit.Builder()
	.baseUrl(BASE_URL) // Bắt buộc phải thêm base_url
	.client(okHttpClient) //The Htttp client to be used for requests
	.addConverterFactory(GsonConverterFactory.create()) // Thư viện để convert từ resonse sang POJO
	.build();
```

## Ghi lại các log của Request và Response

   Chúng ta cần log ra các lịch sử và tình trạng của các request/response. Điều này rất quan trọng vì chúng ta cần biết những gì đang xảy ra với những request/response được gửi đi. Những logs này sẽ cho chúng ta biết về headers, request/response body và chi tiết quan trọng cho việc debug và sửa các lỗi. Và rất may mắn là không khó để editor có thể hiển thị ra những log này với Retrofit

    Retrofit cung cấp cho chúng ta với một Custom Interceptor – HttpLoggingInterceptor có thể đăng register với OkHttp Client. Với object này chúng ta có thể in ra tất cả các log cho các hoạt động của HTTP thông qua client như sau :

```java
HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
interceptor.setLevel(HttpLoggingInterceptor.Level.BODY);

OkHttpClient client = new OkHttpClient.Builder().addInterceptor(interceptor).build();

Retrofit retrofit = new Retrofit.Builder()
	.baseUrl("https://backend.example.com")
	.client(client)
	.addConverterFactory(GsonConverterFactory.create())
	.build();
```

## Dùng interceptor để refresh token

        Trong Android, khi sử dụng Retrofit làm HTTP client, bạn có thể sử dụng Interceptor để refresh token cho người dùng khi token hết hạn. Các bước cơ bản để refresh token bằng Interceptor là:

1. Tạo một AutoRefreshInterceptor để bắt request trước khi gửi đi và xử lý token hết hạn.
2. Kiểm tra token hiện tại của người dùng có hết hạn hay không sau mỗi response của request
3. Nếu refreshToken đã hết hạn, gửi một request mới để lấy token mới bằng bằng OkHttpClient.
4. Cập nhật token mới vào SharedPreference hoặc lưu trữ tương tự.
5. Thay đổi header của request hiện tại để sử dụng token mới.

Ví dụ :


```kotlin
class AutoRefreshTokenInterceptor : Interceptor {

    companion object {
        val refTokenJWT get() = "${Configs.baseUrl}device/req/jwt"
    }

    private val logger = ApiLogger()

    private val requestIdList = mutableListOf<String>()

    private var jsonReq: String = JsonObject()
        .put("reqId", UUID.randomUUID().toString())
        .put("langCode", Lang.currentLang())
        .put("cid", androidId)
        .toString()

    override fun intercept(chain: Interceptor.Chain): Response {
        val newRequest: Request = chain.request()
        val requestId = newRequest.url.toString()
        val logger = ApiLogger()
        try {
            if (requestIdList.contains(requestId)) {
                //throw ApiProcessExistException()
            }
            logger.logRequest(newRequest)
            requestIdList.add(requestId)

            val newResponse = chain.proceed(newRequest)
            logger.logResponse(newResponse)

            return if (newResponse.code == 401) {
                /**
                 * nếu 401 gọi refresh token rồi lưu token rồi gọi lại [newRequest] bằng token mới
                 */
                requestIdList.remove(requestId)
                chain.refreshTokenAndIntercept(newRequest, newResponse)
            } else {
                requestIdList.remove(requestId)
                newResponse
            }
        } catch (e: Throwable) {
            requestIdList.remove(requestId)
            val className = e::class.java.simpleName
            when (e) {
                is SocketException, is UnknownHostException, is SocketTimeoutException -> {
                    throw e
                }
                is HttpException -> {
                    logger.d("$className: ${e.code()} - ${e.message}")
                    logger.d("$className: ${e.errorBody()}")
                    if (e.code() == 401) {
                        val newResponse = chain.proceed(newRequest)
                        return chain.refreshTokenAndIntercept(newRequest, newResponse)
                    } else {
                        throw e
                    }
                }
                else -> {
                    logger.d("$className: ${e.message}")
                    throw e
                }
            }
        }
    }

    private fun Interceptor.Chain.refreshTokenAndIntercept(
        oldRequest: Request,
        oldResponse: Response
    ): Response {
        try {
            val request = modifiedRefreshTokenReq(oldResponse) ?: return oldResponse
            val refreshResponse = OkHttpClient().newCall(request).execute()
            if (refreshResponse.code != 200) {
                throw IllegalAccessException()
            }
            val source = refreshResponse.body?.source()
            source?.request(Long.MAX_VALUE)
            val responseBodyString = source?.buffer?.clone()?.readUtf8()
            val json = responseBodyString.toJsonObject()

            val modifiedRequest: Request.Builder = oldRequest.newBuilder()
            val dataObj = json.obj("data")
            val token: String? = dataObj.str("userToken", null)?.also { Pref.userToken = it }
            if (token.isNullOrEmpty()) {
                return oldResponse
            }
            logger.d("new call ${Pref.trusted} refreshToken $token")
            modifiedRequest.header("token", token)
            val newModifiedRequest: Request = modifiedRequest.build()
            logger.logRequest(newModifiedRequest)
            val response = this.proceed(newModifiedRequest).newBuilder().build()
            logger.logResponse(response)
            return response
        } catch (e: Exception) {
            //logger.d("new call Exception  refreshToken ${oldResponse.toJsonObject()}")
            return oldResponse
        }
    }

    private fun modifiedRefreshTokenReq(oldResponse: Response): Request? {
        val refTokenUrl = refTokenJWT
        val oldResponseBody = oldResponse.body
        val contentType = oldResponseBody?.contentType()
        val body = jsonReq.toRequestBody(contentType)
        val request = Request.Builder()
            .header("accept", "application/json")

       val refreshUserToken = Pref.refreshUserToken ?: return null
       request.addHeader("refreshUserToken", refreshUserToken)
       logger.d("old call userRefreshToken: '${refreshUserToken}'")

        return request
            .url(refTokenUrl)
            .post(body)
            .build()
    }

    private fun HttpException.errorBody(): String {
        val errorBody = response()?.errorBody()?.string() ?: return this.toString()
        return try {
            JSONObject(errorBody).toString(2)
        } catch (e: JSONException) {
            this.toString()
        }
    }


}
```

# 
