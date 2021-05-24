import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useAsyncLoading } from '@/hooks/useAsyncLoading';
import { SearchProvider } from '@/providers/search';
import { ListTrail } from '@/components/Animation/Trail';
import { Tags } from '@components/Tags';
import styles from './index.module.scss';

const { Search: AntdSearch } = Input;

interface IProps {
  visible: boolean;
  tags: ITag[];
  onClose: () => void;
}

export const Search: React.FC<IProps> = ({ visible = true, tags, onClose }) => {
  const ref = useRef(null);
  const [searchArticles, loading] = useAsyncLoading(SearchProvider.searchArticles);
  const [articles, setArticles] = useState<IArticle[]>([]);
  const close = useCallback(() => {
    document.body.style.overflow = '';
    setArticles([]);
    onClose();
  }, [onClose]);

  const getArticles = useCallback(
    (keyword) => {
      if (!keyword) {
        setArticles([]);
        return;
      }
      searchArticles(keyword).then((res) => {
        const ret = res.filter((r) => r.status === 'publish' && !r.needPassword);
        setArticles(ret);
      });
    },
    [searchArticles]
  );

  useEffect(() => {
    const listener = (e) => {
      if (e.which === 27 || e.keyCode === 27) {
        close();
      }
    };
    document.body.addEventListener('keydown', listener);

    return () => {
      document.body.removeEventListener('keydown', listener);
    };
  }, [close]);

  useEffect(() => {
    if (!visible || !ref.current) {
      return;
    }
    ref.current.focus();
    document.body.style.overflow = 'hidden';
  }, [visible]);

  if (!visible) return null;

  return (
    <div className={styles.wrapper}>
      <div className="container">
        <header>
          <span className={styles.title}>文章搜索</span>
          <span className={styles.btnWrapper}>
            <CloseOutlined onClick={close} />
            <span>esc</span>
          </span>
        </header>

        <section>
          <AntdSearch
            ref={ref}
            size="large"
            loading={loading}
            placeholder="输入关键字，搜索文章"
            onSearch={getArticles}
            style={{ width: '100%' }}
          />
          <div className={styles.tags}>
            <Tags tags={tags} needTitle={false} bgcolor={'var(--bg-body)'} />
          </div>
        </section>

        <section>
          <ul>
            <ListTrail
              length={articles.length}
              options={{
                opacity: loading ? 0 : 1,
                y: loading ? 20 : 0,
                height: loading ? 0 : 48,
                from: { opacity: 0, y: 20, height: 0 },
              }}
              renderItem={(index) => {
                const article = articles[index];
                return (
                  <Link
                    key={article.id}
                    href={`/article/[id]`}
                    as={`/article/${article.id}`}
                    scroll={false}
                  >
                    <a className={styles.item} onClick={close}>
                      {article.title}
                    </a>
                  </Link>
                );
              }}
            />
          </ul>
        </section>
      </div>
    </div>
  );
};
