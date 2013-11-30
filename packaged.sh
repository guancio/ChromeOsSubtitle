B#!/bin/sh

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

mkdir app/lib

mkdir app/lib/Long.js
cp src/lib/Long.js/Long.min.js app/lib/Long.js

mkdir app/lib/json-xml-rpc
cp src/lib/json-xml-rpc/rpc.js app/lib/json-xml-rpc

mkdir -p app/lib/zip.js/WebContent
cp src/lib/zip.js/WebContent/*.js app/lib/zip.js/WebContent/

mkdir -p app/lib/analytics/
cp src/lib/analytics/*.js app/lib/analytics/

rm -rf app.zip

zip -r app.zip app
