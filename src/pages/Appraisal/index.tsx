import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Result, Button } from 'antd';


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
