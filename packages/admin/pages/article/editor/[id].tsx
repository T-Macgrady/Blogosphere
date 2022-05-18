import { NextPage } from 'next';
import React from 'react';

import { ArticleEditor } from '@/components/ArticleEditor';
import { ArticleProvider } from '@/providers/article';

interface IProps {
  id: string | number;
  article: IArticle;
}

const Editor: NextPage<IProps> = ({ id, article }) => {
  return <ArticleEditor id={id} article={article} />;
};

Editor.getInitialProps = async (ctx) => {
  const { id } = ctx.query;
  const article = await ArticleProvider.getArticle(id);
  return { id, article } as { id: string | number; article: IArticle };
};

export default Editor;
