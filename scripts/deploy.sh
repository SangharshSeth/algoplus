#!/usr/bin/env bash
# Builds the app and publishes dist/ to the gh-pages branch of SangharshSeth/algoplus.
set -euo pipefail

cd "$(dirname "$0")/.."
npm run build
touch dist/.nojekyll

TOKEN=$(gh auth token -u SangharshSeth)
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git -c user.name="Sangharsh Seth" -c user.email="$(git -C .. config user.email)" commit -q -m "Deploy $(date -u +%Y-%m-%dT%H:%MZ)"
git -c "credential.helper=" -c "credential.helper=!f() { echo username=x-access-token; echo password=$TOKEN; }; f" \
  push -q -f https://github.com/SangharshSeth/algoplus.git gh-pages
rm -rf .git
echo "Deployed to https://sangharshseth.github.io/algoplus/"
