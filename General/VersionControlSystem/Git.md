# Distributed Version Control System Git

Git is a Distributed Version Control System (DVCS) that was created in 2005 and has become one of the most popular distributed version control systems today. Git provides developers with a private repository that contains the entire history of changes.

## Platforms Based on Git

### GitHub
GitHub is a platform for managing Git repositories. It provides a web-based interface along with specialized features that make the process of using Git easier and more efficient. GitHub is particularly known for its collaborative tools, such as pull requests, code reviews, and integrated issue tracking. It also offers continuous integration and deployment (CI/CD) pipelines. Being a hosted service, GitHub handles the maintenance and security of the infrastructure, which allows users to focus solely on their projects.

### Gitlab

GitLab is a tool for managing Git repositories. It provides users with a web interface and dedicated features to facilitate the usage process. A distinguishing feature of GitLab is that users can download and install the system on their own servers (self-hosted). This capability makes GitLab a popular choice among organizations that need to ensure connection speed and enforce security policies within their own framework. GitLab also offers integrated CI/CD pipelines, issue tracking, and various collaboration tools.

### Bitbucket

Bitbucket, developed by Atlassian, is another Git-based repository management service. It offers both cloud-hosted and self-hosted options (Bitbucket Server). Bitbucket is known for its tight integration with other Atlassian products like Jira, which enhances project management and tracking capabilities. Bitbucket also provides features such as pull requests, inline commenting for code reviews, and powerful CI/CD tools through Bitbucket Pipelines.

### Gitea

Gitea is an open-source, self-hosted Git service. It aims to provide an easy-to-use, lightweight, and self-contained solution for managing Git repositories. Gitea is known for its simplicity in installation and low resource requirements, making it suitable for small teams or individual developers who want to host their own repositories without relying on external services. Gitea offers a range of features including a web interface, issue tracking, and CI/CD integration.


### Branching Strategy

The Branching Strategy in Git is a set of rules that developers must follow to closely track and control changes, and minimize conflicts in the source code when developing multiple features simultaneously. Specifically, branches are used as separate workspaces that allow developers to develop various features (updates, bug fixes, upgrades) on the same codebase. These branches are typically created from a main branch and merged back into the main branch after development is complete. The main branches are protected and must be approved by the team lead or source code administrator before any changes are made.

Currently, there are many popular Branching Strategies such as GitFlow, GitLab Flow, GitHub Flow, and Trunk-based development. Among these, GitFlow is considered the most popular and accessible method, providing users with high customization capabilities suitable for large-scale technology organizations.

### Tagging Version

Tagging version is the practice of assigning version numbers for each software rollout to record the development history of the software, including changes in a specific version. Tagging also supports the quick and convenient rollback of software to previous versions in case of any issues.

In Git, a tag is a simple naming function that allows us to clearly identify versions of the source code. We can think of a tag as an immutable branch. Once it is created (linked to a specific commit), we cannot change the commit history anymore.

### Workflow

your local repository consists of three "trees" maintained by git. the first one is your `Working Directory` which holds the actual files. the second one is the `Index` which acts as a staging area and finally the `HEAD` which points to the last commit you've made.

![alt text](image.png)

## General Git rules

### Source Code Branching Organization Rules
An application source code created on GitLab will have a default branch named Master and development branches named Feature. Based on various Branching Strategies, organizations will choose and adjust these strategies to align with their own guidelines and regulations.

Sacombank implements source code management based on the GitFlow methodology. Specifically:

- Long-lived branches: Branches deployed and maintained on a specific environment.

    - master: This is the default branch of a source code. The master branch is used to deploy and maintain the production environment.
    - uat: This branch contains source code deployed and maintained in the UAT (User Acceptance Testing) environment, which allows multiple features to be developed simultaneously. The UAT environment is used for business and technical units (QC, Information Security, etc.) to participate in testing and acceptance.
    - develop: Similar to the UAT branch, but the develop branch is deployed and maintained in the development (dev) or system integration testing (SIT) environment. The develop environment is used for developers to test features, allowing continuous commits and merges.
- Short-lived branches: These branches are created from the master branch when developing or adjusting features. These branches are typically launched in the local or sandbox environment of the developer.

    - feature_*: Branches containing source code for new feature development.
    - hotfix_*: Branches containing source code for application bug fixes.
- Temporary branches: Temporary branches are created from the long-lived branches to facilitate source code merging and conflict resolution when multiple features are being adjusted in the same source code. Large organizations often recommend always having a temporary branch for each merge request to long-lived branches.

    - temp_: Created from the develop or UAT branches. Developers merge source code from the feature branch into the temp_ branch to handle conflicts. After resolving conflicts, the code is merged from the temp_* branch to the corresponding long-lived branch (develop or UAT).
    - release_: Created from the master branch when a release to production is needed. The release_ branches can be merged from multiple feature_* and hotfix_* branches.

### Branch Naming Rules

The names of short-lived and temporary branches consist of three components: Prefix_ID_Description. The details are as follows:

- The three components are separated by underscores "_". The content within each component is separated by hyphens "-".
- The Prefix is a prefix that identifies the type of branch function according to the **Source Code Branching Organization Rules**.
- The ID is an incremental number (the creation time formatted as YYYYMMDDHHMI, tag number, or the ID code from the ticket management system). For example, in Helpdesk it would be HEL-123456, and in Jira, it would be JIRA-123.
- The Description is a brief description of the branch's function.

1. **Long-lived branches**:
    - The branch for the Production environment (default): master.
    - The branch for the UAT environment: uat.
    - The branch for the DEV environment: develop.
2. **Short-lived / feature branches**:
    - Feature branches: feature_<ID>_<Description>.
    - Bug fix branches: hotfix_<ID>_<Description>.
3. **Temporary branches**:
   - Temporary branches to merge into the develop and uat branches: temp_<ID>_<Description>.
   - Temporary branches to merge into the master branch: release_<ID>_<Description>.

#### Branch Naming Summary:

| Branch name| Environment   |    Type     | Parent branch|The branch allowed to merge into|
|------------|---------------|-------------|--------------|--------------------------------|
| master     | Production    | Long-lived  | master       | release_                       |
| uat        | UAT           | Long-lived  | master       | temp_                          |
| develop    | Develop/SIT   | Long-lived  | master       | temp_                          |
| feature_   | Short-lived   | master      | temp_        |                                |
| hotfix_    | Short-lived   | master      | temp_        |                                |
| release_   | Staging       | Temporary   | master       | feature_, hotfix_              |
| temp_      | Temporary     | develop, uat| feature_, hotfix_  |                          |

### Rules for Creating and Tagging Versions for Source Code

- **Version Format**:
A version consists of four main components: Major.Minor.Patch-Postfix. Specifically:
    - Major, Minor, and Patch are positive integers that increment and start from 0.
    - Postfix includes suffixes to distinguish versions between environments such as develop, uat, release, and master.
- **Incremental Rules for Version Tagging**:
Version tagging must follow these incremental rules:

    - **Major**: This is the primary version number. The Major number increases when there are significant changes to the source code (e.g., library upgrades, platform changes). For web services and APIs, changes that make the new version's functions incompatible with the old version are also considered major changes.
    - **Minor**: This is the secondary version number. The Minor number increases when new features are added or existing features are adjusted, as long as they remain compatible with previous versions.
    - **Patch**: This is the patch version number. The Patch number increases when there are adjustments related to bug fixes or security fixes.
        - When the **Minor** number increases, the Patch number resets to 0.
        - When the **Major** number increases, both the Minor and Patch numbers reset to 0.

- **Version Tagging Rules**:
Tagging a version when releasing a new version to the Production environment is mandatory. In the DevSecOps automation process, version tagging for the source code can be done either manually or automatically, depending on the needs of the development team or project.


> [!NOTE]  
> - The develop and uat branches need to be regularly synchronized from the master branch (the team lead should frequently delete/backup and create new uat and develop branches from the master branch).
> - Temporary branches must be deleted after merging into long-lived branches.

### Branch and Version Protection Rules:

The development team lead is responsible for setting up configurations to protect important branches and versions. Specifically:

- Set up Protected Branches for long-lived branches. Adjustments are only allowed through Merge Requests.
- Set up Protected Tags for tags with the postfix "master". Only Source Maintainers and the Jenkins tool are allowed to create or delete these tags.