import { LeaveSumaryByEmployeParam, DeleteLeaveParam, LeaveTableListItem, LeaveTableListParams, GetLeaveParam } from "@/models/api/leave";
import { getRequestWithToken } from "@/utils/request";
import { mapLeaveFormToLeaveData, mapLeavesToTableItems } from "./mappers/leave.mapper";

export async function getAllLeaves(params?: LeaveTableListParams): Promise<any> {
    const request = getRequestWithToken();
    return request('leaves', { params })
        .then((response) => {
            return {
                data: mapLeavesToTableItems(response.leaves) as LeaveTableListItem[],
                total: response.employeesCount,
                success: true,
                pageSize: 1,
                current: 1
            }
        });
};

export async function getLeaveSumaryByEmployeeId({ employeeId }: LeaveSumaryByEmployeParam): Promise<any> {
    const request = getRequestWithToken();
    return request(`leaves/summary/${employeeId}`)
        .then((response) => {
            return {
                status: response.status,
                summary: response.data.summary,
            }
        });
};


export async function createLeaveForEmployee(params: any) {
    const request = getRequestWithToken();

    const { employeeId } = params;
    const mappedLeave = mapLeaveFormToLeaveData(params, employeeId);
    return request('leave', { method: "POST", data: mappedLeave })
        .then((response) => {
            return {
                status: response.status,
                leaveId: response.data.leaveId,
            }
        });
};

export async function updateLeaveForEmployee(params: any) {
    const request = getRequestWithToken();

    const { leaveId } = params;
    const mappedLeave = mapLeaveFormToLeaveData(params);
    return request(`leaves/${leaveId}`, { method: "PATCH", data: mappedLeave })
        .then((response) => {
            return {
                status: response.status,
                leaveId: response.data.leaveId,
            }
        });
}

export async function getLeaveByLeaveId({ leaveId }: GetLeaveParam): Promise<any> {
    const request = getRequestWithToken();
    return request(`leaves/${leaveId}`)
    .then((response) => {
        return {
            status: response.status,
            leave: response.data.leave,
        }
    });
}

export async function deleteLeaveByLeaveId({ leaveId }: DeleteLeaveParam): Promise<any> {
    const request = getRequestWithToken();
    return request(`leaves/${leaveId}`, { method: "DELETE" })
        .then((response) => {
            return {
                status: response.status,
                leaveId: response.data.leaveId,
            }
        });
}
