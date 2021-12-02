import { history } from 'umi';

import { login } from '@/services/user';
import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';
import { stringify } from 'qs';
import { UserModelType } from './api/user';



const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    *login({ payload }, { call, put }) {
      try {
        const response = yield call(login, payload);
        yield put({
          type: 'saveCurrentUser',
          payload: response.user,
        });
        
        // Login successfully
        if (response.status === 'SUCCESS') {
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          if (response.loginType === "credentials") {
            message.success('Successfuly logged in！');
          }

          let { redirect } = params as { redirect: string };
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = '/';
              return;
            }
          }
          const { pathname } = window.location;
          history.replace(pathname.includes("manage") ? pathname : '/');
          sessionStorage.setItem("token", response.user.token);
        } 
      } catch(e) {
        yield put({ type: 'showLoginError' });
        message.error("Invalid username or password. Please try again")
      }
    },
    logout() {
      const { redirect } = getPageQuery();
      // Note: There may be security issues, please note

      sessionStorage.removeItem("token");
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    showLoginError(state) {
      return {
        ...state,
        hasLoginError: true
      }
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
