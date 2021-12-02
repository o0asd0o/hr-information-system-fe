import { LeaveTableListItem } from "@/models/api/leave";
import { ConnectState } from "@/models/connect";
import { Divider } from "antd";
import { connect, Dispatch } from "umi";
import dayjs from "dayjs";


export type Props = {
    dispatch: Dispatch;
    leave: LeaveTableListItem;
};

type OwnProps = {
    leave: LeaveTableListItem
};

const ActionsComponent : React.FC<Props> = ({ dispatch, leave }) => {
    const onUpdate = () => {
        dispatch({
            type: 'leave/getLeaveForUpdate',
            payload: { leaveId: leave.leaveId },
        });
    };
    const onDelete = () => {
        dispatch({
            type: 'leave/showModalForDelete',
            payload: { leave: leave }
        });
    };

    if (dayjs(leave.leaveStartDate).isBefore(dayjs())) {
        return null;
    }

    return <>
        <a onClick={onUpdate}>Update</a>
        <Divider type="vertical" />
        <a onClick={onDelete}>Remove</a>
    </>;
};

const mapStateToProps = (_: ConnectState, ownProps: OwnProps) => ({
    leave: ownProps.leave,
});

export default connect(mapStateToProps)(ActionsComponent);