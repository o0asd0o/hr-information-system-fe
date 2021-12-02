import { LeaveModelType } from './api/leave';
import { createLeaveForEmployee, deleteLeaveByLeaveId, getLeaveByLeaveId, getLeaveSumaryByEmployeeId, updateLeaveForEmployee } from '@/services/leave';
import { message } from 'antd';
const LeaveModel: LeaveModelType = {
  namespace: 'leave',

  state: {
    leaves: [],
    isUpdating: false,
    showAddLeave: false,
    showUpdateLeave: false,
    showLeaveFormModal: false,
  },

  effects: {
    *getEmployeeLeaves() {

    },
    *selectEmployee({ payload }, { put }) {
        yield put({
            type: "saveEmployee",
            payload: payload.employee
        })
    },
    *getEmployeeLeaveSummary({ payload }, { put, call }) {
        const response = yield call(getLeaveSumaryByEmployeeId, payload);
        if (response.status === "SUCCESS") {
            yield put({
                type: 'saveEmployeeLeaveSummary',
                payload: response.summary,
            })
        }
    },
    *createLeave({ payload, employeeId }, { call, put }) {
        try {
            const response = yield call(createLeaveForEmployee, { ...payload, employeeId });
            if (response.status === "SUCCESS") {    
                message.success("Successfully added leave");
                const response2 = yield call(getLeaveSumaryByEmployeeId, { employeeId });
                if (response2.status === "SUCCESS") {
                    yield put({
                        type: 'saveEmployeeLeaveSummary',
                        payload: response2.summary,
                    })
                }
            } else {
                message.error("Fail to add leave")
            }
        } catch(e) {
            message.error("Fail to add leave")
        }  
    },
    *updateLeave({ payload, employeeId, leaveId }, { call, put }) {
        try {
            const response = yield call(updateLeaveForEmployee, { ...payload, leaveId });
            if (response.status === "SUCCESS") {    
                message.success("Successfully updated leave");
                yield put({ type: 'hideFormModal' });
                const response2 = yield call(getLeaveSumaryByEmployeeId, { employeeId });
                if (response2.status === "SUCCESS") {
                    yield put({
                        type: 'saveEmployeeLeaveSummary',
                        payload: response2.summary,
                    })
                }
            } else {
                message.error("Fail to add leave")
            }
        } catch(e) {
            message.error("Fail to add leave")
        }  
    },
    *approveLeave() {

    },
    *getLeaveForUpdate({ payload }, { call, put }) {
        try {
            const response = yield call(getLeaveByLeaveId, { ...payload });
            if (response.status === "SUCCESS") {
                yield put({ type: "showUpdateLeaveFormModal", payload: response.leave });
            }
        } catch (error) {
            message.error("Fail to load employee")
        }
    },
    *hideLeaveFormModal(_, { put }) {
        yield put({ type: "hideFormModal" });
    },
    *showModalForDelete({ payload }, { put }) {
        yield put({
            type: "showDeleteModal",
            payload: payload.leave,
        })
    },
    *hideDeleteLeaveModal(_, { put }) {
        yield put({ type: "hideDeleteModal" });
    },
    *deleteLeave({ payload }, { call, put}) {
        try {
            const response = yield call(deleteLeaveByLeaveId, { ...payload });
            if (response.status === "SUCCESS") {
                message.success("Successfully deleted leave");
                yield put({ type: "hideDeleteModal" });
                const response2 = yield call(getLeaveSumaryByEmployeeId, { employeeId: payload.employeeId });
                if (response2.status === "SUCCESS") {
                    yield put({
                        type: 'saveEmployeeLeaveSummary',
                        payload: response2.summary,
                    })
                }
            } else {
                message.error("Fail to delete leave")
            }
        } catch(error) {
            message.error("Fail to delete leave")
        }
    },
  },

  reducers: {
    saveLeaves(state, action) {
        return {
            ...state!,
            leaves: action.payload || [],
        };
    },
    saveEmployee(state, action){
        return {
            ...state!,
            selectedEmployee: action.payload || {},
        };
    },
    saveEmployeeLeaveSummary(state, action) {
        return {
            ...state!,
            leaveSummary: action.payload || {},
        };
    },
    saveLeaveForUpdate(state, action) {
        return {
            ...state!,
            leave: action.payload || [],
        };
    },
    removeLeaveToUpdate(state, action) {
        return {
            ...state!,
            leave: action.payload || [],
        };
    },
    showAddLeaveFormModal(state) {
        return {
            ...state!,
            showLeaveFormModal: true,
            isUpdating: false,
        };
    },
    showUpdateLeaveFormModal(state, action) {
        return {
            ...state!,
            showLeaveFormModal: true,
            isUpdating: true,
            selectedLeave: action.payload,
        };
    },
    hideFormModal(state) {
        return {
            ...state!,
            showLeaveFormModal: false,
            isUpdating: false,
            selectedLeave: undefined,
        };
    },
    showDeleteModal(state, action) {
        return {
            ...state!,
            showDeleteLeaveModal: true,
            selectedLeave: action.payload,
        };
    },
    hideDeleteModal(state) {
        return {
            ...state!,
            showDeleteLeaveModal: false,
            selectedLeave: undefined,
        };
    }
  }
}

export default LeaveModel;
