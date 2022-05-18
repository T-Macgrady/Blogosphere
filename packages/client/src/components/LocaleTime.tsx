import dateFormat from 'date-fns/format';
import distanceInWords from 'date-fns/formatDistance';
import zh from 'date-fns/locale/zh-CN';
import React, { useEffect, useRef, useState } from 'react';

let callbacks = [];

setInterval(() => {
  callbacks.forEach((cb) => cb());
}, 1000 * 60);

function eachMinute(fn) {
  callbacks.push(fn);

  return () => {
    callbacks = callbacks.filter((cb) => cb !== fn);
  };
}

type Props = {
  date: string | number | Date;
  format?: string;
  timeago?: boolean;
};

const getTimeago = (date) => {
  let content = distanceInWords(new Date(date), new Date(), {
    addSuffix: true,
    locale: zh,
  });

  content = content.replace('about', '').replace('less than a minute ago', 'just now').replace('minute', 'min');

  return content;
};

export const LocaleTime: React.FC<Props> = ({ date, timeago, format = 'yyyy-MM-dd HH:mm:ss' }) => {
  const [_, setMinutesMounted] = useState(0); // eslint-disable-line no-unused-vars
  const callback = useRef<() => void>();

  useEffect(() => {
    callback.current = eachMinute(() => {
      setMinutesMounted((state) => ++state);
    });

    return () => {
      if (callback.current) {
        callback.current();
      }
    };
  }, []);

  const formated = dateFormat(new Date(date), format);

  return <time dateTime={formated}>{timeago ? getTimeago(date) : formated}</time>;
};
