#!/bin/bash

NODE_ID=0

function start() {
    clear
    rm -rf ./dist
    rm -rf ./public/js
    tsc -w > build.log 2>&1 &
    echo -e "\033[1;30mWaiting for TypeScript's Watch Mode...\e[0m"
    grep -m 1 "Found" <(tail -f build.log)
    mkdir ./public/js
    execute "$1"
}

function execute() {
    TEXT="$1"
    clear
    echo -e "$TEXT"
    cp -r ./dist/client/*  ./public/js
    node ./dist/server/index.js &
    NODE_ID=$!
}

function before_restart() {
    kill $NODE_ID
}

start "\033[1;31mExecution started. Executing commands...\e[0m"

while inotifywait -q -r -e modify,create,delete,move "./dist"; do
    before_restart
    execute "\033[1;31mDirectory changes detected. Re-executing commands...\e[0m"
done