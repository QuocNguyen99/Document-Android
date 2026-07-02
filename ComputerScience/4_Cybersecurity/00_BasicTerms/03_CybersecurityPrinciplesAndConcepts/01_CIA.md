# Confidentiality, integrity, availability

The **three fundamental characteristics** determine a computer system's security. **It provides a framework for addressing fundamental security objectives.**


## Confidentiality

- **Confidentiality as Information Protection**: confidentiality means safeguarding data from unexpected access or disclosure. It makes sure only users with the correct permissions can access information.

- **Confidentiality as a Security Strategy**: Confidentiality works as a security strategy featuring multiple protective layers to prevent unauthorized information disclosure. (including encryption, access control, and multi-factor authentication).

- **Confidentiality as an Ethical Obligation**: confidentiality signifies an ethical duty to protect user privacy by securing their data from unauthorized access or disclosure. This matter is central to maintaining a company's trust and credibility.

## Integrity

- **Integrity as Preservation of Data Invariance**: Integrity means preserving data invariance and authenticity. It assures that unauthorized individuals do not modify or erase information.

- **Integrity as a Protection Mechanism**: Integrity serves as a protection method that guards data from unauthorized changes using techniques and tools like checksum controls, system audits, and Security Information and Event Management (SIEM) systems.

- **Integrity as Organizational Responsibility**: Integrity also denotes an organization's obligation to continuously monitor and protect data to maintain its accuracy and consistency. This obligation is crucial for preserving customer trust and complying with legal criteria.

## Availability

- **Availability as Uninterrupted Operation**: Ensuring that information systems and data are readily available to authorized users to facilitate the organization's ongoing operations.

- **Availability as a Resilience Strategy**: Availability serves as a resilience strategy that protects information systems against failures and disruptions. It contains different measures like redundancy, business continuity planning, and regular backups.

- **Availability as the Key to Customer Satisfaction**: Availability is crucial for customer satisfaction as it assures that customers can always access the organization's services and resources, which is key to securing their trust and loyalty.

## Overview of methods to protect data

**Confidentiality**:

- Access Restriction (various access control models)
- Cryptographic methods
- Authentication
- Organizational measures (non-disclosure agreement, etc)

**Integrity**

- Version control
- Checksums
- Digital signatures
- Backups

**Availability**

- Data recovery
- Fail-over clusters
- Redundant Array of Independent Disks(RAID)
- Failover


## The CIA Triad in practice

Imagine finalizing a contract with an e-commerce company. The client wants to establish a system based on a microservice structure. Let's analyze what we should focus on during the business case analysis through the CIA triad lens.

**Confidentiality**
For protecting confidentiality in an e-commerce application, organizations can implement:

- **Data Encryption**: Implementing the HTTPS protocol, which encrypts data exchanges between the client and server, helps ward off data interception by third parties.

- **Application-Level Security**: By introducing Identity Management Systems to control access to sensitive parts of the application, like administrative panels.

- **Secure Password Storage**: By employing advanced hashing techniques, like bcrypt, to secure user passwords in the database.

- **Data Masking**: Data masking hides specific data in production and non-production environments, thus protecting sensitive information from unauthorized access.

**Integrity**
To ensure data integrity in an e-commerce application, procedures can include:

- **Digital Signatures**: Utilizing digital signatures to verify the integrity of data communicated between various microservices.

- **Data-Level Access Control**: Implementing thorough access control policies to prevent unauthorized modifications of product data or user information.

- **Automated Monitoring and Alerts**: By integrating monitoring systems that automatically detect and alert about unauthorized data modification attempts.

- **Blockchain for Financial Transactions**: Using blockchain technology to record financial transactions ensures the immutability and transparency of each transaction.

**Availability**
Strategies to ensure availability in an e-commerce application can include:

- **Autoscaling**: Implementing autoscaling mechanisms that dynamically adjust resources during traffic surges, ensuring even load distribution.

- **Load Balancing**: Incorporating load balancers to distribute network traffic among various servers to prevent overloads.

- **Disaster Recovery Plan**: Developing thorough disaster recovery plans that detail procedures for handling different emergency situations.

- **Geo-Redundancy**: Establishing a geo-redundant infrastructure that allows swift shifts between different data centers in various geographic locations, ensuring the continuity of operations even during local failures.



















