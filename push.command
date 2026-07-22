#!/bin/bash
cd "$(dirname "$0")"
git add .
git commit -m "auto update"
git push
echo ""
echo "تمام شد! این پنجره رو می‌تونی ببندی."
read -p "برای بستن، Enter بزن..."
