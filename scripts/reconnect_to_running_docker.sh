# This script reconnects to a running docker container

# Usage: ./scripts/reconnect_to_running_docker.sh    -    reconnect to a running container

docker exec -w "/persistent" -it vue_dev bash
