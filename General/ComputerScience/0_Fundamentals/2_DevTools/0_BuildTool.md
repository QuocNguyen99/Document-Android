# Build tools

A build tool is a program that automates the process of creating executable applications from source code. The build process includes compiling sources and linking and packaging the code into a usable or executable form.

## What can build tools do?

1. Downloading and adding dependencies. This is especially convenient when your project depends on a large number of libraries.

2. Compiling source code into bytecode. Build tools will invoke the compiler for all the files in your project.

3. Packaging compiled code. You will have a production-ready application archive like JAR, APK, or some other.

4. Running tests. For example, testing the application archive every time to check if it works correctly. It allows programmers to avoid bugs after modifying the application.

5. Deploying to a production environment.

## Build tools for Java-based projects
There are three main build tools for Java-based projects: Apache Ant, Apache Maven, and Gradle.

- **Apache Ant** was released in 2000. It is the oldest of these three build tools. Coders rarely use Ant in new projects but it still occurs in practice. You can use this tool together with Apache Ivy to manage dependencies.

- **Apache Maven** was released in 2004, and now it is one of the most popular choices for Java developers (especially for server-side development). Many projects, both old and new, use Maven as a build tool because of its powerful dependency management possibilities.

- **Maven** follows the Convention Over Configuration concept which means that a developer needs to specify only unconventional aspects of the application, and all standard aspects work by default.

- **Gradle** is a new tool compared to Ant and Maven. It was released in 2007 and is now standard for Android applications. Also, developers use it for server and desktop development. Gradle aims to “combine the power and flexibility of Ant with the dependency management and conventions of Maven into a more effective way to build.”

## Gradle 

Gradle is a modern automation tool that helps build and manage projects written in Java, Kotlin, Scala, and other JVM-based languages. It describes project dependencies and determines how to build a project.


Gradle uses a well-designed plugin system, which is why it is a highly extensible tool. You can use plugins for automatic versioning, automatic testing, reporting about the build, and so on.

One of the best things about Gradle is its Groovy-based domain-specific language (DSL) that gives developers a specific way to form custom build scripts. The Kotlin developers are especially lucky since Gradle also started to support Kotlin for such scripts.


> [!NOTE]
> Please, note, that DSL is a computer language specialized to a particular application domain (like build automation). This is in contrast to a general-purpose language (GPL), which is broadly applicable across domains.

### The key concepts

The key features of Gradle are as follows:

- **Settings files**. Gradle uses several types of settings files to describe how to build a project.

- **Build-by-convention**. A programmer doesn't need to specify every building step that needs to be done. Instead, Gradle uses default settings and behavior. Although, every step of the default build process can be customized if necessary.

- **Dependency management**. Gradle automatically downloads specified external libraries and solves conflict cases with dependencies. You can declare as many dependencies as you need for a project.

- **Builds**. Gradle allows programmers to design well-structured and easily maintained comprehensible builds. It also supports complex cases such as multi-project or partial builds.

- **Ease of migration**. Gradle can easily adapt to any project structure you have. Therefore, you can always develop your project exactly the way you want.

- **DSL (based on Groovy and Kotlin)** for writing scripts in settings files.

The key concepts of Gradle: projects and tasks.

- A project might represent either something to be built (e.g. a JAR file or ZIP archive) or a thing to do (e.g. deploying the application). Every Gradle build contains one or more projects.

- A task is a single piece of work that a build performs. This can include compiling classes, running tests, generating docs, and so on. Every project is essentially a collection of one or several tasks.

The most basic structure:


```
.
├── build.gradle
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
└── settings.gradle
```

Here is brief info about all the generated files:

- The `build.gradle` file is a primary file that specifies the Gradle's project, including its tasks and external libraries. It can be created after invoking the gradle init command. 

- The files `gradle-wrapper.jar`, `gradle-wrapper.properties`, `gradlew` and `gradlew.bat` belong to **Gradle Wrapper** which allows you to run Gradle without its manual installation.

- The `settings.gradle` file specifies which projects to include in your build. This file is optional for a build that has only one project, but it is mandatory for a multi-project build.


#### Gradle build configuration

##### Plugins

The plugins section adds some plugins to extend the capabilities of the project, for example, to add new tasks or properties.

```groovy
plugins {
    // Apply the application plugin to add support for building a CLI application
    id("application")

    // Apply the plugin which adds support for Java
    id("java")

    // Apply the plugin which adds support for Kotlin/JVM
    id("org.jetbrains.kotlin.jvm")
}

```

Here, `id` is a globally unique identifier, or name, for plugins. Core Gradle plugins are special in that they provide short names, such as `"java"` or `"application"`.

**Gradle does not limit the maximum number of plugins used in a project.**

##### Repositories and dependencies

Usually, you don't need to write your program from scratch – you use already written pieces of code, either yours or other developers'. This is where the dependency system comes in handy.

The repositories section declares locations from which dependencies will be downloaded and added to the project.

```groovy
repositories {
    jcenter()
}
```

Also, you can just download the jars you need and place them into some directory on your computer, commonly in the libs folder of your project.

```groovy
repositories {
     flatDir{
        dirs 'libs'
     }
}
```

There are plenty of public repositories: `JCenter`, `Maven Central`, `Google`, and others. Usually, a description of a dependency says which repository contains it.

The `dependencies` section is used to add external libraries to the project. Gradle will automatically download them from the repositories and put them in the archive with the application. Your `dependencies` section should contain at least a testing library like `JUnit` or something else, depending on your choice of when the project was initialized.

```groovy
dependencies {
    // Use JUnit test framework.
    testImplementation 'junit:junit:4.13'

    // This dependency is used by the application.
    implementation 'com.google.guava:guava:29.0-jre'
}
```

In Gradle terminology, all external libraries are called dependencies. 
As a rule, they are packaged in JAR files. 
Gradle can automatically download them and add them to the project. 
It saves a lot of time and solves possible conflicts between versions of libraries.
**dependency management is one of the key features of Gradle. You don’t even need a plugin for it.**
