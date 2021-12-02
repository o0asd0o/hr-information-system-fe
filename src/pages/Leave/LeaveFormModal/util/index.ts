import { LeaveFormModalProps } from "../";
import dayjs from "dayjs";

export const getInitialValues = ({ isUpdating, selectedLeave }: LeaveFormModalProps & { isUpdating: boolean }) => {
    if (!isUpdating) {
        return { totalDaysToBePaid: "0", requestDate: dayjs(new Date()) };
    }

    return {
        requestDate: dayjs(selectedLeave?.requestDate),
        status: selectedLeave?.status,
        totalDaysToBePaid: selectedLeave?.totalDaysPaid,
        leaveRangeDate: [dayjs(selectedLeave?.leaveStartDate), dayjs(selectedLeave?.leaveEndDate)],
        reasonForLeave: selectedLeave?.reasonForLeave,
        leaveType: selectedLeave?.leaveType,
    };
}

export const getTouchedValues = (isFieldTouched: (key: string) => boolean, values: any) => {
    return Object.entries(values).reduce((accu, current) => {
        const [key, value] = current;
        if (isFieldTouched(key) && !!key) {
          return { ...accu, [key]: value };
        }
        return { ...accu };
    }, {});
}
