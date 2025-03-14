# Units of information

## Bit: the smallest unit of information

For the convenience of distinguishing, signals of two levels are used in classical electronic computers. One of them corresponds to the number `1`, and the other to `0`. Any letter, sound, or image on a computer is represented by a set of numbers. The numbers `1` and `0` are called **binary**. These are the symbols that make up the language understood and used by the computer. Any information on the computer is represented by binary digits: 1, meaning "**there is a signal**" or "**there is a high signal**" and `0`, meaning "**no signal**" or "**there is a low signal**".

The smallest unit of information is the **bit (b)**.

Each digit of the machine binary code carries an amount of information equal to one bit. It can take only one of two values: either `1` or `0`. It is very inconvenient to measure information in bits because the numbers come out too large.

## Byte: a sequence of eight bits

Like people do not consider the mass of ships in grams, larger and hence more convenient units were invented for measuring information as well.

The processing of information takes place in the processor. This is a device that can work with several bits at once (8, 16, 32, 64, ...). Most computers nowadays process 8 bits of information simultaneously, so we needed a new unit of measurement which was called a **byte (B)**, which means **8 bits**.

> [!CAUTION]
> It's important not to confuse bit and byte abbreviations. The lowercase 'b' is used for bits, while the uppercase 'B' denotes bytes. This distinction is important, as mixing them up can lead to significant misunderstandings, especially when measuring data transfer rates or storage capacity.

## Large units of information

The computer industry has historically used the units **kilobyte**, **megabyte**, and **gigabyte** in at least two slightly different measurement systems, which are slightly contradictory to each other.

- The first one is a **decimal-based system**, which uses bytes in powers of ten: **kilobyte** (10^3 bytes), **megabyte** (10^6 bytes), **gigabyte** (10^9 bytes), and so on. These units are used by the International System of Units (SI).

- The second one is a **binary-based system that uses bytes in powers of two**: **kibibyte** (2^10 bytes), **mebibyte** (2^20 bytes), **gibibyte** (2^30 bytes), and so on. This system was actively used to describe computer memory.

To reduce confusion, the `International Electrotechnical Commission (IEC)` proposed using prefixes kilo, mega, and giga only for the decimal-based system. For the binary-based system, they introduced new prefixes: **kibi**, **mebi**, and **gibi**. Here, 'bi' stands for binary. So, a kibibyte (KiB) equals 1,024 bytes, distinguishing it from a kilobyte (kB), which equals 1,000 bytes.

Here is a table with commonly used units of information according to modern international standards:

| SI Metric | Symbol | Powers of Ten | IEC Metric | Symbol | Powers of Two |
|---|---|---|---|---|---|
| Kilobyte | kB | 10^3 B (1000 B) | Kibibyte | KiB | 2^10 B (1024 B) |
| Megabyte | MB | 10^6 B (1000 kB) | Mebibyte | MiB | 2^20 B (1024 KiB) |
| Gigabyte | GB | 10^9 B (1000 MB) | Gibibyte | GiB | 2^30 B (1024 MiB) |
| Terabyte | TB | 10^12 B (1000 GB) | Tebibyte | TiB | 2^40 B (1024 GiB) |
| Petabyte | PB | 10^15 B (1000 TB) | Pebibyte | PiB | 2^50 B (1024 TiB) |


## Why does this matter?



This distinction might seem minor, but it becomes important in certain contexts.

For example, when buying a hard drive, you might notice that a drive advertised as 1 TB only shows about 931 GiB when connected to your computer. This is because the manufacturer uses the decimal system (1 TB = 1,000 GB), while your operating system uses the binary system (1 TiB = 1,024 GiB).

In programming, knowing the difference between these units may also prevent bugs. For instance, allocating memory in MiB instead of MB can result in an incorrect amount of memory being assigned, potentially leading to errors or performance issues.

Understanding these units can help prevent misunderstandings.

