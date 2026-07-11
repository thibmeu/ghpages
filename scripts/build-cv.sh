#!/bin/sh
# Render content/cv.md to static/cv.pdf. Requires hugo and chrome.
set -e
cd "$(dirname "$0")/.."
hugo --quiet
google-chrome --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=static/cv.pdf "file://$PWD/public/cv/index.html"
echo "static/cv.pdf written"
