import React, { useContext } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArticleProvider } from '@/providers/article';
import { GlobalContext } from '@/context/global';
import { DoubleColumnLayout } from '@/layout/DoubleColumnLayout';
import { ListTrail } from '@/components/Animation/Trail';
import { LocaleTime } from '@/components/LocaleTime';
import { ArticleRecommend } from '@/components/ArticleRecommend';
import { Categories } from '@components/Categories';
import { Footer } from '@components/Footer';
import indexStyle from '../index.module.scss';
import style from './index.module.scss';

interface IProps {
  articles: { [key: string]: { [key: string]: IArticle[] } };
}

const ArchiveItem = ({ month, articles = [] }) => {
  return (
    <div className={style.item}>
      <h3>{month}</h3>
      <ul>
        <ListTrail
          length={articles.length}
          options={{
            opacity: 1,
            height: 48,
            x: 0,
            from: { opacity: 0, height: 0, x: -20 },
          }}
          renderItem={(index) => {
            const article = articles[index];
            return (
              <Link href={`/article/[id]`} as={`/article/${article.id}`} scroll={false}>
                <a aria-label={article.title}>
                  <span className={style.meta}>
                    <LocaleTime date={article.publishAt} format={'MM-dd'} />
                  </span>
                  <span className={style.title}>{article.title}</span>
                </a>
              </Link>
            );
          }}
        />
      </ul>
    </div>
  );
};

const resolveArticlesCount = (articles) => {
  const years = Object.keys(articles);
  return years.reduce((a, year) => {
    const months = Object.keys(articles[year]);
    a += months.reduce((b, month) => (b += articles[year][month].length), 0);
    return a;
  }, 0);
};

const Archives: NextPage<IProps> = ({ articles }) => {
  const { categories, setting } = useContext(GlobalContext);
  const t = useTranslations();

  return (
    <DoubleColumnLayout
      leftNode={
        <div className={style.content}>
          <div className={style.summary}>
            <p>
              <span>{t('archives')}</span>
            </p>
            <p>
              {t('total')} <span>{resolveArticlesCount(articles)}</span> {t('piece')}
            </p>
          </div>
          {Object.keys(articles)
            .sort((a, b) => +b - +a)
            .map((year) => {
              return (
                <div className={style.list} key={year}>
                  <h2>{year}</h2>
                  {Object.keys(articles[year]).map((month) => {
                    return (
                      <ArchiveItem
                        key={year + '-' + month}
                        month={month}
                        articles={articles[year][month]}
                      />
                    );
                  })}
                </div>
              );
            })}
        </div>
      }
      rightNode={
        <div className="sticky">
          <ArticleRecommend mode="inline" />
          <Categories categories={categories} />
          <Footer className={indexStyle.footer} setting={setting} />
        </div>
      }
    />
  );
};

// 服务端预取数据
Archives.getInitialProps = async () => {
  const articles = await ArticleProvider.getArchives();
  return { articles, needLayoutFooter: false };
};

export default Archives;
