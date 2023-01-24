import path from 'path';
import { CONTENT_DIR } from '../dirs.js';
import PorterStemmerRu from './stemmer.cjs';
import { unique } from './unique.js';

export async function getSearchIndex(pagesPathsList, readPage) {
  const pages = await Promise.all(pagesPathsList.map(readPage));

  const tokens = pages.map((_) => unique(extractTokens(_)));
  const allTokens = unique(tokens.flatMap((_) => _));
  const dictionary = allTokens
    .map((term) => ({
      [term]: tokens.flatMap((pageTokens, pageIndex) =>
        pageTokens.includes(term) ? [pageIndex] : [],
      ),
    }))
    .reduce((a, b) => Object.assign(a, b), {});

  return {
    corpus: pages.map(({ title, slug }, pageIndex) => ({
      uri: getPageURI(pagesPathsList[pageIndex], slug),
      title,
    })),
    dictionary,
  };
}

function getPageURI(pagePath, slug) {
  return path.join(path.dirname(path.relative(CONTENT_DIR, pagePath)), slug);
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
