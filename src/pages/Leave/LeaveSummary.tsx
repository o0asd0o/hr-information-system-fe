import { EmployeeTableListItem } from "@/models/api/employee";
import { LeaveSummary } from "@/models/api/leave";
import { ConnectState } from "@/models/connect";
import { Col, Row, Image, Tag } from "antd";
import React, { useEffect } from "react";
import { connect, Dispatch } from "umi";
import styles from "./index.less";

type Props = {
    employee?: EmployeeTableListItem;
    leaveSummary?: LeaveSummary;
    dispatch: Dispatch;
};


const LeaveSummaryComponent : React.FC<Props> = ({ employee, leaveSummary, dispatch }) => {

    const sourcUrl = `http://localhost:4000/api/employee/images/${employee?.profilePicture}`;
    let totalLeaves = "-";
    
    useEffect(() => {
        if (!!employee?.employeeId) {
            dispatch({
                type: 'leave/getEmployeeLeaveSummary',
                payload: { employeeId: employee.employeeId },
            })
        }
    }, [employee?.employeeId]);
    
    if (leaveSummary) {
        totalLeaves = parseFloat(String(leaveSummary.remainingVacationLeaves + leaveSummary.remainingSickLeaves + leaveSummary.remainingServiceIncentiveLeaves)).toFixed(2);
    }

    const employmentStatusComponent = !!employee?.employmentStatus ? <Tag>{employee.employmentStatus}</Tag> : "-";

    const remainingVacationLeaves = leaveSummary?.remainingVacationLeaves;
    const remainingSickLeaves = leaveSummary?.remainingSickLeaves;
    const remainingServiceIncentiveLeaves = leaveSummary?.remainingServiceIncentiveLeaves;
    
    return (
        <Row gutter={16} className={styles.wrapper}>
            <Col xl={{ span: 6, offset: 2 }} md={{ span: 6 }}>
                {!!employee?.profilePicture ? <Image width={200} src={sourcUrl} /> : <Image preview={false} width={200} src="/avatar/default-avatar.jpg" />}
            </Col>
            <Col xl={{ span: 14 }} md={{ span: 18 }} className={styles.summaryContainer}>
                <div className={styles.summary}>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Employee #:</span>
                        <span className={styles.value}>{employee?.employeeIdNumber ?? "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Name:</span>
                        <span className={styles.value}>{employee?.fullName ?? "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Division:</span>
                        <span className={styles.value}>{employee?.divisionType ?? "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Employment Status:</span>
                        <span className={styles.value}>{employmentStatusComponent}</span>
                    </div>
                </div>
                <div className={styles.summary}>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Remaining VL:</span>
                        <span className={styles.value}>{remainingVacationLeaves!! ? parseFloat(String(remainingVacationLeaves)).toFixed(2) : "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Remaining SL:</span>
                        <span className={styles.value}>{remainingSickLeaves!! ? parseFloat(String(remainingSickLeaves)).toFixed(2) : "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Remaining SIL:</span>
                        <span className={styles.value}>{remainingServiceIncentiveLeaves!! ? parseFloat(String(remainingServiceIncentiveLeaves)) : "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Total:</span>
                        <span className={styles.value}>{totalLeaves ?? "-"}</span>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

const mapStateToProps = ({ leave }: ConnectState) => {
    return {
        employee: leave.selectedEmployee,
        leaveSummary: leave.leaveSummary
    }
}

export default connect(mapStateToProps)(LeaveSummaryComponent);