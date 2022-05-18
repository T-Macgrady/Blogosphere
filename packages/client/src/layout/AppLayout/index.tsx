import { Footer } from '@components/Footer';
import { Header } from '@components/Header';
import { BackTop } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';

import { Seo } from '@/components/Seo';
import { GlobalContext } from '@/context/global';
import { useToggle } from '@/hooks/useToggle';

import style from './index.module.scss';

interface Iprops {
  backgroundColor?: string;
  needFooter?: boolean;
  hasBg?: boolean;
}

export const AppLayout: React.FC<Iprops> = ({ children, needFooter = true, hasBg }) => {
  const { setting, pages, tags } = useContext(GlobalContext);
  const { systemBg } = setting;
  const [loaded, toggleLoaded] = useToggle(false);
  const bg = useMemo(
    () => `linear-gradient(to bottom, rgba(var(--rgb-bg-second), 0), rgba(var(--rgb-bg-second), 1)), url(${systemBg})`,
    [systemBg]
  );
  const customBg = hasBg || (!!systemBg && loaded);

  useEffect(() => {
    if (!systemBg) return;
    const img = document.createElement('img');
    img.onload = () => {
      toggleLoaded(true);
    };
    img.onerror = () => {
      toggleLoaded(false);
    };
    img.src = systemBg;
  }, [systemBg, toggleLoaded]);

  return (
    <div className={style.wrapper}>
      <Seo />
      <Header setting={setting} tags={tags} pages={pages} hasBg={customBg} />
      <main className={style.main} style={{ backgroundColor: customBg ? 'transparent' : 'var(--bg-body)' }}>
        {children}
      </main>
      {systemBg && !hasBg && <div className={style.bg} style={{ backgroundImage: bg }}></div>}
      <BackTop />
      {needFooter && <Footer setting={setting} hasBg={customBg} />}
    </div>
  );
};
