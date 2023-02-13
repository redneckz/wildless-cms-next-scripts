import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import { Blocks as MobileBlocks } from '@redneckz/wildless-cms-uni-blocks/mobile/lib/components/Blocks';
import fs from 'fs';
import { promisify } from 'util';
import { CONTENT_DIR, PUBLIC_DIR } from './dirs.js';
import { getBlockTypes } from './utils/getBlockTypes.js';
import { unique } from './utils/unique.js';

const writeFile = promisify(fs.writeFile);

const BLOCK_STATS_FILENAME = 'block.stats.csv';
const BLOCK_STATS_TABLE_HEAD = ['page', 'block', 'count'];

const AllBlocks = unique(Object.keys(Blocks).concat(Object.keys(MobileBlocks)));

const contentPageRepository = new ContentPageRepository({
  contentDir: CONTENT_DIR,
  publicDir: PUBLIC_DIR,
});

export default async function stats() {
  const pagePathsList = await contentPageRepository.listAllContentPages();
  const pages = (
    await Promise.allSettled(pagePathsList.map((_) => contentPageRepository.readPage(_)))
  )
    .filter(({ status }) => status === 'fulfilled')
    .map(({ value }) => value);

  const blockStatsTable = pages.flatMap(blockStats);

  await writeFile(
    `${PUBLIC_DIR}/${BLOCK_STATS_FILENAME}`,
    toCSV(blockStatsTable, { head: BLOCK_STATS_TABLE_HEAD }),
    'utf-8',
  );
}

function blockStats(page) {
  const pageBlockTypes = getBlockTypes(page);

  return AllBlocks.map((type) => [
    page?.slug,
    type,
    pageBlockTypes.filter((_) => _ === type).length,
  ]);
}

const toCSV = (table, { head }) =>
  [head]
    .concat(table)
    .map((row) => row.join(','))
    .join('\n');
