# Retrofit

Retrofit turns your HTTP API into a Java interface.

```java
public interface GitHubService {
  @GET("users/{user}/repos")
  Call<List<Repo>> listRepos(@Path("user") String user);
}
```

The `Retrofit` class generates an implementation of the `GitHubService` interface.

```java
Retrofit retrofit = new Retrofit.Builder()
    .baseUrl("https://api.github.com/")
    .build();

GitHubService service = retrofit.create(GitHubService.class);
```

Each `Call` from the created `GitHubService` can make a synchronous or asynchronous HTTP request to the remote webserver.

```java
Call<List<Repo>> repos = service.listRepos("octocat");
```

Use annotations to describe the HTTP request:

* URL parameter replacement and query parameter support
* Object conversion to request body (e.g., JSON, protocol buffers)
* Multipart request body and file upload

## API Declaration

Annotations on the interface methods and its parameters indicate how a request will be handled.

## REQUEST METHOD

    Every method must have an HTTP annotation that provides the request method and relative URL. There are eight built-in annotations: `HTTP`, `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` and `HEAD`. The relative URL of the resource is specified in the annotation.

## URL MANIPULATION

    A request URL can be updated dynamically using replacement blocks and parameters on the method. A replacement block is an alphanumeric string surrounded by `{` and `}`. A corresponding parameter must be annotated with `@Path` using the same string.

## REQUEST BODY

    An object can be specified for use as an HTTP request body with the `@Body` annotation.

The object will also be converted using a converter specified on the `Retrofit` instance. If no converter is added, only `RequestBody` can be used.

## FORM ENCODED AND MULTIPART

Methods can also be declared to send form-encoded and multipart data.

Form-encoded data is sent when `@FormUrlEncoded` is present on the method. Each key-value pair is annotated with `@Field` containing the name and the object providing the value.

```java
@FormUrlEncoded
@POST("user/edit")
Call<User> updateUser(@Field("first_name") String first, @Field("last_name") String last);
```

Multipart requests are used when `@Multipart` is present on the method. Parts are declared using the `@Part` annotation.

```java
@Multipart
@PUT("user/photo")
Call<User> updateUser(@Part("photo") RequestBody photo, @Part("description") RequestBody description);
```

Multipart parts use one of `Retrofit`'s converters or they can implement `RequestBody` to handle their own serialization.

## HEADER MANIPULATION

You can set static headers for a method using the `@Headers` annotation.

```java
@Headers("Cache-Control: max-age=640000")
@GET("widget/list")
Call<List<Widget>> widgetList();
```

Note that headers do not overwrite each other. All headers with the same name will be included in the request.

## Retrofit Configuration

        `Retrofit` is the class through which your API interfaces are turned into callable objects. By default, Retrofit will give you sane defaults for your platform but it allows for customization.

#### CONVERTERS

        By default, Retrofit can only deserialize HTTP bodies into OkHttp's `ResponseBody` type and it can only accept its `RequestBody` type for `@Body`.

Converters can be added to support other types. Six sibling modules adapt popular serialization libraries for your convenience.

* [Gson](https://github.com/google/gson): `com.squareup.retrofit2:converter-gson`
* [Jackson](https://github.com/FasterXML/jackson): `com.squareup.retrofit2:converter-jackson`
* [Moshi](https://github.com/square/moshi/): `com.squareup.retrofit2:converter-moshi`
* [Protobuf](https://developers.google.com/protocol-buffers/): `com.squareup.retrofit2:converter-protobuf`
* [Wire](https://github.com/square/wire): `com.squareup.retrofit2:converter-wire`
* [Simple XML](http://simple.sourceforge.net/): `com.squareup.retrofit2:converter-simplexml`
* [JAXB](https://docs.oracle.com/javase/tutorial/jaxb/intro/index.html): `com.squareup.retrofit2:converter-jaxb`
* Scalars (primitives, boxed, and String): `com.squareup.retrofit2:converter-scalars`
