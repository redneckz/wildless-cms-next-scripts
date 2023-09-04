import { ContentPage } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/ContentPage';
import { computeAPIFallback } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/computeAPIFallback';
import { normalizePage } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/normalizePage';
import { renderContentPageHead } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/renderContentPageHead';
import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import { useRouter } from '@redneckz/wildless-cms-uni-blocks/lib/hooks/useRouter';
import type { BlocksRegistry } from '@redneckz/wildless-cms-uni-blocks/lib/model/BlocksRegistry';
import type { ContentPageDef } from '@redneckz/wildless-cms-uni-blocks/lib/model/ContentPageDef';
import fs from 'fs';
import glob from 'glob';
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter as nextUseRouter } from 'next/router';
import path from 'path';
import { promisify } from 'util';
/* imports */

const findFiles = promisify(glob);

const blocksRegistry = {
  /* blocks */
} as BlocksRegistry;

useRouter.setup(() => {
  const router = nextUseRouter();

  return { ...router, href: globalThis.location?.href };
});

const PAGE_EXT = '.page.json';

const GenericPage: NextPage<{ data: ContentPageDef }> = ({ data }) => {
  return (
    <>
      <Head>{renderContentPageHead(data)}</Head>
      <ContentPage data={data} blocksRegistry={blocksRegistry} />
    </>
  );
};

export default GenericPage;

export const getStaticPaths: GetStaticPaths<{ slug: string[] }> = async () => {
  const contentFiles = await findFiles(`*${PAGE_EXT}`, { cwd: 'content', matchBase: true });

  return {
    paths: contentFiles
      .map((_) => _.slice(0, -PAGE_EXT.length))
      .filter((_) => _ != '404' && !fs.existsSync(`pages/${_}.tsx`))
      .map((_) => ({ params: { slug: _.split('/') } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ data: ContentPageDef }, { slug: string[] }> = async (
  context,
) => {
  const { slug = [] } = context.params || {};
  const data = normalizePage(blocksRegistry)(
    await ContentPageRepository.inst.readPage(`${path.join('content', ...slug)}${PAGE_EXT}`),
  );
  const props = {
    data: { ...data, fallback: (await computeAPIFallback(blocksRegistry, data)) || {} },
  };

  return { props };
};
