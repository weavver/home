# https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-cli-tutorial-fargate.html

init-policy:
	aws iam --region us-west-2 create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://task-execution-assume-role.json
	aws iam --region us-west-2 attach-role-policy --role-name ecsTaskExecutionRole --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

init-credentials:
	echo "this command is for reference only, manully replace AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY and run it"
	ecs-cli configure profile --access-key $AWS_ACCESS_KEY_ID --secret-key $AWS_SECRET_ACCESS_KEY --profile-name graph

init:
	ecs-cli configure --cluster graph --default-launch-type FARGATE --config-name graph --region us-west-2

cluster-create:
	ecs-cli up --cluster-config graph --ecs-profile default --vpc $HOME_VPC --subnets $HOME_SUBNETS

ls:
	ecs-cli compose --project-name graph service ps --cluster-config graph --ecs-profile default

task-create:
	ecs-cli compose --project-name graph service up --create-log-groups --cluster-config graph --ecs-profile default

task-delete:
	ecs-cli compose --project-name graph service down --cluster-config graph --ecs-profile default

cluster-delete:
	ecs-cli down --force --cluster-config graph --ecs-profile default