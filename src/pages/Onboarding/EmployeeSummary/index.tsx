import { EmployeeEntity, EmployeeTableListItem } from "@/models/api/employee";
import { ConnectState } from "@/models/connect";
import { Col, Image, Row } from "antd";
import { connect, Dispatch } from "umi";
import dayjs from "dayjs";

import styles from "./index.less";

type EmployeeSummaryProps = {
    employee?: EmployeeTableListItem & EmployeeEntity;
    dispatch: Dispatch
};

const EmployeeSummaryComponent : React.FC<EmployeeSummaryProps> = ({ employee }) => {
    const sourcUrl = `http://localhost:4000/api/employee/images/${employee?.profilePicture}`;

    const fullNameRaw = employee?.firstName ? `${employee?.firstName} ${employee?.lastName}` : null;
    const employeeFullName = employee?.fullName ? employee?.fullName : fullNameRaw;
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
                        <span className={styles.value}>{employeeFullName ?? "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Position:</span>
                        <span className={styles.value}>{employee?.position ?? "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Reports To:</span>
                        <span className={styles.value}>{employee?.reportsTo ?? "-"}</span>
                    </div>
                </div>
                <div className={styles.summary}>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Division Type:</span>
                        <span className={styles.value}>{employee?.division?.divisionType ?? "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Start Date:</span>
                        <span className={styles.value}>{employee?.startDate ? dayjs(employee?.startDate).format("DD/MM/YYYY") : "-"}</span>
                    </div>
                    <div className={styles.itemSummary}>
                        <span className={styles.label}>Work Location:</span>
                        <span className={styles.value}>{employee?.division?.location ?? "-"}</span>
                    </div>
                </div>
            </Col>
        </Row>
    );
};

const mapStateToProps = ({ onboarding }: ConnectState) => {
    return {
        employee: onboarding.selectedEmployee,
    }
}

export default connect(mapStateToProps)(EmployeeSummaryComponent);