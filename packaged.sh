#!/bin/sh

rm -rf app
mkdir app
cp src/*.png app
cp src/*.js app
cp src/*.svg app
cp src/*.html app
cp src/*.json app
cp src/*.gif app
cp src/*.css app

mkdir app/js
cp src/js/*.js app/js

mkdir app/js/features
cp src/js/features/*.js app/js/features

mkdir app/lib

cp src/lib/*.js app/lib

mkdir -p app/lib/zipjs/WebContent
cp src/lib/zipjs/WebContent/*.js app/lib/zipjs/WebContent/

rm -rf app.zip

zip -r app.zip app
