import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import { Blocks as MobileBlocks } from '@redneckz/wildless-cms-uni-blocks/mobile/lib/components/Blocks';
import dotenv from 'dotenv';
import fs from 'fs';
import { applyTmpl } from './applyTmpl.js';
import { CUSTOM_BLOCKS_DIR } from './dirs.js';
import { extractMobileType, extractType, getBlockTypes } from './getBlockTypes.js';

dotenv.config();

const pageTmpl = fs.readFileSync(new URL('./page.tmpl.tsx', import.meta.url), 'utf-8');

const customBlockNames = (process.env.CUSTOM_BLOCKS_REGISTRY || '').split(/\s*,\s*/);

export const generatePage =
  (isMobile = false) =>
  (page, pagePath) => {
    const customBlockTypes = getBlockTypes({
      blocksRegistry: {},
      customBlockNames,
      typeExtractor: extractType,
    })(page);

    const customBlockImports = customBlockTypes.map(
      (_) => `import { ${_} } from '../${CUSTOM_BLOCKS_DIR}/${_}/${_}';\n`,
    );

    const blockTypes = getBlockTypes({
      blocksRegistry: isMobile ? MobileBlocks : Blocks,
      typeExtractor: isMobile ? extractMobileType : extractType,
    })(page).filter((_) => !customBlockTypes.includes(_));

    const blockImports = blockTypes.map(
      (_) => `import { ${_} } from '@redneckz/wildless-cms-uni-blocks/lib/components/${_}/${_}';\n`,
    );

    return applyTmpl(
      pageTmpl,
      {
        imports: [...blockImports, ...customBlockImports].join(''),
        blocks: [...new Set([...blockTypes, ...customBlockTypes])].join(', '),
        pagePath,
      },
      isMobile,
    );
  };
