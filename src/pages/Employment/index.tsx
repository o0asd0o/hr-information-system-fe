import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, Result, Button } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './index.less';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

export default (): React.ReactNode => {
  return (
    <PageContainer>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary">Back Home</Button>}
      />
    </PageContainer>
  );
};
