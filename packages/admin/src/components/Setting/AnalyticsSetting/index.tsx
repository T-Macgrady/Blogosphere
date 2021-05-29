import React, { useState, useEffect } from 'react';
import { Form } from '@ant-design/compatible';
import { Input, Button, message } from 'antd';
import { SettingProvider } from '@/providers/setting';

export const AnalyticsSetting = ({ setting }) => {
  const [baiduAnalyticsId, setBaiduAnalyticsId] = useState(null);
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(null);

  useEffect(() => {
    setBaiduAnalyticsId((setting && setting.baiduAnalyticsId) || null);
    setGoogleAnalyticsId((setting && setting.googleAnalyticsId) || null);
  }, [setting]);

  const save = () => {
    const data = {
      baiduAnalyticsId,
      googleAnalyticsId,
    };
    SettingProvider.updateSetting(data).then((res) => {
      message.success('保存成功');
    });
  };

  return (
    <div>
      <Form.Item labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left" label="百度统计">
        <Input
          placeholder="请输入百度统计 Id"
          value={baiduAnalyticsId}
          onChange={(e) => {
            setBaiduAnalyticsId(e.target.value);
          }}
        />
      </Form.Item>
      <Form.Item labelCol={{ xs: 8, sm: 6, md: 4 }} labelAlign="left" label="谷歌分析">
        <Input
          placeholder="请输入谷歌分析 Id"
          value={googleAnalyticsId}
          onChange={(e) => {
            setGoogleAnalyticsId(e.target.value);
          }}
        />
      </Form.Item>
      <Button type="primary" onClick={save}>
        保存
      </Button>
    </div>
  );
};
