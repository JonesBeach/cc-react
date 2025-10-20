#!/bin/bash

DIR_HOME=$(pwd)
DIR_CC_REACT="$DIR_HOME/packages/cc-react"
DIR_PLAYGROUND="$DIR_HOME/playground"
DIR_TESTS="$DIR_HOME/testing"

cd "$DIR_TESTS"
docker rm cc-react-tests
docker build -t cc-react-tests:latest --debug .
docker run --name cc-react-tests cc-react-tests:latest
docker logs cc-react-tests > docker.log