# K3s/K3d

## Status

Adopted

## Context

K3s is a great wrapper around Kubernetes and using K3d it becomes simple to manage K3s clusters. Adopting both allows easy local testing of Kubernetes integration.

## Decision

Utilize K3d to manage K3s clusters.

## Consequences

There is a layer of abstraction that may or may not result in a difference between K3s clusters vs something like EKS or native clusters.
