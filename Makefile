all: clean build docker

build:
	mkdir dist

	./api/certificates/generate.sh

	@echo "Building Website..."
	cd website; ng build --prod
	cp -r website/dist dist/website
	cp .env.default dist
	cp package.json dist
	cp package-lock.json dist

	@echo "Building API..."
	tsc

	@echo "Installing npm dependencies..."
	cd dist; npm ci


docker:
	# docker build -f infrastructure/docker/Dockerfile --tag home:testing dist
	# docker build -f infrastructure/docker/Dockerfile --tag home:testing -t registry.gitlab.com/weavver/home dist
	# docker push registry.gitlab.com/weavver/home

# a build to help ci proccesses be faster
docker-ci:
	docker build -f infrastructure/continuous-integration/Dockerfile -t registry.gitlab.com/weavver/home/ci infrastructure/continuous-integration

docker-ci-push:
	docker push registry.gitlab.com/weavver/home/ci

docker-ci-run:
	docker run -it --rm registry.gitlab.com/weavver/home/ci /bin/ash

docker-home:
	cd api
	tsc
	cd ..
	docker build --no-cache -f infrastructure/product/Dockerfile -t registry.gitlab.com/weavver/home:latest .

docker-home-push:
	docker push registry.gitlab.com/weavver/home:latest

docker-home-run:
	docker run \
		--env-file .env \
		-p 4444:4444 \
		-it \
		--rm registry.gitlab.com/weavver/home:latest /bin/ash

docker-home-run-terminal:
	docker run \
		--entrypoint "" \
		--env-file .env \
		-p 4444:4444 \
		-it \
		--rm registry.gitlab.com/weavver/home /bin/ash

clean:
	rm -Rf dist
