#!/usr/bin/env sh

COMPRESSION_RATIO=80

size() {
  wc -c <"$1"
}

find "$1" -type f -not -name '*.webp' -not -name '*.gz' |
  while read -r filename; do
    gzip -k -9 "$filename"

    source_size=$(size "$filename")
    gzipped_size=$(size "$filename".gz)
    test_size=$(( source_size * COMPRESSION_RATIO / 100 ))

    if [ $gzipped_size -ge $test_size ]; then
      rm -f "$filename".gz
    fi
  done
