import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import { Blocks as MobileBlocks } from '@redneckz/wildless-cms-uni-blocks/mobile/lib/components/Blocks';
import fs from 'fs';
import { applyTmpl } from './applyTmpl.js';
import { extractMobileType, extractType, getBlockTypes } from './getBlockTypes.js';

const pageTmpl = fs.readFileSync(new URL('./page.tmpl.tsx', import.meta.url), 'utf-8');

export const generatePage =
  (isMobile = false) =>
  (page, pagePath) => {
    const blockTypes = getBlockTypes({
      blocksRegistry: isMobile ? MobileBlocks : Blocks,
      typeExtractor: isMobile ? extractMobileType : extractType,
    })(page);

    const blockImports = blockTypes.map(
      (_) => `import { ${_} } from '@redneckz/wildless-cms-uni-blocks/lib/components/${_}/${_}';\n`,
    );

    return applyTmpl(
      pageTmpl,
      {
        imports: blockImports.join(''),
        blocks: [...new Set(blockTypes)].join(', '),
        pagePath,
      },
      isMobile,
    );
  };
