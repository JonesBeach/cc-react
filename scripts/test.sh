#!/bin/bash

DIR_HOME=$(pwd)
DIR_CC_REACT="$DIR_HOME/packages/cc-react"
DIR_PLAYGROUND="$DIR_HOME/playground"
DIR_TESTS="$DIR_HOME/testing"

clear
cd "$DIR_TESTS/environments"
ENVIRONMENTS=$(echo *)
cd "$DIR_TESTS"

for environment in $ENVIRONMENTS; do
    (
        DOCKER_TAG=cc-react-playwright:$environment
        DOCKER_NAME=cc-react-playwright-$environment
        FOLDER="environments/$environment"
        BUILD_LOG="$FOLDER/logs/build.log"
        RUN_LOG="$FOLDER/logs/run.log"

        echo -e "\033[1;30m($environment) Removing old containers...\e[0m"
        docker rm "$DOCKER_NAME" > /dev/null
        echo -e "\033[1;30m($environment) Building new images (output in $BUILD_LOG)...\e[0m"
        docker build -t "$DOCKER_TAG" --debug --file "$FOLDER/$environment.Dockerfile" --progress=plain . &> "$BUILD_LOG"
        echo -e "\033[1;30m($environment) Running new images (output in $RUN_LOG)...\e[0m"
        docker run --name "$DOCKER_NAME" "$DOCKER_TAG" > /dev/null
        docker logs "$DOCKER_NAME" > "$RUN_LOG"
    ) &
done

wait