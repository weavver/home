all: clean build docker

build:
	mkdir dist

	@echo "Building Website..."
	cd website; ng build --prod
	cp -r website/dist dist/website
	cp .env.example dist
	cp package.json dist
	cp package-lock.json dist

	@echo "Building API..."
	tsc

	@echo "Installing npm dependencies..."
	cd dist; npm ci

docker:
	# docker build -f infrastructure/docker/Dockerfile --tag home:testing dist
	docker build -f infrastructure/docker/Dockerfile --tag home:testing -t registry.gitlab.com/weavver/home dist
	# docker push registry.gitlab.com/weavver/home

clean:
	rm -Rf dist