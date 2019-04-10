#!/bin/bash
echo 'Hello, which environment are you deploying to?'
echo '(type "production", "dev" or "local")'
read varname
echo 'Building for '$varname
screen -ls | grep Detached | cut -d. -f1 | awk '{print $1}' | xargs kill
git pull
NODE_ENV=$varname yarn build:ca
NODE_ENV=$varname yarn build:ph
screen -dm bash -c 'python serve_ca.py'
screen -dm bash -c 'python serve_ph.py'