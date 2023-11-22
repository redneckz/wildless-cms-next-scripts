import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import { Blocks as MobileBlocks } from '@redneckz/wildless-cms-uni-blocks/mobile/lib/components/Blocks';
import fs from 'fs';
import { CUSTOM_BLOCKS_DIR } from './dirs.js';
import { unique } from './utils/unique.js';
import { applyTmpl } from './utils/applyTmpl.js';
import { extractMobileType, extractType, getBlockTypes } from './utils/getBlockTypes.js';

const pageTmpl = fs.readFileSync(new URL('./page.tmpl.tsx', import.meta.url), 'utf-8');

const allCustomBlockTypes = (process.env.CUSTOM_BLOCKS_REGISTRY || '').split(/\s*,\s*/);

export const generatePageComponent =
  (isMobile = false) =>
  (page, pagePath) => {
    const customBlockTypes = unique(
      getBlockTypes(page).filter((_) => allCustomBlockTypes.includes(_)),
    );

    const customBlockImports = customBlockTypes.map(
      (_) => `import { ${_} } from '${CUSTOM_BLOCKS_DIR}/${_}/${_}';\n`,
    );

    const blocksRegistry = isMobile ? MobileBlocks : Blocks;
    const blockTypes = unique(
      getBlockTypes(page, isMobile ? extractMobileType : extractType)
        .filter((_) => _ in blocksRegistry)
        .filter((_) => !customBlockTypes.includes(_)),
    );

    const blockImports = blockTypes.map(
      (_) => `import { ${_} } from '@redneckz/wildless-cms-uni-blocks/lib/components/${_}/${_}';\n`,
    );

    return applyTmpl(
      pageTmpl,
      {
        imports: [...blockImports, ...customBlockImports].join(''),
        blocks: unique([...blockTypes, ...customBlockTypes]).join(', '),
        pagePath,
      },
      isMobile,
    );
  };
