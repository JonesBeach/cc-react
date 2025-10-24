#!/bin/bash

DIR_HOME=$(pwd)
DIR_CC_REACT="$DIR_HOME/packages/cc-react"
DIR_PLAYGROUND="$DIR_HOME/playground"

clear
cd "$DIR_CC_REACT"
echo -e "\033[102;30mCleaning all 'dist'...\e[0m"
rm -rf "$DIR_CC_REACT/dist"
echo -e "\033[102;30mCleaning all 'node_modules'...\e[0m"
rm -rf "$DIR_CC_REACT/node_modules"
echo -e "\033[102;30mRe-installing packages...\e[0m"
npm install
npx tsc
npm publish --access=public