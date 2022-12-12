#!/usr/bin/env sh

COMPRESSION_RATIO=80

find "$1" -type f -not -name '*.webp' -not -name '*.gz' |
  while read -r filename; do
    source_size=$(wc -c <"$filename")                 # Размер в байтах несжатого файла
    gzipped_size=$(gzip -c -k -9 "$filename" | wc -c) # Размер в байтах сжатого файла (тестовый прогон)

    test_size=$((source_size * COMPRESSION_RATIO / 100))

    if [ $gzipped_size -le $test_size ]; then
      gzip -k -9 "$filename"
    fi
  done
