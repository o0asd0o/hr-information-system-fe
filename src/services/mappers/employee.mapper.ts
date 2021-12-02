import { DivisionType, EmploymentStatus } from "@/models/api/common/enums";
import { EmployeeTableListItem } from "@/models/api/employee"
import dayjs from "dayjs";

export const mapEmployeesToTableItems =  (employees: any): EmployeeTableListItem[] => {
    if (employees.length > 0) {
        const result: EmployeeTableListItem[] = [];
        employees.forEach((employee: any) => {
            result.push({
                key: employee.employeeIdNumber,
                employeeId: employee.identifier,
                employeeIdNumber: employee.employeeIdNumber,
                position: employee.position,
                profilePicture: employee.profilePicture,
                fullName: `${employee.firstName} ${employee.lastName}`,
                contactNumber: employee.contactNumber,
                birthDate: dayjs(employee.birthDate).toDate(),
                divisionType: employee.divisionType as DivisionType,
                employmentStatus: employee.employmentStatus as EmploymentStatus,
            })
        })
        return result;
    }
    return [];
}

const getMappedAddress = (employee: any) => {
    const addressFields = ["streetAddress", "cityMunicipality", "postalCode", "province", "addressLine2", "country"];
    const addresFields2 = addressFields.map((field) => `${field}_1`);
    
    const address = [];
    address.push(addressFields.reduce((accu, curr) => {
        return {
            ...accu,
            [curr]: employee[curr],
        };
    }, { addressType: "present" }));

    address.push(addresFields2.reduce((accu, curr) => {
        return {
            ...accu,
            [curr.replace("_1", "")]: employee[curr],
        };
    }, { addressType: "permanent" }));

    return address;
}

export const mapEmployeeFormToCreateEmployee = (employee: any) => {
    return {
        employee: {
            employeeIdNumber: employee.employeeIdNumber,
            position: employee.position,
            firstName: employee.firstName,
            lastName: employee.lastName,
            middleName: employee.middleName,
            civilStatus: employee.civilStatus,
            emailAddress: employee.emailAddress,
            contactNumber: employee.contactNumber,
            emergencyContactPerson: employee.emergencyContactPerson,
            emergencyContactNumber: employee.emergencyContactNumber,
            birthDate: employee.birthDate && dayjs(employee.birthDate.toDate()).format("YYYY-MM-DD"),
            placeOfBirth: employee.placeOfBirth,
            gender: employee.gender,
            age: employee.age,
            salary: employee.salary,
            reportsTo: employee.reportsTo,
            divisionType: employee.divisionType,
            employmentStatus: employee.employmentStatus,
            startDate: employee.startDate && dayjs(employee.startDate.toDate()).format("YYYY-MM-DD"),
            divisionId: employee.division,
            address: getMappedAddress(employee),
        }
    };
}