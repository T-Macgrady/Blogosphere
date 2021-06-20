import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { Row, Col, Card, List, Alert, Typography } from 'antd';
import { useSetting } from '@/hooks/useSetting';
import { useUser } from '@/hooks/useUser';
import { AdminLayout } from '@/layout/AdminLayout';
import { ArticleProvider } from '@/providers/article';
import { CommentProvider } from '@/providers/comment';
import { CommentArticle } from '@/components/comment/CommentArticle';
import { CommentStatus } from '@/components/comment/CommentStatus';
import { CommentAction } from '@/components/comment/CommentAction';
import { CommentContent } from '@/components/comment/CommentContent';
import style from './index.module.scss';

const { Title, Paragraph } = Typography;

interface IHomeProps {
  articles: IArticle[];
  comments: IComment[];
}

const actions = [
  {
    name: '文章管理',
    url: '/article',
  },
  {
    name: '评论管理',
    url: '/comment',
  },
  {
    name: '文件管理',
    url: '/file',
  },
  {
    name: '用户管理',
    url: '/user',
  },
  {
    name: '访问管理',
    url: '/view',
  },
  {
    name: '系统设置',
    url: '/setting',
  },
];
const pageSize = 6;

const Home: NextPage<IHomeProps> = ({ articles = [], comments: defaultComments = [] }) => {
  const setting = useSetting();
  const user = useUser();
  const [comments, setComments] = useState<IComment[]>(defaultComments);

  const getComments = useCallback(() => {
    return CommentProvider.getComments({ page: 1, pageSize }).then((res) => {
      setComments(res[0]);
      return res;
    });
  }, []);

  return (
    <AdminLayout
      headerAppender={
        <Typography>
          <Title>您好，{user.name}</Title>
          <Paragraph>您的角色：{user.role === 'admin' ? '管理员' : '访客'}</Paragraph>
        </Typography>
      }
    >
      {!setting || !setting.systemUrl ? (
        <div style={{ marginBottom: 24 }}>
          <Alert
            message={
              <span>
                系统检测到<strong>系统配置</strong>未完善，
                <Link href="/setting?type=系统设置">
                  <a>点我立即完善</a>
                </Link>
              </span>
            }
            type="warning"
          />
        </div>
      ) : null}
      <Card title="快速导航" bordered={false} bodyStyle={{ padding: 0 }}>
        <Row>
          {actions.map((action) => {
            return (
              <Col
                key={action.url}
                span={4}
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                }}
              >
                <Link href={action.url}>
                  <a className={style.recentArticleItem}>
                    <span>{action.name}</span>
                  </a>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Card>
      <Card
        title="最新文章"
        bordered={false}
        style={{ marginTop: 24 }}
        bodyStyle={{ padding: 0 }}
        extra={
          <Link href="/article">
            <a>
              <span>全部文章</span>
            </a>
          </Link>
        }
      >
        {articles.map((article) => {
          return (
            <Card.Grid
              key={article.id}
              style={{
                width: '33.3%',
                textAlign: 'center',
              }}
              hoverable={true}
            >
              <Link href={`/article/editor/[id]`} as={`/article/editor/` + article.id}>
                <a className={style.recentArticleItem}>
                  <img width={120} alt="文章封面" src={article.cover} />
                  <p className={style.title}>{article.title}</p>
                </a>
              </Link>
            </Card.Grid>
          );
        })}
      </Card>
      <Card
        title="最新评论"
        style={{ marginTop: 24 }}
        bordered={false}
        extra={
          <Link href="/comment">
            <a>
              <span>全部评论</span>
            </a>
          </Link>
        }
      >
        <List
          dataSource={comments}
          renderItem={(comment) => (
            <List.Item
              key={comment.id}
              actions={[<CommentAction key="action" comment={comment} refresh={getComments} />]}
            >
              <span>{comment.name}</span> 在 <CommentArticle comment={comment} /> 评论{' '}
              <CommentContent comment={comment} />
              <CommentStatus comment={comment} />
            </List.Item>
          )}
        />
      </Card>
    </AdminLayout>
  );
};

Home.getInitialProps = async () => {
  const [articles, comments] = await Promise.all([
    ArticleProvider.getArticles({ page: 1, pageSize }),
    CommentProvider.getComments({ page: 1, pageSize }),
  ]);

  return {
    articles: articles[0],
    comments: comments[0],
  };
};

export default Home;
