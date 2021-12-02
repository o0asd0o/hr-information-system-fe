import { getAlDivisions } from '@/services/division';
import { message } from 'antd';
import { EmployeeModelType } from './api/employee';
import { history } from "umi";
import { createEmployee, updateEmployee, getEmployeeByEmployeeNumber, updateGovernmentIdDocs, updateProfilePicture,
  uploadGovernmentIdDocs, uploadProfilePicture, deleteEmployeeByEmployeeNumber } from '@/services/employee';

const EmployeeModel: EmployeeModelType = {
  namespace: 'employee',

  state: {
    employees: [],
    divisions: [],
    isUpdating: false,
    showDeleteModal: false,
  },

  effects: {
    *getEmployeeFormDivisions({ payload }, { call, put }) {
      try {
        const response = yield call(getAlDivisions, { ...payload });
        yield put({
          type: 'saveDivisions',
          payload: response.divisions,
        });
      } catch(e) {
        message.error("Cannot retrieve divisions")
      }  
    },

    *createEmployee({ payload }, { call }) {
      try {
        const response = yield call(createEmployee, { ...payload });
        if (response.status === "SUCCESS") {
          const paramsWithEmployeeId = { ...payload, employeeId: response.employeeId };
          yield call(uploadProfilePicture, paramsWithEmployeeId);
          yield call(uploadGovernmentIdDocs, paramsWithEmployeeId)

          message.success("Successfully created employee");
          history.replace('/employee');
        } else {
          message.error("Fail to create employee")
        }
      } catch(e) {
        message.error("Fail to create employee")
      }  
    },

    *updateEmployee({ payload, employeeId }, { call }) {
      try {
        const response = yield call(updateEmployee, { ...payload, employeeId });
        if (response.status === "SUCCESS") {
          const paramsWithEmployeeId = { ...payload, employeeId: response.employeeId };
          yield call(updateProfilePicture, paramsWithEmployeeId);
          yield call(updateGovernmentIdDocs, paramsWithEmployeeId)

          message.success("Successfully updated employee");
          history.replace('/employee');
        } else {
          message.error("Fail to create employee")
        }
      } catch(e) {
        message.error("Fail to create employee")
      } 
    },

    *getEmployeeForUpdate({ payload }, { call, put }) {
      try {
        const response = yield call(getEmployeeByEmployeeNumber, { ...payload });
        yield put({
          type: "saveEmployeeForUpdate",
          payload: response.employee
        })
        history.push("/manage/update-employee");
      } catch (e) {
        message.error("Fail to get employee");
      }
    },

    *showModalForDelete({ payload }, { put }) {
      yield put({
        type: "showDeleteEmployeeModal",
        payload: payload.employee
      })
    },

    *hideModalForDelete(_, { put }) {
      yield put({ type: "hideDeleteEmployeeModal" })
    },
    
    *removeSelectedEmployee(_, { put }) {
      yield put({ type: "removeEmployeeToUpdate" });
    },

    *saveEmployees(_, { put }) {
      yield put({ type: "saveEmployees"});
    },

    *deleteEmployee({ payload }, { call, put }) {
      try {
        const response = yield call(deleteEmployeeByEmployeeNumber, { ...payload });
        if (response.status === "SUCCESS") {
          message.success("Successfully updated employee");
          yield put({ type: "hideDeleteEmployeeModal" });
        } else {
          message.error("Fail to delete employee")
        }
      } catch(error) {
        message.error("Fail to delete employee")
      }
    }
  },

  reducers: {
    saveEmployees(state, action) {
      return {
        ...state!,
        employees: action.payload || [],
      };
    },
    saveDivisions(state, action) {
      return {
        ...state!,
        divisions: action.payload || [],
      };
    },
    saveEmployeeForUpdate(state, action) {
      return {
        ...state!,
        isUpdating: true,
        selectedEmployee: action.payload || [],
      };
    },
    removeEmployeeToUpdate(state) {
      return {
        ...state!,
        isUpdating: false,
        selectedEmployee: undefined,
      };
    },
    showDeleteEmployeeModal(state, action) {
      return {
        ...state!,
        showDeleteModal: true,
        selectedEmployee: action.payload || [],
      };
    },
    hideDeleteEmployeeModal(state) {
      return {
        ...state!,
        showDeleteModal: false,
        selectedEmployee: undefined,
      };
    }
  }
}

export default EmployeeModel;
