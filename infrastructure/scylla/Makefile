
deploy:
	ts-node scylla-tool.ts  --region=$AWS_REGION \
					    --deploy \
					    --key=$AWS_PRIVATE_KEY \
					    --zone=$NODE_ZONE \
					    --ip=$NODE_IP \
					    --security-group=$NODE_SECURITY_GROUP

deploy-dev:
	ts-node scylla-tool.ts  --region=$AWS_REGION \
					    --deploy \
					    --key=$AWS_PRIVATE_KEY \
					    --zone=$DEV_NODE_ZONE \
					    --ip=$DEV_NODE_IP \
					    --security-group=$DEV_NODE_SECURITY_GROUP
