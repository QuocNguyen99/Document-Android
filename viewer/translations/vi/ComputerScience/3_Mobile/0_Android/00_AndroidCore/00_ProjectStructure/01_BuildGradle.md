#tệp build.gradle

Trong các dự án dựa trên JVM-, bạn thường phải xử lý **xây dựng hệ thống**. 

Phổ biến nhất là Maven. Cấu hình của nó dựa trên XML và có cú pháp XML đầy chức năng nhưng khó đọc.
Trong Android, người ta đã quyết định sử dụng hệ thống xây dựng dự án Gradle. Các tệp Gradle có thể được viết bằng Groovy và gần đây cũng đã bắt đầu hỗ trợ Kotlin DSL.


Các dự án Android thường có hai tệp cấu hình Gradle — **cấp mô-đun** và **cấp dự án**.

## build.gradle (cấp mô-đun)

Khi chúng tôi tạo một dự án trong Android Studio, tệp `build.gradle` hiển thị bên dưới sẽ tự động được tạo trong thư mục ứng dụng:

```kotlin
plugins {
    id 'com.android.application'
    id 'kotlin-android'
}

android {
    compileSdk 30

    defaultConfig {
        applicationId "com.example.testapplication"
        minSdk 21
        targetSdk 30
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.3.2'
    implementation 'androidx.appcompat:appcompat:1.2.0'
    implementation 'com.google.android.material:material:1.3.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.0.4'
    testImplementation 'junit:junit:4.+'
    androidTestImplementation 'androidx.test.ext:junit:1.1.2'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
}
```

### khối plugin

Ở đầu `app/build.gradle`, chúng tôi thấy một khối chứa thông tin chi tiết về các plugin đang được sử dụng - đây là nơi chúng tôi có thể chỉ định `id` của bất kỳ plugin bổ sung nào mà chúng tôi muốn áp dụng:

```kotlin
plugins {
    id 'com.android.application'
    id 'kotlin-android'
}
```

Các plugin cho phép chúng tôi mở rộng chức năng của các dự án mà chúng tôi tạo. 

Ví dụ: plugin `com.android.application` có nghĩa là dự án là một ứng dụng Android, trong khi `com.android.library` sẽ chỉ ra rằng đó là một thư viện Android.

Plugin này cho phép bạn định cấu hình một số tùy chọn xây dựng ứng dụng Android trong khối `android` tiếp theo.

### khối android
Tiếp theo là khối `android`. Đây là nơi chúng tôi đặt cấu hình cụ thể cho ứng dụng Android của mình bằng dấu ngoặc nhọn.

### Khối defaultConfig
Trong phần `defaultConfig`, chúng tôi chỉ định các thuộc tính mà plugin Android (`com.android.application`) sẽ áp dụng cho tất cả các bản dựng ứng dụng của chúng tôi:

```kotlin
defaultConfig {
    applicationId "com.example.testapplication"
    minSdk 21
    targetSdk 30
    versionCode 1
    versionName "1.0"
    testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
}
```

- `applicationId` là mã nhận dạng duy nhất cho phép bạn xác định ứng dụng của mình trong Cửa hàng Google Play. Nó có những hạn chế nhất định:

    - Tên phải có ít nhất hai phân đoạn — một hoặc nhiều dấu chấm trong tên.

    - Phân đoạn chỉ có thể bắt đầu bằng chữ cái.

    - Chỉ cho phép chữ và số và dấu gạch dưới.

- `minSdk` xác định phiên bản Android tối thiểu mà ứng dụng sẽ tương thích.

- `targetSdk` đặt mức API mà ứng dụng dự định chạy.

- `versionCode` là biến số nguyên biểu thị mã phiên bản của ứng dụng, đúng như tên gọi của nó. Nó không được hiển thị cho người dùng nhưng bảo vệ khỏi việc hạ cấp phiên bản ứng dụng, nghĩa là không thể đặt phiên bản cũ hơn lên phiên bản hiện có.


- `versionName` là vì lợi ích của người dùng — nó hiển thị với họ và phải là một chuỗi. Tham khảo Lập phiên bản ngữ nghĩa để biết hướng dẫn về cách xây dựng chuỗi phiên bản.


- `testInstrumentationRunner` chỉ định tên lớp đầy đủ của người chạy thử nghiệm sẽ thực hiện các thử nghiệm được thiết bị Android.

### Khối buildTypes

Phần tiếp theo là `buildTypes`. Ở đây chúng tôi khai báo các cấu hình lắp ráp. Ví dụ: phát hành và gỡ lỗi cấu hình. Mọi thứ chúng tôi chỉ định bên trong `release{ ... }` sẽ được áp dụng cho bản dựng cụ thể này:


```kotlin
buildTypes {
    release {
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
```
Cờ `minifyEnabled false` chịu trách nhiệm bật **R8** và được đặt thành sai theo mặc định. Đây là một công cụ đặc biệt dùng để làm xáo trộn và tối ưu hóa mã. Tính năng che giấu mã được sử dụng để bảo vệ mã chương trình khiến tin tặc càng khó phá vỡ hơn. Nếu chúng tôi bật tính năng này, tính năng rút gọn mã, làm xáo trộn mã nguồn và tối ưu hóa sẽ chỉ được bật cho loại bản dựng phát hành của dự án.


`proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'` cho phép chúng tôi đưa các quy tắc ProGuard tiêu chuẩn vào bản dựng. Tuy nhiên, tệp `proguard-rules.pro` không chứa bất kỳ quy tắc nào theo mặc định. Nó nằm trong thư mục ứng dụng, vì vậy bạn có thể thêm một số quy tắc vào đó nếu muốn.

### Khối compileOptions

`compileOptions` là nơi chúng tôi chỉ định các tính năng biên dịch của dự án:

```kotlin
compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
}
```

sourceCompatibility `JavaVersion.VERSION_1_8` cho biết rằng phiên bản Java programming language này sẽ được sử dụng để biên dịch các tệp .java.

Tham số targetCompatibility `JavaVersion.VERSION_1_8` đảm bảo rằng các tệp lớp được tạo sẽ tương thích với các máy ảo được chỉ định trong phiên bản này.

Lưu ý rằng mục tiêu thường được gán cùng giá trị với nguồn:

```kotlin
kotlinOptions {
    jvmTarget = '1.8'
}
```


### khối phụ thuộc

Khối cuối cùng là nơi chúng ta xác định các dependency của dự án. Từ khóa `implementation` cho phép chúng ta truy cập các dependency từ xa, sẽ được tải từ repository từ xa:

```kotlin
implementation 'androidx.core:core-ktx:1.3.2'
```

`testImplementation` và `androidTestImplementation` lần lượt thêm các dependency cho cấu hình thử nghiệm và androidTest:

```kotlin
testImplementation 'junit:junit:4.+'
androidTestImplementation 'androidx.test.ext:junit:1.1.2'
androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0'
```

Dự án của chúng tôi tạo ra ba gói: `app/src/main`, `app/src/androidTest` và `app/src/test`. Gói đầu tiên là gói làm việc chính nơi chúng tôi viết mã ứng dụng của mình. Gói thứ hai là gói nơi chúng tôi viết các bài kiểm tra cụ thể cho các thành phần hệ thống Android. Và phần thứ ba là nơi chúng tôi viết các bài kiểm tra độc lập với Android.

## build.gradle (cấp dự án)

```kotlin
// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id 'com.android.application' version '8.0.2' apply false
    id 'com.android.library' version '8.0.2' apply false
    id 'org.jetbrains.kotlin.android' version '1.8.20' apply false
}
```

Tệp bạn có thể thấy ở trên còn được gọi là `build.gradle` và được tạo trong thư mục gốc của dự án (do đó có tên là cấp độ dự án).
Các ứng dụng có thể có một số mô-đun, vì vậy nó mô tả cấu hình sẽ được áp dụng cho tất cả các mô-đun đó.

Khi chúng tôi bắt đầu một dự án mới, các plugin này được xác định trong phương thức plugin và cần thiết cho dự án Android. 

Tất cả các plugin được đặt bên trong phương thức này sẽ được tìm kiếm theo repository được đặt trong `settings.gradle`.

`com.android.application` là thành phần thiết yếu trong Gradle để sử dụng trong dự án ứng dụng Android.
Nó xử lý việc đóng gói tài nguyên, nội dung và mã ứng dụng thành tệp APK để sẵn sàng cài đặt và thực thi trên thiết bị Android.

`com.android.library` rất cần thiết cho dự án Android, nó được sử dụng để tạo thư viện hoặc dependency Android có thể được sử dụng làm dependency trong các dự án Android khác. Nó cung cấp các tác vụ, cấu hình và quy ước cần thiết để xây dựng và đóng gói tài nguyên, nội dung và mã của mô-đun vào tệp Lưu trữ Android (AAR). Tệp AAR chứa mã được biên dịch, tài nguyên và bảng kê khai của thư viện, giúp dễ dàng chia sẻ và sử dụng lại trên các dự án Android khác nhau.

`org.jetbrains.kotlin.android` được sử dụng cho các dự án Android Kotlin. Nó được sử dụng để kích hoạt hỗ trợ ngôn ngữ Kotlin trong các mô-đun Android, đặt cấu hình cần thiết để biên dịch mã Kotlin và tích hợp liền mạch với bản dựng Android process. Plugin này đảm bảo rằng các tệp Kotlin được biên dịch thành mã byte Java, giúp chúng tương thích với Android Runtime (ART) trên thiết bị Android.


> [!CAUTION]
> Phiên bản plugin Kotlin phải tương thích với phiên bản Kotlin compiler và phiên bản thư viện tiêu chuẩn Kotlin được sử dụng trong dự án của bạn.

## Các tệp Gradle khác

Có ba người khác bạn nên biết về:

1. Tệp `gradle-wrapper.properties` được sử dụng để định cấu hình trình bao bọc Gradle, đây là công cụ để tải xuống phiên bản Gradle cụ thể:

```properties
distributionBase=GRADLE_USER_HOME
distributionUrl=https\://services.gradle.org/distributions/gradle-7.0.2-bin.zip
distributionPath=wrapper/dists
zipStorePath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
```
2. Giống như tệp trước, gradle.properties chứa các cặp khóa-giá trị. Chúng ta có thể sử dụng nó để định cấu hình một số thuộc tính nhất định: tham số JVM, kiểu mã Kotlin, v.v.

```properties
org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
```
3. Và cuối cùng, `settings.gradle` nó nằm trong thư mục gốc của dự án và xác định **cấp dự án** **cài đặt repository** và thông báo cho Gradle những mô-đun nào nên bao gồm khi xây dựng ứng dụng của bạn. **Các dự án nhiều mô-đun cần chỉ định từng mô-đun sẽ được đưa vào bản dựng cuối cùng**.

```kotlin
pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "testapplication"
include ':app'
```

- Khối **pluginManagement** được sử dụng để xác định các repository trong đó Gradle sẽ tìm kiếm các plugin. nó chỉ định ba repository:
  - `google()`: Repository Maven của Google, được sử dụng để giải quyết các plugin và phụ thuộc liên quan đến Android.
  - `mavenCentral()`: Maven Central repo, là repository phổ biến cho các thư viện Java và Android.
  - `gradlePluginPortal()`: Cổng thông tin plugin Gradle, là repository chính thức cho các plugin Gradle.

- Khối repository **dependencyResolutionManagement** là nơi bạn định cấu hình các repository và dependency được sử dụng bởi tất cả các mô-đun trong dự án của bạn, chẳng hạn như các thư viện mà bạn đang sử dụng để tạo ứng dụng của mình.

Tuy nhiên, bạn nên định cấu hình các dependency dành riêng cho từng mô-đun trong từng tệp build.gradle ở cấp độ mô-đun. Đối với các dự án mới, Android Studio bao gồm repository Maven của Google và Maven Central Repository theo mặc định, nhưng nó không định cấu hình bất kỳ dependency nào (trừ khi bạn chọn một mẫu yêu cầu một số phần phụ thuộc).

- `rootProject.name = "testapplication"`: Dòng này đặt tên của dự án gốc thành "testapplication." Dự án gốc đại diện cho dự án cấp cao nhất trong bản dựng nhiều mô-đun.

- `include ':app'`: Dòng này bao gồm mô-đun ứng dụng trong tệp build. Điều đó có nghĩa là mô-đun ứng dụng sẽ là một phần của dự án Android tổng thể và sẽ được xây dựng khi bạn chạy các tác vụ Gradle. Nó cho phép chúng tôi bao gồm nhiều mô-đun trong dự án của mình bằng cách xác định các dự án con được phân tách bằng dấu phẩy:

`include ':app', ...`