# Monorepo

## Status

Adopted

## Context

Read for more details: https://circleci.com/blog/monorepo-dev-practices/

The monorepo approach has several advantages:

Easy visibility. If you are working on a microservice that calls other microservices, you can look at the code, understand how it works, and find out if bugs are from your own code or another team’s microservice.

Code sharing. Teams duplicating code for microservices create additional engineering overhead. If common models, shared libraries, and helper code are all stored in a single repository, teams can share them among many microservices.

Improved collaboration. A monorepo removes barriers and silos between teams, making it easier to design and maintain sets of microservices that work well together.

Standardization. With monorepos, it is easier to standardize code and tooling across the teams. You can create policies that keep your main branch uncluttered, limit access to specific branches, enforce naming guidelines, include code reviewers, and enforce best practices. Branch policies keep in-progress work isolated from completed work.

Discoverability. A monorepo offers a single view of the whole code. You can review status for the whole repository, screen all branches, and keep track of modifications much more easily in monorepos than in polyrepos.

Release management. A monorepo retains all the information about how to deploy the whole system. An automated build and deploy pipeline doesn’t hide deployment knowledge within each team the way it does in a polyrepo.

Easier refactoring. Direct access to all microservices makes it easier to refactor the code in a monorepo. Also, you can change the code structure. Moving the source code between folders and subfolders is much easier than moving the source code between multiple repositories.

## Decision

Makes sense to use a monorepo for a boilerplate project. Could be split out if wanted for a derrived project.

## Consequences

As microservices architecture becomes more popular, many teams tend to split their code into multiple repositories (polyrepos). Developers work on microservices independently, using different, problem-specific tools and programming languages. For example, some developers may use open source projects like Python for artificial intelligence (AI), while others use Java or .NET to implement APIs.

The advantages of polyrepos are clear. A small team can rapidly implement, and independently deploy, a microservice for high-velocity software development.
