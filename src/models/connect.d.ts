import type { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import type { StateType } from './login';
import { EmployeeModelState } from './api/employee';
import { LeaveModelState } from './api/leave';
import { OnboardingModelState } from './api/onboarding';
import { OverviewModelState } from './api/overview';

export { GlobalModelState, UserModelState };

export type Loading = {
  global: boolean;
  effects: Record<string, boolean | undefined>;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    employee?: boolean
    leave?: boolean;
    onboarding?: boolean;
    overview?: boolean;
  };
};

export type ConnectState = {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  employee: EmployeeModelState;
  leave: LeaveModelState;
  onboarding: OnboardingModelState;
  overview: OverviewModelState;
};

export type Route = {
  routes?: Route[];
} & MenuDataItem;
