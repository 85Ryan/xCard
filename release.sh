#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting xCard Release Build..."

# 1. Clean previous builds
echo "🧹 Cleaning up..."
rm -rf dist
rm -rf release
mkdir release

# 2. Build the extension
echo "🛠️  Building extension..."
pnpm build

# 3. Get version from manifest.json
VERSION=$(grep '"version":' manifest.json | cut -d '"' -f 4)
echo "📦 Detected version: v$VERSION"

# 4. Create ZIP for GitHub Release
ZIP_NAME="xCard-v$VERSION.zip"
echo "🗜️  Zipping to release/$ZIP_NAME..."

# Zip content of dist/ into the root of the archive
cd dist
zip -r "../release/$ZIP_NAME" ./*
cd ..

echo "✅ Build success!"
echo "✨ Release package ready: release/$ZIP_NAME"
