# Web security, OWASP

**Web security** is a set of measures and protocols aimed at protecting data from viruses, spam, and other threats that can harm a website, application, and/or specific user's data

The main idea of web security is that the Internet is an inherently insecure channel for information exchange.

- No one is ever 100% safe. Any site or account may be hacked. There is no notion of being 100% protected from this.
- One layer of security is not enough. 
For example, a password from a social network or website is a good idea, but it alone may not be enough. Therefore, after entering a username and password, additional means of user authentication like one-time PINs are often required.

## Threats



Generally, users face the following threats:
- **Malware** such as viruses or Trojans. An Internet user can be tricked into downloading malicious software onto a computer. Antiviruses help avoid them.
- **DoS attack*** is a type of hacker attack on a system in which real users receive a denial of service.
- **Phishing** is a type of online fraud in which attackers gain access to confidential user information such as username and password. In order to reduce the likelihood of such an attack, two-step user authentication is used. Passwords can also be changed periodically.
- **Application vulnerabilities**. If a site or program can be hacked, then it has a weak point, which is called a vulnerability. Vulnerabilities are different, they have their own classification and types.

## Security vulnerabilities


Web security vulnerabilities are prioritized depending on exploitability, detectability, and impact on software.

- **Exploitability** is what hackers should do to exploit the security vulnerability. 
The high exploitability is when an attacker needs only a web browser, and the low one is when an attacker needs advanced programming and tools.
- **Detectability** answers the question of how easy it is to detect a threat. It is easy to detect if the information is displayed in the URL or error message. In this case, we get the highest detectability level
- **Impact or Damage** stands for the amount of damage that will be done if the security vulnerability is exposed or attacked.


There are many risks and weaknesses that may lead to vulnerabilities, the most frequent ones can be found in the [OWASP TOP-10 rating](https://owasp.org/Top10/2025/), which is updated every three to four years.


OWASP stands for an **Open Web Application Security Project**, an online community that publishes articles on the topic of web application security, as well as documentation, various tools, and technologies.
With the help of their TOP-10 list, users can be aware of the most critical risks and threats, their consequences, and countermeasures.

> [!NOTE]
> Despite all of the above, it is not always possible to foresee all the weak points of a site or a program. It often happens that companies hire people who specifically attack their products in order to find vulnerabilities. This is done using a special Bug Bounty program.


## reference:

- https://hyperskill.org/learn/step/14755