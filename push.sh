#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "auto update"
git push

