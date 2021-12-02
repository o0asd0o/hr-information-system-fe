import dayjs from "dayjs";

import { EmployeeProps } from "../";
import { AddressEntity, GovernmentIdEntity } from "@/models/api/employee";
import { AddressType } from "@/models/api/common/enums";

export const valueFormatTransformer = {
    employeeIdNumber: (value: string) => {
        let resultValue = value.includes("SVK") ? value : `SVK-${value}`
        resultValue = value === "SVK" ? "" : resultValue;
        
        return {
            key: "employeeIdNumber",
            value: resultValue,
        };
    },
    contactNumber: (value: string) => {

        return {
            key: "contactNumber",
            value: getStringNumberFormat(value, [5, 8]),
        }
    },
    emergencyContactNumber: (value: string) => {

        return {
            key: "emergencyContactNumber",
            value: getStringNumberFormat(value, [5, 8]),
        }
    },
    salary: (value: string) => {
        const number = Number(value.replaceAll(",", ""));
        return {
            key: "salary",
            value: number.toLocaleString(),
        }
    },
    govId_philhealth: (value: string) => {
        return {
            key: "govId_philhealth",
            value: getStringNumberFormat(value, [5, 9]),
        }
    },

    govId_sss: (value: string) => {
        return {
            key: "govId_sss",
            value: getStringNumberFormat(value, [3, 10]),
        }
    },

    govId_pagibig: (value: string) => {
        return {
            key: "govId_pagibig",
            value: getStringNumberFormat(value, [5, 9]),
        }
    },

    govId_tin: (value: string) => {
        return {
            key: "govId_tin",
            value: getStringNumberFormat(value, [4, 7, 10]),
        }
    }
};

export const getInitialValues = ({ isUpdating, selectedEmployee }: EmployeeProps) => {
    const defaultInitialValues = { country: "Philippines", country_1: "Philippines" };
    if (!isUpdating) {
      return defaultInitialValues;
    }

    return {
      employeeIdNumber: selectedEmployee?.employeeIdNumber,
      firstName: selectedEmployee?.firstName,
      emailAddress: selectedEmployee?.emailAddress,
      middleName: selectedEmployee?.middleName,
      contactNumber: selectedEmployee?.contactNumber,
      profilePicture: selectedEmployee?.profilePicture,
      lastName: selectedEmployee?.lastName,
      emergencyContactPerson: selectedEmployee?.emergencyContactPerson,
      civilStatus: selectedEmployee?.civilStatus,
      emergencyContactNumber: selectedEmployee?.emergencyContactNumber,
      birthDate: selectedEmployee ? dayjs(selectedEmployee.birthDate) : null,
      age: selectedEmployee?.age,
      placeOfBirth: selectedEmployee?.placeOfBirth,
      gender: selectedEmployee?.gender,      
      salary: selectedEmployee?.salary,
      divisionType: selectedEmployee?.divisionType,
      division: selectedEmployee?.division?.identifier,
      position: selectedEmployee?.position,
      employmentStatus: selectedEmployee?.employmentStatus,
      reportsTo: selectedEmployee?.reportsTo,
      startDate: selectedEmployee ? dayjs(selectedEmployee.startDate) : null,
      ...getAddress(selectedEmployee?.address),
      ...getGovernmentIds(selectedEmployee?.governmentIds)
    }
};

export const getTouchedValues = (isFieldTouched: (key: string) => boolean, values: any) => {
    return Object.entries(values).reduce((accu, current) => {
        
        const [key, value] = current;
        if (isFieldTouched(key) || (key === "profilePicture" && !!key)) {
          return { ...accu, [key]: value };
        }
        return { ...accu };
    }, {});
}

//////////////////////////////////////////////////////////////////
const getStringNumberFormat = (value: string, breakPoints: number[] = [], delimiter = "-") => {
    const originalValue = value.replaceAll(delimiter, "");

    let resultValue = value;

    if (resultValue.match(/[A-Za-z!@#$%^&*(),.?":{}|<>\\_]/)) {
        return resultValue.replace(/[A-Za-z!@#$%^&*(),.?":{}|<>\\_]/, "");;
    }

    for (let index = 0; index < breakPoints.length; index ++) {
        const breakPoint = breakPoints[index];
        if (breakPoint === originalValue.length) {
            const points = breakPoints.slice(0, index + 1);
            const tempArray = Array.from(originalValue);
            points.forEach((item, index) => tempArray.splice(item + index - 1, 0, delimiter));
            resultValue = tempArray.join("");
            break;
        }
    }

    return resultValue;
};

const getGovernmentIds = (governmentIds?: GovernmentIdEntity[]) => {
    if (governmentIds) {
        return governmentIds.reduce((accu, current) => { 
            return {
                ...accu,
                [`govId_${current.name}`]: current.idNumber
            }
        }, {});
    }
    return {};
};

const getAddress = (address?: AddressEntity[]) => {
    if (address) {
        return address.reduce((accu, current) => {
            if (current.addressType === AddressType.PRESENT) {
              return {
                ...accu,
                streetAddress: current.streetAddress,
                addressLine2: current.addressLine2,
                cityMunicipality: current.cityMunicipality,
                postalCode: current.postalCode,
                province: current.province,
                country: current.country,
              }
            }
            return { 
                ...accu,
                streetAddress_1: current.streetAddress,
                addressLine2_1: current.addressLine2,
                cityMunicipality_1: current.cityMunicipality,
                postalCode_1: current.postalCode,
                province_1: current.province,
                country_1: current.country,
            }
        }, {});
    }

    return {};
};