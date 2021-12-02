import { Tag } from 'antd';
import type { Settings as ProSettings } from '@ant-design/pro-layout';
import React from 'react';
import type { ConnectProps, Dispatch } from 'umi';
import { connect } from 'umi';
import type { ConnectState } from '@/models/connect';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { SearchByEmployeeItem } from '@/models/api/overview';

export type GlobalHeaderRightProps = {
  theme?: ProSettings['navTheme'] | 'realDark';
  dispatch: Dispatch;
  employeesForSearch: SearchByEmployeeItem[]
} & Partial<ConnectProps> &
  Partial<ProSettings>;

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight: React.FC<GlobalHeaderRightProps> = (props) => {
  const { theme, layout, employeesForSearch, dispatch } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'top') {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="Search Employee by name"
        defaultValue=""
        options={[
          { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
          {
            label: <a href="next.ant.design">Ant Design</a>,
            value: 'Ant Design',
          },
          {
            label: <a href="https://protable.ant.design/">Pro Table</a>,
            value: 'Pro Table',
          },
          {
            label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
            value: 'Pro Layout',
          },
        ]}
        onSearch={value => {
          dispatch({
            type: "overview/getEmployeesForSearch",
            payload: { fullNameEmployeeNumber: value }
          })
        }}
      />
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
    </div>
  );
};

export default connect(({ settings, overview }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  employeesForSearch: overview.searchBarEmployees,
}))(GlobalHeaderRight);
