interface IUser {
  name: string;
  avatar: string;
  email: string;
  token: string;
}

interface IFile {
  id: string;
  originalname: string;
  filename: string;
  type: string;
  size: number;
  url: string;
  createAt: string;
}

interface IArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  tags?: Itag[] | string[] | string;
  cover?: string;
  toc: string;
  views: number;
  category: any;
  status: string;
  password?: string; // 访问密码
  needPassword: boolean;
  isRecommended?: boolean;
  isCommentable?: boolean; // 是否可评论
  createAt: string;
  updateAt: string;
  publishAt: string;
}

interface ITag {
  id: string;
  label: string;
  value: string;
}

interface ICategory {
  id: string;
  label: string;
  value: string;
}

interface IPage {
  id: string;
  name: string;
  path: string;
  order: number;
  cover?: string;
  content: string;
  toc: string;
  status: string;
  views: number;
  createAt: string;
  publishAt: string;
}

interface IComment {
  id: string;
  name: string;
  email: string;
  content: string;
  html: string;
  pass: boolean;
  createAt: string;
  userAgent: string;
  article?: IArticle;
  parentCommentId: string;
  hostId: string;
  isHostInPage: boolean;
  replyUserName?: string;
  replyUserEmail?: string;
  children?: [IComment];
}

interface IView {
  id: string;
  ip: string;
  userAgent: string;
  url: string;
  browser: string;
  engine: string;
  os: string;
  device: string;
  count: number;
  createAt: string;
  updateAt: string;
}

interface IMail {
  id: string;
  from: string;
  to: string;
  subject: number;
  text: string;
  html: string;
  createAt: string;
}

interface ISearch {
  id: string;
  type: string;
  keyword: string;
  count: number;
  createAt: string;
}

interface ISetting {
  systemUrl?: string; // 系统地址
  systemTitle?: string; // 系统标题
  systemLogo?: string; // 系统 Logo
  systemFavicon?: string; // 系统 favicon
  systemFooterInfo?: string; // 系统页脚信息
  adminSystemUrl?: string; // 后台系统地址

  seoKeyword?: string; // SEO 关键词
  seoDesc?: string; //  SEO 描述

  baiduAnalyticsId?: string; // 百度统计 id
  googleAnalyticsId?: string; // 谷歌分析 id

  ossRegion?: string; // 阿里云 region
  ossAccessKeyId?: string; //  阿里云 accessKeyId
  ossAccessKeySecret?: string; //  阿里云  accessKeySecret
  ossHttps?: boolean; //  阿里云 oss 是否开启 https
  ossBucket?: string; //  阿里云 bucket

  smtpHost?: string; //   SMTP 地址
  smtpPort?: number; //  SMTP 端口
  smtpUser?: string; //  SMTP 用户
  smtpPass?: string; //  SMTP 授权码
  smtpFromUser?: string; // SMTP 发件人
}
