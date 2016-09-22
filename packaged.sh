#!/bin/sh

which gjslint > /dev/null;

if [ $? -ne 0 ]; then
    printf "Can't find Google Closure Linter.\nUse 'sudo apt-get install closure-linter' to install it.\n";
    exit;
fi

echo 'Linting files.....'

# Disabled lints:
#               0001 - Extra space at end of line
#               0002 - Space before '(' in for and if
#               0110 - Line to long
#               0200 - Invalid JSDoc tag.
#               0213 - Missing type in @param tag
gjslint --disable 0001,0002,0110,0200,0213 --nojsdoc --recurse src/js -- src/background.js;

if [ $? -ne 0 ]; then
    printf 'Please fix lint errors!!!\n';
    exit;
fi

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
cp src/wiki.html app

echo "Copying manifest..."
cp src/manifest.json app

cd src/

for file in js/*.js; do
    echo "Compressing $file..."
    java -jar '../closure/compiler.jar' --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --compilation_level SIMPLE --js_output_file ../app/$file --js $file
    if [ $? -ne 0 ]; then
        printf "Failed to compress $file...";
        exit;
    fi
done

echo "Compressing features..."
java -jar '../closure/compiler.jar' --language_in ECMASCRIPT5 --language_out ECMASCRIPT5 --compilation_level SIMPLE --js js/features/*.js --js_output_file ../app/js/features.js
if [ $? -ne 0 ]; then
    printf "Failed to compress features...";
    exit;
fi

cd ../

echo "Copying lib/..."
cp -r src/lib/ app/lib

echo "Zippin' everything..."
rm app.zip
zip --quiet -r app.zip app

echo "Cleaning up..."
rm -rf app

echo 'All done!'