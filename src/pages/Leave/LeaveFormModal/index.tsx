import React from "react";
import { Button, Card, Col, Modal, Row, Select, Form, message, InputNumber, Typography, Image, Input } from "antd";
import { connect, Dispatch } from "umi";
import { ConnectState } from "@/models/connect";
import { LeaveStatus, LeaveType } from "@/models/api/common/enums";
import { titleCase } from "title-case";
import { FormInstance } from "antd/lib/form";
import { LeaveTableListItem } from "@/models/api/leave";
import { getInitialValues, getTouchedValues } from "./util";
import DatePicker from "@/components/DatePicker";

import dayjs from "dayjs";
import { EmployeeTableListItem } from "@/models/api/employee";

import styles from "./index.less";

export interface LeaveFormModalProps {
    onCancel: () => void;
    showLeaveFormModal?: boolean;
    submitting?: boolean;
    selectedLeave?: LeaveTableListItem;
    selectedEmployee?: EmployeeTableListItem;
    leaveTypeItems?: LeaveType[];
    isUpdating?: boolean;
    dispatch: Dispatch;
};

interface OwnProps {
    onCancel: () => void;
    showLeaveFormModal: boolean;
}

type ValuesType = { [key: string]: string | dayjs.Dayjs[] };

const FormItem = Form.Item
const Option = Select.Option;

const LeaveFormModal : React.FC<LeaveFormModalProps> = (props) => {
    const { onCancel, submitting, showLeaveFormModal, selectedLeave, selectedEmployee, leaveTypeItems, isUpdating } = props;

    const [form] = Form.useForm();
    const formRef = React.createRef<FormInstance<any>>(); 

    const onFinish = (values: { [key: string]: any }) => {
        const dispatch = props.dispatch!;
        dispatch({
          type: `leave/${isUpdating ? "updateLeave" : "createLeave"}`,
          payload: values,
          employeeId: selectedEmployee?.employeeId,
          leaveId: selectedLeave?.identifier
        });
        onCancel();
    };

    const onValueChange = (changedValues: ValuesType) => {
        const [key, value] = Object.entries(changedValues)[0];

        if (key === "leaveRangeDate") {
            let [dateStart, dateEnd] = value as dayjs.Dayjs[];

            let daysToBePaidCounter = 0;
            while (dateStart.diff(dateEnd.add(1, "day")) !== 0) {
                if (dateStart.get("day") !== 0 && dateStart.get("day") !== 6) {
                    daysToBePaidCounter += 1;
                }
                dateStart = dateStart.add(1, "day");
            }
            // const totalDaysToBePaid = Math.abs(dateStart.diff(dateEnd.add(1, "day"), "day"));
            form.setFields([{ name: "totalDaysToBePaid", value: daysToBePaidCounter }]);
        }
    };
    
    const onFinishFailed = () => message.error("Please fill out all required fields!");

    const initialValues = getInitialValues({ ...props, isUpdating: isUpdating! });
    
    const sourcUrl = `http://localhost:4000/api/employee/images/${selectedEmployee?.profilePicture}`;

    return (
        <Form
            form={form}
            style={{ marginTop: 8 }}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            initialValues={initialValues}
            onFinishFailed={onFinishFailed}
            onValuesChange={onValueChange}
            ref={formRef}
        > 
            <Modal
                width={1000}
                destroyOnClose
                title={isUpdating ? "Update Leave of Employee" : "Create Leave for Employee"}
                visible={showLeaveFormModal}
                footer={<>
                    <Button type="default" onClick={onCancel} key="59e25404">
                        Cancel
                    </Button>
                    <Button type="primary" onClick={() => form?.submit()} loading={submitting} key="61e2ff46">
                        {`${isUpdating ? "Update Leave" : "Add Leave"}`}
                    </Button>
                </>}
                onCancel={() => onCancel()}
            >
                <Row gutter={16} className={styles.profile}>
                    {!!selectedEmployee?.profilePicture ? <Image width={150} src={sourcUrl} /> : <Image width={200} src="/avatar/default-avatar.jpg" />}
                    <Typography.Title className={styles.name} level={4}>{selectedEmployee?.fullName}</Typography.Title>
                </Row>
                <Card className={styles.card}>
                    <Typography.Title level={5} >LEAVE DETAILS: </Typography.Title>
                    <br />
                    {/*<EditButton onToggleEdit={() => setEditingProfile(!editingProfile)} isUpdating={isUpdating} />*/}
                    <Row gutter={16} key="fb7c27fa">
                        <Col span={11}>
                            <FormItem name="leaveType"
                            label={"Leave Type"}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: "Leave Type is required" }]}
                            >
                                <Select disabled={false /*!editingPersonalInfo*/} placeholder="Selecte Leave Type" tabIndex={4} >
                                    {leaveTypeItems?.map(leaveTypeItem => <Option value={leaveTypeItem}>{titleCase(leaveTypeItem)}</Option>)}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <Row gutter={8}>
                                <Col span={12}>
                                    <FormItem name="requestDate"
                                    labelCol={{ span: 24 }}
                                    label={"Request Date"}
                                    rules={[{ required: true, message: "Date of Birth is required" }]}
                                    >
                                        <DatePicker disabled={false /*!editingPersonalInfo*/} placeholder="Selecte Request Date" format="MMMM D, YYYY"/>
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem name="status"
                                    label="Leave Status"
                                    labelCol={{ span: 24 }}
                                    rules={[{ required: true, message: "Leave Status is required" }]}
                                    >
                                        <Select disabled={false /*!editingPersonalInfo*/} placeholder="Select Leave Status">
                                            <Option value={LeaveStatus.PENDING}>{titleCase(LeaveStatus.PENDING)}</Option>
                                            <Option value={LeaveStatus.APPROVED}>{titleCase(LeaveStatus.APPROVED)}</Option>
                                            <Option value={LeaveStatus.REJECTED}>{titleCase(LeaveStatus.REJECTED)}</Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={16} key="0516ff38">
                        <Col span={11}>
                            <FormItem name="totalDaysToBePaid"
                            label={"Total Days to be Paid"}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: "Total Days to be Paid is required" }]}
                            >
                                <InputNumber disabled max={100} />
                            </FormItem>
                        </Col>
                        <Col span={11} offset={2}>
                            <FormItem name="leaveRangeDate"
                            label={"Set Leave Duration (Start - End)"}
                            labelCol={{ span: 24 }}
                            rules={[{ required: true, message: "Total Days to be Paid is required" }]}
                            >
                                <DatePicker.RangePicker disabledDate={(currentDate) => currentDate.get("day") === 0 || currentDate.get("day") === 6} disabled={false /*!editingPersonalInfo*/} placeholder={["Leave Start Date", "Leave End Date"]} format="MMMM D, YYYY"/>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row gutter={16} key="1064d25c">
                        <Col span={24}>
                            <FormItem name="reasonForLeave"
                            label={"Reason for Leave"}
                            labelCol={{ span: 24 }}
                            >
                                <Input.TextArea rows={4} disabled={false /*!editingPersonalInfo*/} placeholder={"Enter Leave Reason"} />
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
            </Modal>
        </Form>
    )
};

const mapStateToProps = ({ leave, loading }: ConnectState, ownProps: OwnProps) => {

    const leaveTypeItems:LeaveType [] = [];
    if (leave.leaveSummary) {
        const { remainingServiceIncentiveLeaves, remainingVacationLeaves, remainingSickLeaves } = leave.leaveSummary;
        remainingServiceIncentiveLeaves >= 1 && leaveTypeItems.push(LeaveType.SERVICE_INCENTIVE_LEAVE);
        remainingVacationLeaves >= 1 && leaveTypeItems.push(LeaveType.VACATION_LEAVE);
        remainingSickLeaves >= 1 && leaveTypeItems.push(LeaveType.SICK_LEAVE);
    }

    return {
      selectedLeave: leave.selectedLeave,
      submitting: loading.effects["leave/createLeave"] || loading.effects["leave/updateLeave"],
      showLeaveFormModal: ownProps.showLeaveFormModal,
      selectedEmployee: leave.selectedEmployee,
      isUpdating: leave.isUpdating,
      leaveTypeItems
    };
};

const mapDispatchToProps = (dispatch : Dispatch, ownProps: OwnProps) => {
    return {
        onCancel: ownProps.onCancel,
        dispatch,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaveFormModal);


