import { EmployeeTableListItem } from "@/models/api/employee";
import { ConnectState } from "@/models/connect";
import { Divider } from "antd";
import { connect, Dispatch } from "umi";


export type Props = {
    dispatch: Dispatch;
    employee: EmployeeTableListItem;
};

type OwnProps = {
    employee: EmployeeTableListItem
};

const ActionsComponent : React.FC<Props> = ({ dispatch, employee }) => {
    const onUpdate = () => {
        dispatch({
            type: 'employee/getEmployeeForUpdate',
            payload: { employeeIdNumber: employee.employeeIdNumber },
        });
    };
    const onDelete = () => {
        dispatch({
            type: 'employee/showModalForDelete',
            payload: { employee: employee }
        });
    };

    return <>
        <a onClick={onUpdate}>Update</a>
        <Divider type="vertical" />
        <a onClick={onDelete}>Remove</a>
    </>;
}

const mapStateToProps = (_: ConnectState, ownProps: OwnProps) => ({
    employee: ownProps.employee,
});

export default connect(mapStateToProps)(ActionsComponent);