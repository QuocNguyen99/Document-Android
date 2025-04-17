## Numbers

Kotlin provides several types for **integers** and **fractional** numbers.

If an integer value contains a lot of digits, we can add underscores to divide the digits into blocks to make this number more readable: for example, `1_000_000` is much easier to read than `1000000`.

**Integer numbers** (0, 1, 2, ...) are represented by the following four types: `Long`, `Int`, `Short`, `Byte` (from the largest to the smallest). The integer type range can be calculated as −(2n−1) to (2n−1)−1, where n is the number of bits. The range includes 0, that's why we subtract 1 from the upper bound.

- **Byte**: 8 bits (1 byte), range varies from -128 to 127;
- **Short**: 16 bits (2 bytes), range varies from -32768 to 32767;
- **Int**: 32 bits (4 bytes), range varies from -(2^31) to (2^31) - 1;
- **Long**: 64 bits (8 bytes), range varies from -(2^63) to (2^63) - 1.

The size cannot be changed. It does not depend on the operating system or hardware.

**Floating-point** types represent numbers with fractional parts. Kotlin has two such types: `Double` (64 bits) and `Float` (32 bits). These types can store only a limited number of decimal digits (~6-7 for `Float` and ~14-16 for `Double`).