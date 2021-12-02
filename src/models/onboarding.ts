import { getEmployeeByEmployeeNumber } from "@/services/employee";
import { getAllEmployeeDocuments } from "@/services/onboarding";
import { message } from "antd";
import { OnboardingModelType } from "./api/onboarding";

const OnboardingModel: OnboardingModelType = {

    namespace: 'onboarding',

    state: {
        documents: [],
        isUpdating: false,
        showAddDocument: false,
        showUpdateDocument: false,
        showDocumentFormModal: false,
    },

    effects: {
        *getEmployeeDocuments({ payload }, { call, put }) {
            try {
                const response = yield call(getAllEmployeeDocuments, { ...payload });
                if (response.status === "SUCCESS") {
                    yield put({
                        type: "saveDocuments",
                        payload: response.documents
                    });
                }
            } catch(e) { }
        },

        *selectEmployee () {

        },

        *getAndSelectEmployee ({ payload }, { call, put }) {
            try {
                const response = yield call(getEmployeeByEmployeeNumber, { ...payload });
                yield put({
                type: "saveEmployee",
                payload: response.employee
                });
            } catch (e) {
                message.error("Fail to get employee");
            }
        },

        *createDocument () {

        },

        *updateDocument () {

        },

        *getDocumentForUpdate () {

        },

        *hideDocumentFormModal () {

        },

        *showModalForDelete () {

        },

        *hideDeleteLDocumentModal () {

        },

        *deleteDocument () {

        }
    },

    reducers: {
        saveDocuments(state, action) {
            return { 
                ...state,
                documents: action.payload
            };
        },

        saveEmployee(state, action) {
            return {
                ...state,
                selectedEmployee: action.payload
            };
        },

        saveDocumentForUpdate(state) {
            return { ...state };
        },

        removeDocumentToUpdate(state) {
            return { ...state };
        },

        showAddDocumentFormModal(state) {
            return { ...state };
        },

        showUpdateDocumentFormModal(state) {
            return { ...state };
        },
        
        hideFormModal(state) {
            return { ...state };
        },

        showDeleteModal(state) {
            return { ...state };
        }, 

        hideDeleteModal(state) {
            return { ...state };
        }
    }
};

export default OnboardingModel;