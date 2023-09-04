import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import { Blocks as MobileBlocks } from '@redneckz/wildless-cms-uni-blocks/mobile/lib/components/Blocks';
import dotenv from 'dotenv';
import fs from 'fs';
import { unique } from './unique.js';
import { applyTmpl } from './applyTmpl.js';
import { extractMobileType, extractType, getBlockTypes } from './getBlockTypes.js';

dotenv.config();

const pageTmpl = fs.readFileSync(new URL('./page.tmpl.tsx', import.meta.url), 'utf-8');

export const generateSinglePageComponent =
  (isMobile = false) =>
  (page, pagePath) => {
    const blocksRegistry = isMobile ? MobileBlocks : Blocks;
    const blockTypes = unique(
      getBlockTypes(page, isMobile ? extractMobileType : extractType).filter(
        (_) => _ in blocksRegistry,
      ),
    );

    const blockImports = blockTypes.map(
      (_) => `import { ${_} } from '@redneckz/wildless-cms-uni-blocks/lib/components/${_}/${_}';`,
    );

    return applyTmpl(
      pageTmpl,
      { imports: blockImports.join('\n'), blocks: unique(blockTypes).join(', '), pagePath },
      isMobile,
    );
  };
