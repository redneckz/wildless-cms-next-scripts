import { ContentPage } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/ContentPage';
import { computeAPIFallback } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/computeAPIFallback';
import { normalizePage } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/normalizePage';
import { renderContentPageHead } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/renderContentPageHead';
import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import { useRouter } from '@redneckz/wildless-cms-uni-blocks/lib/external/useRouter';
import type { ContentPageDef } from '@redneckz/wildless-cms-uni-blocks/lib/model/ContentPageDef';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter as nextUseRouter } from 'next/router';
/* imports */

const blocksRegistry = {
  /* blocks */
};

useRouter.setup(() => {
  const router = nextUseRouter();

  return { ...router, href: globalThis.location?.href };
});

const GenericPage: NextPage<{ data: ContentPageDef }> = ({ data }) => (
  <>
    <Head>{renderContentPageHead(data)}</Head>
    <ContentPage data={data} blocksRegistry={blocksRegistry} />
  </>
);

export default GenericPage;

export const getStaticProps: GetStaticProps = async () => {
  const data = normalizePage(blocksRegistry)(
    await ContentPageRepository.inst.readPage('/* pagePath */'),
  );
  const props = {
    data: { ...data, fallback: (await computeAPIFallback(blocksRegistry, data)) || {} },
  };

  return { props };
};
