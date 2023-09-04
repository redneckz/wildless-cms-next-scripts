#!/usr/bin/env sh

START=$(date +%s)

find "$1" -type f -not -name '*.gz' -print0 | xargs -r0 gzip.js

END=$(date +%s)

echo gz: "$(( END - START ))"s
