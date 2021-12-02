import { Effect, Reducer } from "umi";

export type User = {
  profilePicture?: string,
  token?: string,
  username?: string,
  firstName?: string,
  lastName?: string,
};


// state management
export type UserModelState = {
  currentUser?: User;
  hasLoginError?: boolean
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    showLoginError: Reducer<UserModelState>;
  };
};