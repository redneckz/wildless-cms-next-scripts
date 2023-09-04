import { Blocks } from '@redneckz/wildless-cms-uni-blocks/lib/components/Blocks';
import { Blocks as MobileBlocks } from '@redneckz/wildless-cms-uni-blocks/mobile/lib/components/Blocks';
import dotenv from 'dotenv';
import fs from 'fs';
import { applyTmpl } from './applyTmpl.js';
import { unique } from './unique.js';

dotenv.config();

const CUSTOM_BLOCKS_DIR = 'src/custom/blocks';

const pagesTmpl = fs.readFileSync(new URL('./[...slug].tmpl.tsx', import.meta.url), 'utf-8');

const customBlockTypes = (process.env.CUSTOM_BLOCKS_REGISTRY || '').split(/\s*,\s*/);

export const generatePagesComponent = (isMobile = false) => {
  const customBlockImports = customBlockTypes.map(
    (_) => `import { ${_} } from '${CUSTOM_BLOCKS_DIR}/${_}/${_}';`,
  );

  const blockTypes = Object.keys(isMobile ? MobileBlocks : Blocks).filter(
    (_) => !customBlockTypes.includes(_),
  );
  const blockImports = blockTypes.map(
    (_) =>
      `const ${_} = dynamic(async () => (await import('@redneckz/wildless-cms-uni-blocks/lib/components/${_}/${_}')).${_});`,
  );

  return applyTmpl(
    pagesTmpl,
    {
      imports: ["import dynamic from 'next/dynamic';", ...customBlockImports, ...blockImports].join(
        '\n',
      ),
      blocks: unique([...customBlockTypes, ...blockTypes]).join(', '),
    },
    isMobile,
  );
};
