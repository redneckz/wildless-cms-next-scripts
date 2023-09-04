#!/usr/bin/env node

import { createGzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import fs from 'fs';

const [, , ...files] = process.argv;

const COMPRESSION_RATIO = 0.9;

const pipe = promisify(pipeline);
const stat = promisify(fs.stat);
const unlink = promisify(fs.unlink);
const gzip = (input, output) =>
  pipe(fs.createReadStream(input), createGzip(), fs.createWriteStream(output));

await Promise.all(
  files.map(async (input) => {
    const output = `${input}.gz`;

    await gzip(input, output);

    const [{ size }, { size: gzippedSize }] = await Promise.all(
      [input, output].map((_) => stat(_)),
    );

    if (gzippedSize >= size * COMPRESSION_RATIO) {
      await unlink(output);
    } else {
      console.log('gzip.js', input, `${Math.floor((1.0 - gzippedSize / size) * 100)}%`);
    }
  }),
);
