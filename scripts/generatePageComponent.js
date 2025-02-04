import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import dotenv from 'dotenv';
import fs from 'fs';
import { applyTmpl } from './utils/applyTmpl.js';
import { CUSTOM_BLOCKS_DIR } from './utils/env.js';
import { extractType, getBlockTypes } from './utils/getBlockTypes.js';
import { unique } from './utils/unique.js';

dotenv.config({ path: ['.env.local', '.env'] });

const pageTmpl = fs.readFileSync(new URL('./page.tmpl.tsx', import.meta.url), 'utf-8');

const allCustomBlockTypes = (process.env.CUSTOM_BLOCKS_REGISTRY || '').split(/\s*,\s*/);

const normalizer = 'normalizePageData';

export const generatePageComponent =
  (isMobile = false) =>
  (page, pagePath) => {
    const customBlockTypes = unique(
      getBlockTypes(page).filter((_) => allCustomBlockTypes.includes(_)),
    );

    const customBlockImports = customBlockTypes.map(
      (_) => `import { ${_} } from '${CUSTOM_BLOCKS_DIR}/${_}/${_}';\n`,
    );

    const blockTypes = unique(
      getBlockTypes(page, extractType)
        .filter((_) => _ in Blocks)
        .filter((_) => !customBlockTypes.includes(_)),
    );

    const blockImports = blockTypes.map(
      (_) => `import { ${_} } from '@redneckz/wildless-cms-uni-blocks/lib/components/${_}/${_}';\n`,
    );

    const normalizeImport = `import { ${normalizer} } from '@redneckz/wildless-cms-content';\n`;

    return applyTmpl(
      pageTmpl,
      {
        imports: [normalizeImport, ...blockImports, ...customBlockImports].join(''),
        blocks: unique([...blockTypes, ...customBlockTypes]).join(', '),
        pagePath,
        normalizer,
      },
      isMobile,
    );
  };
