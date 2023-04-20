# MS Boilerplate

- Opinionated
- Microservice Architecture
- Boilerplate for web projects

## Documentation

- [Architecture Decision Records](docs/adr/)
- [Coding Standards](docs/codingstandards.md)

## Sample Usage

One the basic boilerplate is in place and mostly flushed out the idea is to create a sample application to demonstrate using all of the modules. Currently the thought is to create a basic data pipelining project to capture complete data packages into an eventstream that can be replayed with new business logic applied much as would be needed in a large scale data pipeline platform.

The sample project will be released as Open Source in hopes that it will lower the barrier to entry for others who need a similar solution.

## Service Templates

Service templates give you a starting point for adding a new service to the deployment. They are basic boilerplates around specific languages, you can create a new service for a desired language using `tools/new_service --serviceName "myservice" --serviceType "node"` see the new_service section for more details.

Each service type is created with a minimal framework that makes it ideal for service or microservice development. If the supplied version isn't to your liking, just create your own using an existing one as a template or from scratch.

### C#

### Lua

### Node

### Python

## Configuration

### .config

Belongs in the root of the project, right beside start and stop

```
[default]
clustername=localdev
namespace=mynamespace
dockerorg=myorg
mongohost=172.17.0.1
mongodb=mydb
```

## Kube Tools

Having a basic collection of tools to manage Kubernetes is a must, the kube folder contains some starter scripts and wrappers to get started. Any scripts ending in -k3 are focused on working with local K3s clusters created using K3d.

### helm

### helm-k3

### k3-get-config

### k3d

### kubectl

### kubectl-k3

### update_kube.sh

## Tools

The tools folder contains scripts around managing the project as a whole. This includes creating new services, building services, building the ui, deploying services, deploying the ui, updating support libraries, and updating tools scripts inside of services.

### build_all_services

### build.sh

### deploy_all_services

### explode_config

### mongo_connect

### new_service

### update_lib

### update_tools
