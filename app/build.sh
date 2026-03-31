#!/usr/bin/env bash

env=$1
if [[ -z $1 ]]; then
    env="beta"
fi

npm run build

mkdir -p ../public
cp -r build/* ../public/
