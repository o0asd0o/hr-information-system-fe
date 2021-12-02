import { LeaveType } from "@/models/api/common/enums";
import { LeaveTableListItem } from "@/models/api/leave";
import dayjs from "dayjs";

export const mapLeavesToTableItems =  (leaves: any): LeaveTableListItem[] => {
    if (leaves.length > 0) {
        const result: LeaveTableListItem[] = [];
        leaves.forEach((leave: any) => {
            result.push({
                key: leave.identifier,
                leaveId: leave.identifier,
                identifier: leave.identifier,
                leaveType: leave.leaveType as LeaveType,
                requestDate: dayjs(leave.requestDate).format("YYYY-MM-DD"),
                leaveStartDate: dayjs(leave.leaveStartDate).format("YYYY-MM-DD"),
                leaveEndDate: dayjs(leave.leaveEndDate).format("YYYY-MM-DD"),
                totalDaysPaid: leave.totalDaysPaid,
                reasonForLeave: leave.reasonForLeave,
                status: leave.status
            })
        })
        return sortByDate(result);
    }
    return [];
}

export const mapLeaveFormToLeaveData = (leave: any, employeeId?: number) => {
    const [dateStart, dateEnd] = leave.leaveRangeDate;
    return {
        leave: {
            leaveId: leave.leaveId,
            leaveType: leave.leaveType,
            requestDate: dayjs(leave.requestDate).format("YYYY-MM-DD"),
            leaveStartDate: dayjs(dateStart).format("YYYY-MM-DD"),
            leaveEndDate: dayjs(dateEnd).format("YYYY-MM-DD"),
            totalDaysPaid: leave.totalDaysToBePaid,
            reasonForLeave: leave.reasonForLeave,
            status: leave.status,
            employeeId: employeeId,
        }
    }
};

const sortByDate = (list: LeaveTableListItem[]) => {
    return list.sort((data1, data2) => {
        return dayjs(data1.requestDate).toDate().getTime() - dayjs(data2.requestDate).toDate().getTime();
    })
};