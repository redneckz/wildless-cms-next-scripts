import { computeAPIFallback } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/computeAPIFallback';
import { ContentPage } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/ContentPage';
import type { ContentPageContext } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/ContentPageContext';
import { normalizePage } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/normalizePage';
import { renderContentPageHead } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/renderContentPageHead';
import { ContentPageRepository } from '@redneckz/wildless-cms-uni-blocks/lib/content-page-repository';
import type { ContentPageDef } from '@redneckz/wildless-cms-uni-blocks/lib/model/ContentPageDef';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
/* imports */

const blocksRegistry = {
  /* blocks */
};

const contentPageContext: ContentPageContext = {
  useRouter() {
    const { asPath: pathname, ...rest } = useRouter();

    return { ...rest, pathname, href: globalThis.location?.href };
  },
};

const GenericPage: NextPage<{ data: ContentPageDef }> = ({ data }) => (
  <>
    <Head>{renderContentPageHead(data)}</Head>
    <ContentPage data={data} context={contentPageContext} blocksRegistry={blocksRegistry} />
  </>
);

export default GenericPage;

export const getStaticProps: GetStaticProps = async () => {
  const data = normalizePage(blocksRegistry)(
    await ContentPageRepository.inst.readPage('/* pagePath */'),
  );
  const props = {
    data: { ...data, fallback: (await computeAPIFallback(blocksRegistry)) || {} },
  };

  return { props };
};
