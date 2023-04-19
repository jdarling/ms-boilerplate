#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "${DIR}/../tools"
TOOLS_DIR=$(pwd)
cd "${DIR}" || exit 1

export USE_SUDO="false"
export KUBECTL_INSTALL_DIR="${DIR}/bin/kubectl"
export K3D_INSTALL_DIR="${DIR}/bin/k3d"
export HELM_INSTALL_DIR="${DIR}/bin/helm"

eval `CONFIG_FILE="${DIR}/../.config" "${TOOLS_DIR}/explode_config" "$@"`

mkdir -p "${KUBECTL_INSTALL_DIR}"
cd "${KUBECTL_INSTALL_DIR}" || exit 1
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x "${KUBECTL_INSTALL_DIR}/kubectl"
cd "${DIR}" || exit 1

mkdir -p "${K3D_INSTALL_DIR}"
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

mkdir -p "${HELM_INSTALL_DIR}"
curl -s https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
