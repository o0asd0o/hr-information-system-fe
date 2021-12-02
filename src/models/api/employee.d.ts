import { Effect, Reducer } from 'umi';
import { AddressType, CivilStatus, DivisionType, EmploymentStatus, Gender } from './common/enums';
import { DivisionEntity } from './division';

// Table related
export interface EmployeeTableListItem {
    key: number;
    employeeId: number;
    employeeIdNumber: string;
    position: string;
    profilePicture?: string;
    fullName: string
    contactNumber: string;
    birthDate: Date;
    divisionType?: DivisionType;
    employmentStatus: EmploymentStatus;
} 

export interface EmployeeTableListParams {
    status?: string;
    name?: string;
    desc?: string;
    key?: number;
    pageSize?: number;
    currentPage?: number;
    filter?: { [key: string]: any[] };
    sorter?: { [key: string]: any };
    divisionType?: DivisionType;
};

export interface UpdateEmployeeParams {
  employeeIdNumber: string;
}

export interface DeleteEmployeeParams {
  employeeIdNumber: string;
}

export type EmployeeEntity = {
    identifier: string;
    employeeIdNumber: string;
    position: string;
    profilePicture?: string;
    firstName: string;
    lastName: string;
    middleName: string;
    civilStatus: CivilStatus;
    emailAddress: string;
    contactNumber: string;
    emergencyContactPerson: string;
    emergencyContactNumber: string;
    birthDate: Date;
    placeOfBirth: string;
    gender: Gender;
    age: number;
    salary: number;
    reportsTo: string;
    divisionType?: DivisionType;
    employmentStatus: EmployementStatus;
    startDate: Date;
    departureDate?: Date;
    division?: DivisionEntity;
    governmentIds: GovernmentIdEntity[];
    address: AddressEntity[];
    documents?: Document[];
    appraisals?: Appraisal[];
    leaves?: LeaveEntity[];
};

export type AddressEntity = {
    streetAddress: string;
    addressLine2: string;
    cityMunicipality: string;
    postalCode: string;
    province: string;
    country: string;
    addressType: AddressType;
    employeeId: number;
};

export type GovernmentIdEntity = {
    idNumber: string;
    image: string;
    name: string;
    employeeId: number;
};



// state management
export type EmployeeModelState = {
  employees: EmployeeEntity[];
  divisions: DivisionEntity[];
  isUpdating: boolean;
  selectedEmployee?: EmployeeEntity & TableListItem;
  showDeleteModal?: boolean;
};

export type EmployeeModelType = {
  namespace: 'employee';
  state: EmployeeModelState;
  effects: {
    getEmployeeFormDivisions: Effect;
    createEmployee: Effect;
    updateEmployee: Effect;
    getEmployeeForUpdate: Effect;
    showModalForDelete: Effect;
    hideModalForDelete: Effect;
    removeSelectedEmployee: Effect;
    saveEmployees: Effect;
    deleteEmployee: Effect;
  };
  reducers: {
    saveEmployees: Reducer<EmployeeModelState>;
    saveDivisions: Reducer<EmployeeModelState>;
    saveEmployeeForUpdate: Reducer<EmployeeModelState>;
    removeEmployeeToUpdate: Reducer<EmployeeModelState>;
    showDeleteEmployeeModal: Reducer<EmployeeModelState>;
    hideDeleteEmployeeModal: Reducer<EmployeeModelState>;
  };
};