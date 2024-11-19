import { ContentPage } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/ContentPage';
import { renderContentPageHead } from '@redneckz/wildless-cms-uni-blocks/lib/components/ContentPage/renderContentPageHead';
import { useRouter } from '@redneckz/wildless-cms-uni-blocks/lib/external/useRouter';
import type { ContentPageDef } from '@redneckz/wildless-cms-uni-blocks/lib/model/ContentPageDef';
import {
  contentPageRepository,
  getContentPageData,
} from '@rshbintech.ctp.rshb-ru/wcms-next-portal';
import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter as nextUseRouter, usePathname } from 'next/navigation';
/* imports */

const blocksRegistry = {
  /* blocks */
};

useRouter.setup(() => ({
  ...nextUseRouter(),
  pathname: usePathname(),
}));

const GenericPage: NextPage<{ data: ContentPageDef }> = ({ data }) => (
  <>
    <Head>{renderContentPageHead(data)}</Head>
    <ContentPage data={data} blocksRegistry={blocksRegistry} />
  </>
);

export default GenericPage;

export const getStaticProps: GetStaticProps = async () => ({
  props: {
    data: await getContentPageData(
      contentPageRepository.toSlug('/* pagePath */'),
      /* normalizer */
    ),
  },
});
