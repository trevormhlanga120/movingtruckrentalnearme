#!/usr/bin/env bash
set -euo pipefail

echo "Prepare release: run locally before pushing to GitHub"
echo "1) Ensure assets/icon.png, assets/splash.png, assets/favicon.png exist"
echo "2) Update app.json with correct bundle identifiers if needed"
echo "3) Commit changes and push to main branch. GitHub Actions will build and publish web to gh-pages and Docker images to GHCR"
