# Plurals

Plurals, also known as quantity strings, are string resources that carry alternate strings for pluralization

Imagine you want to display a text with the number of cakes ordered. The text may be: "2 cakes ordered", or "1 cake ordered". Note that the word "cake" changes depending on the quantity of the cakes. Plurals come in handy in this situation.

## Plural resources

Plurals, being value resources, can be combined with other string resources in the `res/values/strings.xml` file. You can also create a separate XML file, provided that it is placed in the `res/values` directory.

Here is an example of the implementation of a plurals resource for our earlier example with cakes:

```xml
<resources>
    <plurals name="numberOfCakesOrdered">
        <item quantity="one">%d cake ordered</item>
        <item quantity="other">%d cakes ordered</item>
    </plurals>
</resources>
```

## The quantity attribute

The case above only applies to English and some other languages with the same grammatical rules of pluralization.
Other languages play by different rules; that's why Android supports more class quantities. The complete list supported by Android is `zero`, `one`, `two`, `few`, `many`, and `other`.


For instance, in English, Spanish, and other languages that have similar grammatical rules, `zero` is ignored. That is because, grammatically, the quantity of `0` is treated the same way as other quantities except `1`. For example: "0 contacts found", "1 contact found", and "2 contacts found".


Other languages have different rules:

- In `Chinese` and `Korean`, only other is used since the grammar of sentences is not affected by the quantity.

- In `Russian`, one represents not only the quantity of 1 but also 21, 31, 41, 51, 61, and so on. Basically, any number ending with 1 with the exception of those ending with 11. For example: "1 контакт", "21 контакт". `few`, `many`, and `other` are also used in Russian.

- Other languages such as Arabic treat the quantity of 0 differently from other quantities, so `zero` is used in their cases.

Since we cannot exhaustively list every language and its grammatical rules, the rules Android mainly uses can be found here: [Language Plural Rules](https://www.unicode.org/cldr/cldr-aux/charts/25/supplemental/language_plural_rules.html).

## Usage in code

Assume you have a plural resource in the `res/values/strings.xml` file:

```xml
<plurals name="notification">
    <item quantity="one">You have %d notification</item>
    <item quantity="other">You have %d notifications</item>
</plurals>
```

You can access it by using the `getQuantityString()` method from the Resources class:

```kotlin
val newMessages = 5
val notification = resources.getQuantityString(R.plurals.notification, newMessages, newMessages)
```


















