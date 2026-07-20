# Authorization

Authorization in cybersecurity is the process of granting or denying specific privileges or access to resources within a computer network or system.

![alt text](/resources/cybersecurity_authorization.png)

The core of Authorization is about managing access rights. 
In the above diagram, a user attempts to access an admin area, prompting the system to retrieve the user's permissions, claims, or roles. These permissions are then compared to the required permissions for the admin area. 
If the user's permissions match the required ones, access is granted. Otherwise, the user is not authorized, and access is denied, reinforcing the system's security by ensuring only those with the right privileges can perform certain actions. This process is vital in protecting sensitive areas of a system from unauthorized use and potential security threats.

## Role-Based access control (RBAC)

![alt text](/resources/iam_role_based_access_control.png)

**Role-Based Access Control (RBAC)** is a widely used method for managing users' access to resources and services in a system based on their roles within an organization.

Unlike traditional models where access is granted individually, RBAC assigns permissions to roles, and users are then assigned to these roles. This approach simplifies and streamlines the management of permissions.

In RBAC, access decisions are not based on the individual identity of the user, but on the roles they hold.
Each role encompasses a set of permissions that define what actions the role can perform. By grouping permissions into roles, it reduces the complexity of assigning and managing individual user permissions.

Implementing RBAC effectively requires a clear understanding of the organization's structure and the responsibilities of each role. The process typically involves:
- **Defining Roles**: Identifying distinct roles within the organization and their corresponding access needs.
- **Assigning Permissions**: Determining the specific permissions and access rights each role requires.
- **User Assignment**: Allocating users to these roles based on their job functions.
- **Monitoring and Auditing**: Regularly reviewing and updating roles, permissions, and user assignments to ensure they align with current organizational needs and security policies.

Additionally, the accumulation of roles, known as role creep, can lead to users gaining excessive permissions, which poses a security risk. Regular audits and updates are essential to maintain the integrity of the RBAC system.

## Attribute-based access control (ABAC)

![alt text](/resources/attribute_based_access_control.png)

**Attribute-Based Access Control (ABAC)** is a flexible and comprehensive approach to managing access rights in various systems and environments.
ABAC uses a dynamic method of granting access based on a combination of attributes. These attributes can be associated with the user, the resource, the action being requested, and the current context or environment.

Implementing ABAC requires a thorough understanding of the organization's security needs and a detailed analysis of the attributes that will be used in access control policies. This process involves:

- **Identifying Attributes**: Determining the relevant attributes of users, resources, actions, and context.

- **Defining Policies**: Creating policies that specify how these attributes interact to allow or deny access.

- **Policy Enforcement**: Setting up a system that can evaluate attributes against these policies in real-time.

- **Maintenance**: Regularly updating attributes and policies to reflect changes in the organizational environment and security requirements.


Example to consider this technique:

Consider a healthcare system where medical staff needs access to patient records. 
In this scenario, ABAC is highly effective. 
A doctor can access a patient's full medical record if they are currently treating that patient (user attribute: doctor, resource attribute: patient record, context: ongoing treatment). 
A nurse in the same department can view the patient's basic health information but not their psychiatric evaluation (user attribute: nurse, department; resource attribute: health information, psychiatric evaluation). 
Administrative staff can access billing information but not medical data (user attribute: administrative role; resource attribute: billing information).

> [!WARNING]
> The complexity of managing numerous attributes and policies can be substantial. 
> Ensuring the accuracy and consistency of attributes across systems is critical, as is maintaining the policies to ensure they are up-to-date and aligned with organizational objectives and compliance requirements.

## Access control lists (ACL)

![alt text](/resources/cybersecurity_access_control_list.png)

**Access Control Lists (ACL)** is a list of permissions attached to an object, specifying which users or system processes are granted access to that object and what operations they can perform. These objects can be files, directories, or network devices.

ACLs work by maintaining a list of entries, each of which defines a subject (like a user or group) and an associated action (like read, write, or execute). When a user attempts to access a resource, the system checks the ACL to determine if the user has the necessary permissions. The access is granted or denied based on this check.

There are two primary types of ACLs:
- **Discretionary ACLs (DACLs)**: These are controlled by the owner of the resource. The owner decides who can access the resource and what permissions they have.

- **System ACLs (SACLs)**: These are used for auditing and security logging. They record attempts to access a resource, whether successful or not.

ACLs offer a straightforward and effective way to manage permissions. They are particularly useful in environments where access needs are relatively static and clear-cut. 


## References
- https://hyperskill.org/learn/step/40451





























