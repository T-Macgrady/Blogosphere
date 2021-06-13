import React, { useEffect, useState } from 'react';
import cls from 'classnames';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { Menu, Dropdown } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useToggle } from '@/hooks/useToggle';
import { Search } from '@/components/Search';
import { Theme } from '@/components/Theme';
import style from './index.module.scss';

const NAV_LINKS = [
  {
    path: '/',
    label: '文章',
  },
  {
    path: '/archives',
    label: '归档',
  },
  {
    path: '/knowledge',
    label: '知识小册',
  },
];

export const Header = ({ setting, categories, tags, pages }) => {
  const router = useRouter();
  const { asPath, pathname } = router;
  const [affix, setAffix] = useState(false);
  const [affixVisible, setAffixVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showSearch, toggleSearch] = useToggle(false);

  useEffect(() => {
    const close = () => {
      if (visible) {
        setVisible(false);
      }
    };

    Router.events.on('routeChangeStart', close);

    return () => {
      Router.events.off('routeChangeStart', close);
    };
  }, [visible]);

  useEffect(() => {
    let beforeY =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      window.scrollY ||
      document.body.scrollTop;

    const handler = () => {
      const y =
        document.documentElement.scrollTop ||
        window.pageYOffset ||
        window.scrollY ||
        document.body.scrollTop;
      setAffix(y > 240);
      setAffixVisible(beforeY > y);
      setTimeout(() => {
        beforeY = y;
      }, 0);
    };

    document.addEventListener('scroll', handler);

    return () => {
      document.removeEventListener('scroll', handler);
    };
  }, []);

  const navMenu = NAV_LINKS.map((nav) => (
    <li className={cls({ [style.active]: asPath === nav.path })}>
      <Link href={nav.path}>
        <a>
          <span>{nav.label}</span>
        </a>
      </Link>
    </li>
  ));

  const categoryMenu = (
    <Dropdown
      overlay={
        <Menu key="category" style={{ minWidth: 240 }} selectedKeys={[asPath.replace('/', '')]}>
          {categories.map((category) => (
            <Menu.Item key={category.value} onClick={() => router.push(`/` + category.value)}>
              <Link href="/[category]" as={`/` + category.value} shallow={false}>
                <a>
                  <span>{category.label}</span>
                </a>
              </Link>
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <li className={cls({ [style.active]: pathname === '/[category]' })}>
        <a>
          <span>分类</span>
        </a>
      </li>
    </Dropdown>
  );

  const pageMenu = pages.map((menu) => (
    <li
      key={menu.label}
      className={cls({
        [style.active]: asPath.replace('/page/', '') === menu.path,
      })}
      onClick={() => {
        if (visible) {
          setVisible(false);
        }
      }}
    >
      <Link href={'/page/[id]'} as={`/page/${menu.path}`} scroll={false}>
        <a>{menu.name}</a>
      </Link>
    </li>
  ));

  return (
    <header className={cls(style.header)}>
      <div
        className={cls(
          style.wrapper,
          affix ? style.isFixed : false,
          affixVisible ? style.visible : false
        )}
      >
        <div className={cls('container')}>
          <div className={style.logo}>
            {/^http/.test(setting.systemLogo) ? (
              <Link href="/" scroll={false}>
                <a>
                  <img src={setting.systemLogo} alt="" />
                </a>
              </Link>
            ) : (
              <Link href="/" scroll={false}>
                <a dangerouslySetInnerHTML={{ __html: setting.systemLogo }}></a>
              </Link>
            )}
          </div>

          <div
            className={cls(style.mobileTrigger, visible ? style.active : false)}
            onClick={() => setVisible(!visible)}
          >
            <div className={style.stick}></div>
            <div className={style.stick}></div>
            <div className={style.stick}></div>
          </div>

          <nav className={cls(visible ? style.active : false)}>
            <ul>
              {navMenu[0]}
              {/* {categoryMenu} */}
              {navMenu.slice(1)}
              {pageMenu}
              <li className={style.toolWrapper}>
                <SearchOutlined style={{ cursor: 'pointer' }} onClick={toggleSearch} />
              </li>
              <li className={style.toolWrapper}>
                <Theme />
              </li>
            </ul>
            <Search tags={tags} visible={showSearch} onClose={toggleSearch} />
          </nav>
        </div>
      </div>
    </header>
  );
};
