import React from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import type { ConnectProps, Dispatch } from 'umi';
import { Redirect, connect } from 'umi';
import { stringify } from 'querystring';
import type { ConnectState } from '@/models/connect';
import { User } from '@/models/api/user';

type SecurityLayoutProps = {
  dispatch: Dispatch;
  loading?: boolean;
  currentUser?: User;
} & ConnectProps;

type SecurityLayoutState = {
  isReady: boolean;
};

class SecurityLayout extends React.Component<SecurityLayoutProps, SecurityLayoutState> {
  state: SecurityLayoutState = {
    isReady: false,
  };

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    const token = sessionStorage.getItem("token");

    this.setState({
      isReady: true,
    });

    if (token && !currentUser?.token) {
      dispatch({
        type: 'user/login',
        payload: { token: sessionStorage.getItem("token") },
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    // You can replace it to your authentication rule (such as check token exists)
    // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
    const isLogin = currentUser && currentUser.token;
    const queryString = stringify({
      redirect: window.location.href,
    });

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }
    if (!isLogin && window.location.pathname !== '/user/login') {
      return <Redirect to={`/user/login?${queryString}`} />;
    }
    return children;
  }
}

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
