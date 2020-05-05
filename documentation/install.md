[More documentation](/)

# Install Guide

Docker.. docker.. docker.. It's an easy way to get home up and running. Maybe get a docker image for janusgraph and scylladb to give those requirements. A docker image of home will be generated soon.

### Configuring

home depends upon environmental variables. Copy .env.default to .env and set values to match needs.

#### Install NPM Dependencies
Use "npm install" to download dependencies.
~~~
npm install
cd api
npm install
cd ../website
npm install
~~~

Note: Use "npm ci" instead of "npm install" with production systems. 

### Starting
#### Standalone service

~~~
cd weavver-home
npm run server
~~~

#### Using pm2 to keep it up

~~~
npm install pm2 -g
pm2 start
pm2 stop all
~~~

### Amazon Web Services

#### Requirements:  
1. JanusGraph or other Gremlin-Compatible Graph Database
2. AWS account
3. [AWS CLI tools set up in your shell](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)

#### Overview of Configuring AWS
1. Git clone this repo.
2. Copy .env.default to .env and fill in variables.
3. Set up a domain in Route 53 (example.com).
4. Set up a SSL certificate in us-east-1 (must be in us-east-1) for these names: home.example.com and api.home.example.com.
5. Set up a public bucket in S3 "example-home".
6. Set up a CloudFront distribution to serve that S3 bucket (example-home) from "home.example.com".

### Deploy to API Gateway
~~~
1. npm install dotenv -g
2. npm install serverless -g
3. cd api 
4. dotenv -e ../.env serverless deploy
~~~

#### Deploy Website
Warning: Command #4 will delete ALL FILES from which bucket is specified.

Note: Replace \$AWS_S3_BUCKET and \$AWS_CLOUDFRONT_ID with real values.

~~~~
1. npm install dotenv -g
2. npm install serverless -g
3. cd website 
4. aws s3 sync website/dist s3://$AWS_S3_BUCKET --delete --acl public-read
5. aws cloudfront create-invalidation --distribution-id $AWS_CLOUDFRONT_ID --paths "/*"
~~~~


#### Troubleshooting

Check .gitlab-ci.yml file in this repository for our most up to date deployment example.