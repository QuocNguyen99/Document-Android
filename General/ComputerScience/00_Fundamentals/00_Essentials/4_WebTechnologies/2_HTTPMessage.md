# HTTP messages

The HTTP relies on the "client-server" architecture that is built on the basis of messaging. HTTP messages are a way to exchange data between clients and servers on the Web. There are two types of messages: **requests** and **responses**.

## The format of messages

In the HTTP protocol, all messages consist of text strings. Both requests and responses have roughly the same standardized format:

1. **Start line** which may vary:

	- for requests, it indicates the type of request (**method**) and the URL where to send it (**target**);

	- for responses, it contains a status code to determine the success of the operation.
2. **Headers** that describe the message and convey various parameters.

3. **Body** in which the message data is located.

Example:

```bash
GET /ewordly-service/topic/list?page=1&limit=3 HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2FiMGNhOTI3N2I1YmQxZWNjNTFjNmUiLCJhY2Nlc1Rva2VuRXhwaXJ5IjoiMjAyNS0wMi0xMlQxNDoxODoyNy45NDRaIiwiaWF0IjoxNzM5MjgzNTA3LCJleHAiOjE3MzkzNjk5MDd9.VX_vBqvxmiFVR3Et7BC_dVpKfm89Aum-AJsDKTtdsrY
User-Agent: PostmanRuntime/7.43.0
Accept: */*
Postman-Token: 5bd37ba9-316e-490f-9d3b-af3bc5ae4ca2
Host: mionix.ddns.net
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
 
HTTP/1.1 403 Forbidden
Server: nginx/1.18.0 (Ubuntu)
Date: Thu, 20 Mar 2025 06:48:17 GMT
Content-Type: application/json; charset=utf-8
Content-Length: 53
Connection: keep-alive
X-Powered-By: Express
ETag: W/"35-6C0YABQYGKqodn17c9SuUdKRqxw"
 
{"message":"Invalid token with message: jwt expired"}
```

> [!NOTE]
> The start line and the header are required attributes, so the other parts may be empty.

## Methods

HTTP defines a set of request methods that specify what the desired action will be for a given resource. 
Despite the fact that their names can be nouns, these query methods are sometimes referred to as HTTP verbs.

## Status code

For normal operation of computer programs and web pages that work via HTTP, besides the content of the page, the server returns a three-digit code,
which specifies the response for the request. With the help of this code,
it is possible to redirect the client to another site or to indicate the change of the page, as well as detect an error in the data processing.


# HTTP Status Codes

| Code Range | Category        | Description                                                                 |
|------------|-----------------|-----------------------------------------------------------------------------|
| 1xx        | Informational    | Codes beginning with "1" are called information codes. They report on how client requests are processed. |
| 2xx        | Success          | Messages of this class inform that the action requested by the client has been successfully accepted for processing. |
| 3xx        | Redirection      | It means further action must be taken in order to complete the request.      |
| 4xx        | Client Error     | It reports errors on the client's side.                                      |
| 5xx        | Server Error     | The code indicates that the operation was unsuccessful due to the fault of the server. |





