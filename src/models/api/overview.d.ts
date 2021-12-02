import { EmployeeEntity, EmployeeTableListItem } from "./employee";
import { LeaveEntity } from "./leave";
import { EmploymentStatus } from './common/enums';
import { OnboardingEntity } from "./onboarding";
import { Effect, Reducer } from 'umi';

export interface SearchByEmployeeItem {
    key: number;
    employeeId: number;
    employeeIdNumber: string;
    fullName: string;
    employmentStatus: EmploymentStatus;
}

export interface OverviewModelState {
    selectedEmployee?: EmployeeTableListItem & EmployeeEntity,
    searchBarEmployees?: SearchByEmployeeItem[],
    overviewInfo?: {
        onboardingDocuments: OnboardingEntity[],
        leaveSummary: LeaveSummary,
        employeeLeaves: LeaveEntity[],
        // appraisal field here
    }
}

// state management
export type OverviewModelType = {
    namespace: 'overview';
    state: OverviewModelState;
    effects: {
        getEmployeesForSearch: Effect;
        selectEmployee: Effect;
        getEmployeeOverviewDetails: Effect;
    },
    reducers: {
        saveEmployees: Reducer<OverviewModelState>;
        saveSelectedEmployee: Reducer<OverviewModelState>;
        saveEmployeeOverViewDetails: Reducer<OverviewModelState>;
    }
};