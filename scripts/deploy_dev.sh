###### Login to deployment server using SSH #####
mkdir -p ~/.ssh
echo "$DEPLOY_DEV_SERVER_PRIVATE_KEY" | tr -d '\r' > ssh.key
chmod 600 ssh.key
ssh-keyscan -H $DEPLOYMENT_DEV_SERVER_IP >> ~/.ssh/known_hosts 
###### GET OLD CONTAINER id WE NEED TO STOP
OLD_CONTAINER_NAME=`ssh $DEPLOYMENT_DEV_SERVER_USERNAME@$DEPLOYMENT_DEV_SERVER_IP -i "ssh.key" docker ps -a -q --filter ancestor=$CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME --format="{{.ID}}"`
echo "$OLD_CONTAINER_NAME"
if [ -z "${OLD_CONTAINER_NAME}" ]; then
    echo "NO CONTAINER TO STOP"
else
    ssh $DEPLOYMENT_DEV_SERVER_USERNAME@$DEPLOYMENT_DEV_SERVER_IP -i "ssh.key" docker stop $OLD_CONTAINER_NAME
    ssh $DEPLOYMENT_DEV_SERVER_USERNAME@$DEPLOYMENT_DEV_SERVER_IP -i "ssh.key" docker rm $OLD_CONTAINER_NAME
fi

###### Remove old images to make space
ssh $DEPLOYMENT_DEV_SERVER_USERNAME@$DEPLOYMENT_DEV_SERVER_IP -i "ssh.key" docker system prune -f


###### PULL THE NEW IMAGE AND DEPLOY 
ssh $DEPLOYMENT_DEV_SERVER_USERNAME@$DEPLOYMENT_DEV_SERVER_IP -i "ssh.key" docker pull $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME
ssh $DEPLOYMENT_DEV_SERVER_USERNAME@$DEPLOYMENT_DEV_SERVER_IP -i "ssh.key" docker run -d -p 8080:8080 -p 8081:8081 $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_NAME
rm ssh.key
