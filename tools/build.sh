#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "${DIR}" || exit 1

dockerorg=myorg

rootDir=$(echo "${DIR}" | sed 's~/services/.*~~')
eval `CONFIG_FILE="${rootDir}/.config" "${rootDir}/tools/explode_config" "$@"`

PUBLISH=false

VERSION=false
MAJOR=false
MINOR=false
PATCH=false
UPREV=false

Showhelp () {
  scriptname=`basename "$0"`
  cat <<USAGE
${scriptname} <options>

  Options:
    -M, --major - Increment the major version number
    -m, --minor - Increment the minor version number
    -p, --patch - Increment the patch version number
    -v <version>, --version <version> - Set the version number
    -P, --publish - Publish the image to docker hub

    -h or --help - Show this screen
USAGE
    exit 0
}

getVersion () {
  if [ $IS_NODE_PROJECT ]; then
    export VERSION=`node -e 'console.log(require("./src/package.json").version)'`
  else
    echo "ERROR: Must specify base version for service ${SERVICE_NAME}"
    exit 1
  fi
}

while [[ $# > 0 ]]
do
  key="$1"
  case "${key}" in
    -M|--major)
      MAJOR=true
      UPREV=true
    ;;
    -m|--minor)
      MINOR=true
      UPREV=true
    ;;
    -p|--patch)
      PATCH=true
      UPREV=true
    ;;
    -v|--version)
      VERSION="$2"
      shift
    ;;
    -P|--publish)
      PUBLISH=true
    ;;
    -h|--help)
      Showhelp
    ;;
    *)
    # unknown option
    ;;  esac
  shift # past argument or value
done

IS_NODE_PROJECT=$(test -f "${DIR}/src/package.json")

if [ $IS_NODE_PROJECT ]; then
  SERVICE_NAME=`node -e 'console.log(require("./src/package.json").name)'`
else
  echo "Service name: ${SERVICE_NAME}"
  : ${SERVICE_NAME:=$(basename "${DIR}")}
fi

# Get the current script directory

SOURCE="${BASH_SOURCE[0]}"
while [ -h "${SOURCE}" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "${SOURCE}" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "${SOURCE}")"
  [[ ${SOURCE} != /* ]] && SOURCE="${DIR}/${SOURCE}" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "${SOURCE}" )" >/dev/null 2>&1 && pwd )"

cd "${DIR}"

if [[ ${UPREV} != true ]]; then
  PATCH=true
fi

if [[ ${UPREV} == true ]]; then
  if [[ ${VERSION} == false ]]; then
    getVersion
  fi
  a=( ${VERSION//./ } )
  if [[ ${MAJOR} == true ]]; then
    ((a[0]++))
    a[1]=0
    a[2]=0
  fi

  if [[ ${MINOR} == true ]]; then
    ((a[1]++))
    a[2]=0
  fi

  if [[ ${PATCH} == true ]]; then
    ((a[2]++))
  fi

  VERSION="${a[0]}.${a[1]}.${a[2]}"
  echo "*****Calculated next build number: ${VERSION}*****"
fi

if [[ ${VERSION} == false ]]; then
  getVersion
else
  if [ $IS_NODE_PROJECT ]; then
    cd src
    npm version "${VERSION}"
    git add package.json
    git commit -m "v${VERSION}"
    git push origin master
    cd ..

    if [ -f "$(pwd)/prod.yaml" ]; then
      echo "*****Updating prod.yaml*****"
      replaceText=$(cat prod.yaml | grep -E "image: *${dockerorg}/${SERVICE_NAME}:" | sed -e 's/^[[:space:]]*//')
      replaceWith="image: ${dockerorg}/${SERVICE_NAME}:v${VERSION}"

      newProdYaml=$(cat prod.yaml | sed "s~${replaceText}~${replaceWith}~")
      echo -e "${newProdYaml}">prod.yaml
    fi
  fi
fi
SERVICE_VERSION="v${VERSION}"

cd ${DIR}

if [ ! -f "Dockerfile" ]; then
  echo "ERROR: No Dockerfile found"
  exit 1
fi

if [ -d './src/public' ]; then
  cd src/public
  yarn build
  cd ${DIR}
fi

EXITED=`docker ps -aq --filter status=exited`
if [[ "${EXITED}" != "" ]]; then
  docker rm $(docker ps -aq --filter status=exited)
fi
docker image rm "${SERVICE_NAME}:latest"
docker image rm "${dockerorg}/${SERVICE_NAME}:latest"
docker image rm "${dockerorg}/${SERVICE_NAME}:${SERVICE_VERSION}"

set -ex

docker build --rm --tag "${SERVICE_NAME}:latest" --build-arg "SERVICE_VERSION=${SERVICE_VERSION}" .
docker tag "${SERVICE_NAME}:latest" "${dockerorg}/${SERVICE_NAME}:latest"
docker tag "${SERVICE_NAME}:latest" "${dockerorg}/${SERVICE_NAME}:${SERVICE_VERSION}"

if [[ ${PUBLISH} == true ]]; then
  docker push "$dockerorg/$SERVICE_NAME:latest"
  docker push "$dockerorg/$SERVICE_NAME:${SERVICE_VERSION}"
fi
