import { OverviewModelType } from "./api/overview";
import { getAllEmployees } from "@/services/employee";


const OverviewModel: OverviewModelType = {
    namespace: 'overview',
    state: {
        searchBarEmployees: [],
    },

    effects: {
        *getEmployeesForSearch({ payload }, { call, put }) {
            try {
                const response = yield call(getAllEmployees, { ...payload });
                if (response.status === "SUCCESS") {
                    yield put({
                        type: "saveEmployees",
                        payload: response.data,
                    })
                }
             } catch (e) {
                // include error warning
            }
        },
        *selectEmployee () {

        },
        *getEmployeeOverviewDetails () {

        }
    },
    reducers: {
        saveEmployees (state, action) {
            return {
                ...state,
                searchBarEmployees: action.payload
            }
        },
        saveSelectedEmployee (state, action) {
            return {
                ...state,
                selectedEmployee: action.payload
            }
        },
        saveEmployeeOverViewDetails (state) {
            return {
                ...state,
            }
        }
    }
}

export default OverviewModel;