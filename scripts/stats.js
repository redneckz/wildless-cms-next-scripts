import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import { Blocks as MobileBlocks } from '@redneckz/wildless-cms-uni-blocks/mobile/lib/components/Blocks';
import fs from 'fs';
import { promisify } from 'util';
import { CONTENT_DIR, PUBLIC_DIR } from './dirs.js';
import { isFilled } from './utils/isFilled.js';
import { listBlocks } from './utils/listBlocks.js';
import { unique } from './utils/unique.js';

const writeFile = promisify(fs.writeFile);

const BLOCK_STATS_FILENAME = 'block.stats.csv';

const MAJOR_FEATURES = [
  ['version', (_) => isFilled(_?.version)],
  ['version.gray', (_) => _.version === 'gray'],
  ['version.transparent', (_) => _.version === 'transparent'],
  ['isTheme', (_) => isFilled(_?.isTheme)],
  ['anchor', (_) => isFilled(_?.anchor)],
  ['content.title', (_) => isFilled(_?.content?.title)],
  ['content.description', (_) => isFilled(_?.content?.description)],
  ['content.subtitle', (_) => isFilled(_?.content?.subtitle)],
  ['content.label', (_) => isFilled(_?.content?.label)],
  ['content.icon', (_) => isFilled(_?.content?.icon)],
  ['content.icon.src', (_) => isFilled(_?.content?.icon?.src)],
  ['content.icon.icon', (_) => isFilled(_?.content?.icon?.icon)],
  [
    'content.icon.abnormal',
    (_) => ['color', 'white', 'black'].includes(_?.content?.icon?.iconVersion),
  ],
  ['content.image', (_) => isFilled(_?.content?.image)],
  ['content.image.src', (_) => isFilled(_?.content?.image?.src)],
  ['content.image.icon', (_) => isFilled(_?.content?.image?.icon)],
  [
    'content.image.abnormal',
    (_) => ['color', 'white', 'black'].includes(_?.content?.image?.iconVersion),
  ],
  ['content.button', (_) => isFilled(_?.content?.button)],
  ['content.buttons', (_) => isFilled(_?.content?.buttons)],
  ['content.directionRight', (_) => Boolean(_?.content?.directionRight)],
  ['content.isSticky', (_) => Boolean(_?.content?.isSticky)],
  ['content.showCounter', (_) => Boolean(_?.content?.showCounter)],
  ['content.tabs.group', (_) => _?.content?.tabs?.some((tab) => tab?.type === 'group')],
  [
    'content.hiddenRowsNum',
    (_) => _?.content?.hiddenRowsNum > 0 || _?.content?.visibleRowLength > 0,
  ],
  ['content.breadcrumbs', (_) => isFilled(_?.content?.breadcrumbs)],
  ['content.listItemSize.XS', (_) => _?.content?.listItemSize === 'XS'],
  ['content.listItemSize.S', (_) => _?.content?.listItemSize === 'S'],
  ['content.listItemSize.M', (_) => _?.content?.listItemSize === 'M'],
  ['content.listItemSize.L', (_) => _?.content?.listItemSize === 'L'],
];

const BLOCK_STATS_TABLE_HEAD = ['page', 'block', 'count', ...MAJOR_FEATURES.map(([name]) => name)];

const AllBlockTypes = unique(Object.keys(Blocks).concat(Object.keys(MobileBlocks)));

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

  const blockStatsTable = pages.flatMap(pageBlocksStats);

  await writeFile(
    `${PUBLIC_DIR}/${BLOCK_STATS_FILENAME}`,
    toCSV(blockStatsTable, { head: BLOCK_STATS_TABLE_HEAD }),
    'utf-8',
  );
}

function pageBlocksStats(page) {
  const pageBlocks = listBlocks(page);

  return AllBlockTypes.map((type) => [
    page?.slug,
    type,
    ...blocksStats(pageBlocks.filter((_) => _.type === type)),
  ]);
}

function blocksStats(blocks) {
  return [blocks.length, ...MAJOR_FEATURES.map(([, predicate]) => blocks.filter(predicate).length)];
}

const toCSV = (table, { head }) =>
  [head]
    .concat(table)
    .map((row) => row.join(','))
    .join('\n');
