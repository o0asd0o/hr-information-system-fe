import { EmployeeTableListItem } from "@/models/api/employee";
import { Button } from "antd";
import { connect, Dispatch } from "umi";

export type Props = {
    dispatch: Dispatch;
    employee: EmployeeTableListItem;
    model: string;
    onExit?: () => void;
    shouldGetEmployee?: boolean;
};

const ActionComponent : React.FC<Props> = ({ dispatch, employee, model, onExit, shouldGetEmployee }) => {
    const onSelect = () => {
        if (shouldGetEmployee) {
            dispatch({
                type: `${model}/getAndSelectEmployee`,
                payload: { employeeIdNumber: employee.employeeIdNumber }
            })
        } else {
            dispatch({
                type: `${model}/selectEmployee`,
                payload: { employee },
            });
        }
        
        if (onExit) {
            onExit();
        }
    };

    return <>
        <Button type="dashed" onClick={onSelect}>Select Employee</Button>
    </>;
}

export default connect()(ActionComponent);