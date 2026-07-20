# Cross-site scripting

**The XSS (Cross-Site Scripting)** attack is a type of attack on web systems in which malicious code is injected into a web page.
When a user opens such a page, malicious code is executed on their computer and establishes a connection to the attacker's web server.

Cross-site scripting is mostly used to steal users' cookies. 
Third parties can access the user's session, make HTTP requests from the user, obtain the user's credentials, and make it difficult to interact with the site.
They can even create regular redirects to malicious sites.


## Types of XSS attacks

There are usually two categories of them:
- **Reflected XSS**, where the malicious script comes from the current HTTP request. Attacks occur when a user clicks on a specially prepared link. 

- **Stored XSS** is possible when an attacker manages to inject malicious code into the server which is executed in the browser every time the original page is accessed.


## How to find an XSS vulnerability

If you want to check if there are XSS vulnerabilities on the site, the first thing to look at is whether there are places where users have the ability to influence the content of the site.

For example, if you notice an area on a site where text entered by users appears, there could potentially be a vulnerability

```html
<script>alert("This web page is vulnerable")</script>
```
if you don't manage to trigger this popup, then the developers have taken care of the site's security.

## How to prevent XSS attacks

To prevent this from happening to your site, you can check it for vulnerabilities. 
Doing it manually is not always efficient, but time-consuming and difficult. 
Fortunately, there are special services for this purpose, such as `xss-scanner.com`.

There are also a few recommendations for website and app developers to prevent XSS attacks:
- If your site has user input, it's important to encode the data.
- In situations where encoding is not appropriate, replace it with validation.
- Secure processing of data should be done in code not only on your server side, but also on the client side.
- Use the `HTTPOnly` cookie flag for the HTTP header Set-Cookie. It prohibits reading and writing cookies via JavaScript.
- Preferably disallow links to web pages if they do not begin with a whitelist protocol, such as `http://`, `https://`.
- Use the Content Security Policy.











## reference:

- https://hyperskill.org/learn/step/16243