# This script pulls the latest docker image of the current branch
# and mounts the app code inside that container

# Usage: ./scripts/dev_in_docker.sh    -    run a docker container with current git branch
# Usage: ./scripts/dev_in_docker.sh <BRANCH_NAME> - use a specific branch for the container environment
# Find out which branch we are on. This branch should be pushed to origin, so we have a built container for it

BRANCH_NAME=$(git status | grep origin/ | cut -f 2 -d \/ | cut -f 1 -d \')
if [ $# -eq 1 ]
  then
    BRANCH_NAME=$1
    echo "Set Container Branch to $1"
fi
echo $BRANCH_NAME


# Pull the latest docker image from gitlab
echo "Pulling the latest docker image from branch $BRANCH_NAME"
docker pull registry.gitlab.com/horsetoast/vue-spa:$BRANCH_NAME

# Remove old container
docker stop vue_dev
docker rm vue_dev

# Launch the container detached
DOCKER_CONTAINER=$(docker run -d --name vue_dev -p 8080:8080 -p 8081:8081 -v $(pwd):/persistent registry.gitlab.com/horsetoast/vue-spa:$BRANCH_NAME tail -f /dev/null)

# Remove /app directory inside the docker container, so we don't accidentally make changes to ephemeral storage
docker exec -w "/" -it $DOCKER_CONTAINER bash -c "rm -rf app"

# Connect to the docker container
docker exec -w "/persistent" -it $DOCKER_CONTAINER bash
