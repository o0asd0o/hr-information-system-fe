import { EmployeeEntity } from "./employee";
import { Effect, Reducer } from 'umi';

export interface LeaveTableListItem {
  key: number;
  identifier: number;
  leaveId: number;
  leaveType: LeaveType;
  requestDate: Date | string;
  leaveStartDate: Date | string;
  leaveEndDate: Date | string;
  totalDaysPaid: number;
  reasonForLeave: string;
  status: LeaveStatus;
} 
  
export interface LeaveTableListParams {
    employeeId?: number;
    name?: string;
    desc?: string;
    key?: number;
    pageSize?: number;
    currentPage?: number;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
    divisionType?: DivisionType;
};

export interface LeaveSumaryByEmployeParam {
  employeeId: number;
}

export interface DeleteLeaveParam {
  leaveId: number;
}

export interface GetLeaveParam {
  leaveId: number;
}


export interface UpdateLeaveParams {
    leaveId: string;
}

export interface DeleteLeaveParams {
  leaveId: string;
}

export interface LeaveEntity {
  identifier: number;
  leaveType: LeaveType;
  requestDate: Date;
  leaveStartDate: Date;
  leaveEndDate: Date;
  totalDaysPaid: number;
  reasonForLeave: string;
  status: LeaveStatus;
  employeeId: number;
  employee: EmployeeEntity;
}

export enum LeaveStatus {
  PENDING = "pending",
  REJECTED = "rejected",
  APPROVED = "approved",
}

export interface LeaveSummary {
  remainingVacationLeaves: number,
  remainingSickLeaves: number,
  remainingServiceIncentiveLeaves: number,
  totalRestrictedLeaves: number,
  pendingLeaves: {
    [key as string]: number;
  }
}

// state management
export type LeaveModelState = {
  leaves: LeaveEntity[];
  isUpdating?: boolean;
  showAddLeave?: boolean;
  showUpdateLeave?: boolean;
  showLeaveFormModal?: boolean;
  showDeleteLeaveModal?: boolean;
  selectedEmployee?: EmployeeTableListItem;
  leaveSummary?: LeaveSummary;
  selectedLeave?: LeaveTableListItem;
};

// state management
export type LeaveModelType = {
  namespace: 'leave';
  state: LeaveModelState;
  effects: {
    getEmployeeLeaves: Effect;
    selectEmployee: Effect;
    getEmployeeLeaveSummary: Effect;
    createLeave: Effect;
    updateLeave: Effect;
    approveLeave: Effect;
    getLeaveForUpdate: Effect;
    hideLeaveFormModal: Effect;
    showModalForDelete: Effect;
    hideDeleteLeaveModal: Effect;
    deleteLeave: Effect;
  };
  reducers: {
    saveLeaves: Reducer<LeaveModelState>;
    saveEmployee: Reducer<LeaveModelState>;
    saveEmployeeLeaveSummary: Reducer<LeaveModelState>;
    saveLeaveForUpdate: Reducer<LeaveModelState>;
    removeLeaveToUpdate: Reducer<LeaveModelState>;
    showAddLeaveFormModal: Reducer<LeaveModelState>;
    showUpdateLeaveFormModal: Reducer<LeaveModelState>;
    hideFormModal: Reducer<LeaveModelState>;
    showDeleteModal: Reducer<LeaveModelState>;
    hideDeleteModal:  Reducer<LeaveModelState>;
  };
};