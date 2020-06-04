# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-cli-tutorial-fargate.html

iam-create-role:
	aws iam --region $AWS_REGION create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://task-execution-assume-role.json

iam-attach-policy:
	aws iam --region $AWS_REGION attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

ls:
	ecs-cli compose --project-name home service ps --cluster-config home --ecs-profile home-profile

task-create:
	ecs-cli compose --project-name home service up --create-log-groups --cluster-config home --ecs-profile home-profile

task-delete:
	ecs-cli compose --project-name home service down --cluster-config home --ecs-profile home-profile

cluster-delete:
	ecs-cli down --force --cluster-config home --ecs-profile home-profile
