import React, { useCallback } from 'react';
import style from './index.module.scss';

interface IToc {
  level: number;
  text: string;
}

export const Toc: React.FC<{ tocs: Array<IToc> }> = ({ tocs = [] }) => {
  const goto = useCallback((toc) => {
    const el = document.getElementById(toc.text.split(' ').join('-'));
    if (el) {
      el.scrollIntoView();
    }
  }, []);

  return (
    <div>
      {tocs.map((toc) => {
        return (
          <div
            className={style.item}
            style={{ paddingLeft: 12 * (toc.level - 1), cursor: 'pointer' }}
            onClick={() => goto(toc)}
          >
            {toc.text}
          </div>
        );
      })}
    </div>
  );
};
