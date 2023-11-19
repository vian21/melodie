#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the output directory
cd out

# place .nojekyll to bypass Jekyll processing
echo > .nojekyll

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git checkout -b main
git add -A
git commit -m 'deploy'

git push -f git@github.com:vian21/melodie.git main:gh-pages

cd -
rm -rf out