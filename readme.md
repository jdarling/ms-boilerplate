# MS Boilerplate

- Opinionated
- Microservice Architecture
- Boilerplate for web projects

## Documentation

- [Architecture Decision Records](docs/adr/)
- [Coding Standards](docs/codingstandards/)
- [Tools](tools/)
- [Kube Tools](kube/)

## Service Templates

Service templates give you a starting point for adding a new service to the deployment. They are basic boilerplates around specific languages, you can create a new service for a desired language using `tools/new_service --serviceName "myservice" --serviceType "node"` see the new_service section for more details.

Each service type is created with a minimal framework that makes it ideal for service or microservice development. If the supplied version isn't to your liking, just create your own using an existing one as a template or from scratch.

### C#

### Lua

### Node

### Python

## Configuration

In order to make it easier to utilize the built in tooling the confuration loader suports the concept of environment based configuration.

You can provide configuration values in the .envconfig file for a given environment by creating a segment in the file using \[environmentName] the default environment name is "default" and is loaded if no other environment is specified.

Calling any script with --environment "environmentName" will load that environment configuration. If the environment isn't defined within the .envconfig file then no values will be loaded.

In this way you don't always have to provide commandline confiruation values every time you call a script.

### .envconfig

Belongs in the root of the project, right beside start and stop

```
[default]
clustername=localdev
namespace=mynamespace
dockerorg=myorg
mongohost=172.17.0.1
mongodb=mydb
```

## Sample Usage

One the basic boilerplate is in place and mostly flushed out the idea is to create a sample application to demonstrate using all of the modules. Currently the thought is to create a basic data pipelining project to capture complete data packages into an eventstream that can be replayed with new business logic applied much as would be needed in a large scale data pipeline platform.

The sample project will be released as Open Source in hopes that it will lower the barrier to entry for others who need a similar solution.
