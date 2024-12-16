import { getBasePath } from '@redneckz/wildless-cms-uni-blocks/lib/utils/getBasePath';
import path from 'path';
import PorterStemmerRu from './stemmer.cjs';
import { unique } from './unique.js';

export async function getSearchIndex(pages) {
  const tokens = pages.map(([, _]) => unique(extractTokens(_)));
  const allTokens = unique(tokens.flatMap((_) => _));
  const dictionary = allTokens
    .map((term) => ({
      [term]: tokens.flatMap((pageTokens, pageIndex) =>
        pageTokens.includes(term) ? [pageIndex] : [],
      ),
    }))
    .reduce((a, b) => Object.assign(a, b), {});

  return {
    corpus: pages.map(([uri, { title, slug }]) => ({
      uri: getPageURI(uri, slug),
      title,
    })),
    dictionary,
  };
}

function getPageURI(uri) {
  const basePath = getBasePath(process.env.NEXT_PUBLIC_SITE_URL);

  return path.join(basePath, uri);
}

function extractTokens(data) {
  if (!data || ['number', 'boolean'].includes(typeof data)) {
    return [];
  }

  if (typeof data === 'string') {
    return PorterStemmerRu.tokenizeAndStem(data)
      .filter((_) => _.length >= 3)
      .filter((_) => !/[a-z0-9]/.test(_));
  } else if (Array.isArray(data)) {
    return data.flatMap(extractTokens);
  } else if (typeof data === 'object') {
    return Object.values(data).flatMap(extractTokens);
  }
  return [];
}
