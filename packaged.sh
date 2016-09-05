#!/bin/sh

mkdir app

echo "Copying images..."
cp src/icon.png app
cp src/flattr.png app
cp src/opensubtitle.gif app
cp src/controls.svg app

echo "Copying root JS files..."
cp src/background.js app

echo "Compressing CSS..."
curl --silent --data-urlencode input="$(cat src/*.css)" -o app/style.min.css 'https://cssminifier.com/raw'

echo "Copying HTML..."
cp src/build/index.html app
cp src/build/wiki.html app

echo "Copying manifest..."
cp src/manifest.json app

cd src/

for file in js/*.js
do
    echo "Compressing $file..."
    curl --silent --data-urlencode js_code="$(cat $file)" --data output_info=compiled_code --create-dirs -o ../app/$file 'https://closure-compiler.appspot.com/compile'
done

echo "Compressing features..."
curl --silent --data-urlencode js_code="$(cat js/features/*.js)" --data output_info=compiled_code --create-dirs -o ../app/js/features.js 'https://closure-compiler.appspot.com/compile'

cd ../

sleep 2

echo "Copying lib/..."
cp -r src/lib/ app/lib

echo "Zippin' everything..."
rm app.zip
zip --quiet -r app.zip app

echo "Cleaning up..."
rm -rf app

echo 'All done!'