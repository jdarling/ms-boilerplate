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

## Tools

### build_all_services

### build.sh

### deploy_all_services

### explode_config

### mongo_connect

### new_service

### update_lib

### update_tools
