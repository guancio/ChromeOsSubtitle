#!/bin/sh

which gjlint > /dev/null;

if [ $? -ne 0 ]; then
    printf "Can't find Google Closure Linter.\nUse 'sudo apt-get install closure-linter' to install it.\n";
    exit;
fi

set -e

printf 'Linting files.....\n'

# Disabled lints:
#               0001 - Extra space at end of line
#               0002 - Space before '(' in for and if
#               0110 - Line to long
#               0200 - Invalid JSDoc tag.
#               0213 - Missing type in @param tag
gjslint --disable 0001,0002,0110,0200,0213 --nojsdoc --recurse src/js -- src/background.js;

mkdir -p app/js

printf "Copying images...\n"
cp src/icon.png app
cp src/flattr.png app
cp src/opensubtitle.gif app
cp src/controls.svg app

printf "Copying root JS files...\n"
cp src/background.js app

printf "Compressing CSS...\n"
java -jar 'yui.jar' src/*.css > app/style.min.css

printf "Copying HTML...\n"
cp src/build/index.html app
cp src/wiki.html app

printf "Copying manifest...\n"
cp src/manifest.json app

cd src/

for file in js/*.js; do
    printf "Compressing $file...\n"
    java -jar '../yui.jar' $file > ../app/$file
done

printf "Compressing features...\n"
cat js/features/*.js | java -jar '../yui.jar' --type js > ../app/js/features.js

cd ../

printf "Copying lib/...\n"
cp -r src/lib/ app/lib

printf "Zippin' everything...\n"
[ -f app.zip ] && rm app.zip
zip --quiet -r app.zip app

printf "Cleaning up...\n"
rm -rf app

printf 'All done!\n'