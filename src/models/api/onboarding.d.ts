import { EmployeeEntity, EmployeeTableListItem } from "./employee";
import { Effect, Reducer } from 'umi';

export interface OnboardingTileItem {
  documentId: number;
  image: string;
  name: string;
  description: string
  employeeId: number;
} 

export interface DeleteDocumentParam {
  documentId: number;
}

export interface GetDocumentParam {
  documentId: number;
}


export interface UpdateDocumentParam {
    documentId: string;
}
export interface GetDocumentByEmployeeIdParam {
  employeeId: string;
}

export interface OnboardingEntity {
  identifier: number;
  documentId: number;
  image: string;
  name: string;
  description: string
  employeeId: number;
}

// state management
export type OnboardingModelState = {
  documents: OnboardingEntity[];
  isUpdating?: boolean;
  showAddDocument?: boolean;
  showUpdateDocument?: boolean;
  showDocumentFormModal?: boolean;
  showDeleteDocumentModal?: boolean;
  selectedEmployee?: EmployeeTableListItem & EmployeeEntity;
  selectedDocument?: OnboardingTileItem;
};

// state management
export type OnboardingModelType = {
  namespace: 'onboarding';
  state: OnboardingModelState;
  effects: {
    getEmployeeDocuments: Effect;
    selectEmployee: Effect;
    createDocument: Effect;
    updateDocument: Effect;
    getAndSelectEmployee: Effect;

    getDocumentForUpdate: Effect;
    hideDocumentFormModal: Effect;
    showModalForDelete: Effect;
    hideDeleteLDocumentModal: Effect;
    deleteDocument: Effect;
  };
  reducers: {
    saveDocuments: Reducer<LeaveModelState>;
    saveEmployee: Reducer<LeaveModelState>;
    saveDocumentForUpdate: Reducer<LeaveModelState>;
    removeDocumentToUpdate: Reducer<LeaveModelState>;
    showAddDocumentFormModal: Reducer<LeaveModelState>;
    showUpdateDocumentFormModal: Reducer<LeaveModelState>;
    hideFormModal: Reducer<LeaveModelState>;
    showDeleteModal: Reducer<LeaveModelState>;
    hideDeleteModal:  Reducer<LeaveModelState>;
  };
};