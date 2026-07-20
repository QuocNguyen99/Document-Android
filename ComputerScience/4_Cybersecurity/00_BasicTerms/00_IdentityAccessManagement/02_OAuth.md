# Open Authorization

If the users already have a whole bunch of accounts, passwords, and logins. 
It makes no sense to come up with another one for you. 
It will be much more convenient if users are able to access your application through the account they already have, like Google, Twitter, Facebook, or other services. 
All these services use the Open Authorization protocol OAuth to provide user information to third-party applications.


## OAuth roles

![alt text](/resources/cybersecurity_open_authorization.png)

In OAuth 2.0, the following four parties are involved:
- **The resource owner** (the user) gives access to some portion of their account
- **The resource server** (the API) contains the user's information being accessed by the third-party application.
- **The authorization server** (can be the same server as the API) issues a token to the client to access the protected resource after successful authorization by the resource owner.
- **The client** (the application) is attempting to act on the user's behalf or access the user's resources. To do so, the client needs to obtain permission. There are two ways to do it; either by directing the user to the authorization server or by asserting permission directly.

## Client (the application) types 

There are two types of clients: **public** and **confidential**. The former cannot maintain the secrecy of the client's secret while the latter can.

An example of a confidential client could be a web app, where no one but the administrator can get access to the server, and see the client's password.

As for the public client, it is usually a mobile phone application or a desktop application that has the client password embedded inside it. Such an application could get cracked, and this could reveal the password. 



## Implementation schemes

    There are four types of implementation schemes:

    - **Application flow** means that the application uses its client's secret to obtain an access token. The user does not have to provide authorization at any stage. This type requires the client's secret security.
    - **Implicit flow** scheme means the application requests an access token from the gateway server. If the user grants permission, then an access token is provided. Then the user passes the access token to the application. This scheme type is only for public clients.
    - **Password flow** means the user provides the app with a username and password to access the user's data. After that, the client directly contacts the provider's API to request an access token. In this case, the application must be trusted not to store the username and password.
    - **Access code flow** means the user is authorized through a special form. In case of successful authorization, its code is provided to the client. The client sends the code to the provider's API and receives an access token in return.

## Working with OAuth

When you want to register, for instance, your application on a website, you, first of all, will need to receive permission for your app. This is done by using `access_token` which is the main entity of OAuth.

Before an application can receive an `access_token`, the user should confirm access to that application.

![alt text](/resources/cybersecurity_oauth_process.png)

1. A developer of an application wants to use an API, so they must go to the site of the corresponding API and register the application there to get a `client_id` and a `client_secret`.

2. After they have registered the application and received the `client_id` and `client_secret`, they must create an authorization link which will contain, in query parameters; the `client_id`, `redirect_uri` (where the user will be sent after confirmation; `redirect_uri` itself must be allowed in the settings of the application), `response_type` (what should be returned in case of success), and scopes (what rights the user must provide to their account; in our case, we won’t use scopes).
3. The user follows this link and authorizes access (clicks the “allow” button), and is redirected back to the developer’s specified `redirect_uri` with the response here.
4. The developer uses this response to get `access_token`.