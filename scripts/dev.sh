#!/bin/bash

NODE_ID=0
DIR_HOME=$(pwd)
DIR_CC_REACT="$DIR_HOME/packages/cc-react"
DIR_PLAYGROUND="$DIR_HOME/playground"

function start() {
    clear
    echo -e "\033[1;30mCleaning for fresh start...\e[0m"
    rm -rf "$DIR_CC_REACT/dist"
    rm -rf "$DIR_PLAYGROUND/dist"
    rm -rf "$DIR_PLAYGROUND/public/js"
    mkdir "$DIR_PLAYGROUND/public/js"

    if [ ! -d "$DIR_CC_REACT/node_modules" ]; then
        echo -e "\033[1;35mMissing 'node_modules' folder in 'cc-react', installing...\e[0m"
        cd "$DIR_CC_REACT"
        npm install > /dev/null 2>&1
    fi

    if [ ! -d "$DIR_PLAYGROUND/node_modules" ]; then
        echo -e "\033[1;35mMissing 'node_modules' folder in the 'playground', installing...\e[0m"
        cd "$DIR_PLAYGROUND"
        npm install > /dev/null 2>&1
    fi

    echo -e "\033[1;30mLinking 'cc-react' package to the 'playground'...\e[0m"
    cd "$DIR_CC_REACT"
    npm link > /dev/null
    cd "$DIR_PLAYGROUND"
    npm link cc-react > /dev/null
    
    cd "$DIR_CC_REACT"
    npx tsc -w > build.log 2>&1 &
    echo -e "\033[1;30mWaiting for TypeScript's Watch Mode in 'cc-react'...\e[0m"
    grep -m 1 "Found" <(tail -f build.log) > /dev/null

    cd "$DIR_PLAYGROUND"
    npx tsc -w > build.log 2>&1 &
    echo -e "\033[1;30mWaiting for TypeScript's Watch Mode in the 'playground'...\e[0m"
    grep -m 1 "Found" <(tail -f build.log) > /dev/null


    execute "$1"
}


function execute() {
    TEXT="$1"
    cd "$DIR_PLAYGROUND"
    npx esbuild dist/client/App.js --bundle --outfile=public/js/App.js 2> /dev/null
    echo -e "$TEXT"
    node "$DIR_PLAYGROUND/dist/server/index.js" &
    NODE_ID=$!
}


function before_execute() {
    kill $NODE_ID
    clear
}


start "\033[1;31mExecution started. Executing commands...\e[0m"

while inotifywait -q -r -e modify,create,delete,move "$DIR_CC_REACT/dist" > /dev/null; do
    before_execute
    execute "\033[1;31mDirectory changes detected. Re-executing commands...\e[0m"
done