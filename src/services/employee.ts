import { EmployeeTableListItem, EmployeeTableListParams, UpdateEmployeeParams, DeleteEmployeeParams } from '@/models/api/employee';
import { getRequestWithToken, getRequestWithFileUploadAndToken } from '@/utils/request';
import { mapEmployeeFormToCreateEmployee, mapEmployeesToTableItems } from "./mappers/employee.mapper";



export async function getAllEmployees(params?: EmployeeTableListParams): Promise<any> {
    const request = getRequestWithToken();
    return request('employees', { params })
        .then((response) => {
            return {
                data: mapEmployeesToTableItems(response.employees) as EmployeeTableListItem[],
                status: response.employeesCount !== null ? "SUCCESS" : "FAILURE",
                total: response.employeesCount,
                success: true,
                pageSize: 1,
                current: 1,
            }
        });
};

export async function getEmployeeByEmployeeNumber(params: UpdateEmployeeParams): Promise<any> {
    const request = getRequestWithToken();
    return request(`employees/${params.employeeIdNumber}`)
        .then((response) => {
            return {
                status: response.status,
                employee: response.data.employee,
            }
        });
}

export async function deleteEmployeeByEmployeeNumber({ employeeIdNumber }: DeleteEmployeeParams) {
    const request = getRequestWithToken();
    return request(`employee/${employeeIdNumber}`, { method: "DELETE" })
        .then((response) => {
            return {
                status: response.status,
                employeeId: response.data.employeeId,
            }
        });
}

export async function createEmployee(values: any): Promise<any> {
    const request = getRequestWithToken();
    const mappedEmployee = mapEmployeeFormToCreateEmployee(values);
    return request('employee', { method: "POST", data: mappedEmployee })
        .then((response) => {
            return {
                status: response.status,
                employeeId: response.data.employeeId,
            }
        });
}

export async function updateEmployee(values: any): Promise<any> {
    const request = getRequestWithToken();
    const mappedEmployee = mapEmployeeFormToCreateEmployee(values);
    return request(`employee/${values.employeeId}`, { method: "PATCH", data: mappedEmployee })
        .then((response) => {
            return {
                status: response.status,
                employeeId: response.data.employeeId,
            }
        });
}

export async function updateProfilePicture(values: any): Promise<any> {
    const customRequest = getRequestWithFileUploadAndToken();
    const formData = new FormData();
    if (values.profilePicture && values.profilePicture.originFileObj) {
        formData.append("image", values.profilePicture.originFileObj, values.profilePicture.name);
        return customRequest(`employee/updateProfile/${values.employeeId}`, { method: "PATCH", body: formData })
        .then((response) => {
            return {
                status: response.status,
                employeeId: response.data.employeeId,
            }
        });
    }
}

export async function uploadProfilePicture(values: any): Promise<any> {
    const customRequest = getRequestWithFileUploadAndToken();
    const formData = new FormData();
    formData.append("image", values.profilePicture.originFileObj, values.profilePicture.name);
    return customRequest(`employee/uploadProfile/${values.employeeId}`, { method: "POST", body: formData })
        .then((response) => {
            return {
                status: response.status,
                employeeId: response.data.employeeId,
            }
        });
}

export async function updateGovernmentIdDocs(values: any): Promise<any> {
    const customRequest = getRequestWithFileUploadAndToken();

    const governmentIds = ["pagibig", "philhealth", "sss", "tin"];
    const idRequestParams = governmentIds
        .map((idName) => {
            return {
                employeeId: values.employeeId,
                name: idName,
                idNumber: values[`govId_${idName}`],
                fileWrapper: values[`govId_${idName}file`]
            }
        })
        .filter((govId) => {
            return !!govId.idNumber && !!govId.fileWrapper
        });
    
    const promises: Promise<any>[] = [];
    idRequestParams.forEach((item) => {
        const formData = new FormData();
        if (item.fileWrapper && item.fileWrapper.fileList[0]) {
            formData.append("file", item.fileWrapper.fileList[0].originFileObj, item.fileWrapper.fileList[0].name);
        }
        
        formData.append("employeeId", item.employeeId);
        formData.append("name", item.name);
        formData.append("idNumber", item.idNumber);
        
        promises.push(customRequest('employee/updateGovernmentId', { method: "PATCH", body: formData })
            .then((response) => {
                return {
                    status: response.status,
                    govid: response.data.govId,
                }
            }
        ));
    });

    return Promise.all(promises).then(responses => {
        return {
            success: responses.every((response) => response.status === "SUCCESS"),
            data: responses.map(response => response.govid),
        }
    });
};

export async function uploadGovernmentIdDocs(values: any): Promise<any> {
    const customRequest = getRequestWithFileUploadAndToken();
    
    const governmentIds = ["pagibig", "philhealth", "sss", "tin"];
    const idRequestParams = governmentIds
        .map((idName) => {
            return {
                employeeId: values.employeeId,
                name: idName,
                idNumber: values[`govId_${idName}`],
                fileWrapper: values[`govId_${idName}file`]
            }
        });

    const promises: Promise<any>[] = [];
    idRequestParams.forEach((item) => {
        const formData = new FormData();
        formData.append("file", item.fileWrapper.file.originFileObj, item.fileWrapper.file.name);
        formData.append("employeeId", item.employeeId);
        formData.append("name", item.name);
        formData.append("idNumber", item.idNumber);
        
        promises.push(customRequest('employee/uploadGovernmentId', { method: "POST", body: formData })
            .then((response) => {
                return {
                    status: response.status,
                    govid: response.data.govId,
                }
            }
        ));
    });

    return Promise.all(promises).then(responses => {
        return {
            success: responses.every((response) => response.status === "SUCCESS"),
            data: responses.map(response => response.govid),
        }
    });
}