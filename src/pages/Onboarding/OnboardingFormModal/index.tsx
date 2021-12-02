import React from "react";
import { EmployeeEntity, EmployeeTableListItem } from "@/models/api/employee";
import { OnboardingEntity, OnboardingTileItem } from "@/models/api/onboarding";
import { connect, Dispatch } from "umi";
import { Button, Card, Col, Form, Input, Image, message, Modal, Row, Typography,  } from "antd";
import FormItem from "antd/lib/form/FormItem";
import styles from "./index.less";
import { FormInstance } from "antd/lib/form";
import Avatar from '@/components/Upload';
import { getInitialValues } from "./util";
import { ConnectState } from "@/models/connect";

export type OnboardingFormModalProps = {
    onCancel: () => void;
    showDocumentFormModal?: boolean;
    submitting?: boolean;
    selectedDocument?: OnboardingTileItem & OnboardingEntity;
    selectedEmployee?: EmployeeTableListItem & EmployeeEntity;
    isUpdating?: boolean;
    dispatch: Dispatch;
    
};

interface OwnProps {
    onCancel: () => void;
    showDocumentFormModal: boolean;
}

const OnboardingFormModal : React.FC<OnboardingFormModalProps> = (props) => {
    const { onCancel, submitting, showDocumentFormModal, selectedDocument, selectedEmployee, isUpdating } = props;
    const [form] = Form.useForm();
    const formRef = React.createRef<FormInstance<any>>(); 

    const onFinish = (values: { [key: string]: any }) => {
        const dispatch = props.dispatch!;
        dispatch({
          type: `onboarding/${isUpdating ? "updateDocument" : "createDocument"}`,
          payload: values,
          employeeId: selectedEmployee?.identifier,
          documentId: selectedDocument?.identifier
        });
        onCancel();
    };
    
    const onFinishFailed = () => message.error("Please fill out all required fields!");

    const initialValues = getInitialValues({ ...props, isUpdating: isUpdating! });
    
    const sourcUrl = `http://localhost:4000/api/employee/images/${selectedEmployee?.profilePicture}`;
    const customDocumentImage = isUpdating ? selectedDocument?.image : "";

    return (
        <Form
            form={form}
            style={{ marginTop: 8 }}
            layout="vertical"
            name="basic"
            onFinish={onFinish}
            initialValues={initialValues}
            onFinishFailed={onFinishFailed}
            ref={formRef}
        > 
            <Modal
                width={1000}
                destroyOnClose
                title={isUpdating ? "Update Document of Employee" : "Create Document for Employee"}
                visible={showDocumentFormModal}
                footer={<>
                    <Button type="default" onClick={onCancel} key="59e25304">
                        Cancel
                    </Button>
                    <Button type="primary" onClick={() => form?.submit()} loading={submitting} key="61e2f746">
                        {`${isUpdating ? "Update Document" : "Add Document"}`}
                    </Button>
                </>}
                onCancel={() => onCancel()}
            >
                <Row gutter={16} className={styles.profile}>
                    {/** @ts-ignore */}
                    {!!selectedEmployee?.profilePicture ? <Image width={150} src={sourcUrl} /> : <Image width={200} src="/avatar/default-avatar.jpg" />}
                    <Typography.Title className={styles.name} level={4}>{selectedEmployee?.fullName}</Typography.Title>
                </Row>
                <Card className={styles.card}>
                    <Typography.Title level={5} >ONBOARDING DETAILS: </Typography.Title>
                    <br />
                    {/*<EditButton onToggleEdit={() => setEditingProfile(!editingProfile)} isUpdating={isUpdating} />*/}
                    <Row gutter={16} key="fb7c27fa">
                        <Col span={11} offset={2}>
                            <Row gutter={8}>
                                <FormItem name="documentName"
                                    labelCol={{ span: 24 }}
                                    label={"Document Name"}
                                    rules={[{ required: true, message: "Document Name is required" }]}
                                >
                                    <Input placeholder={"Enter Document Name"} />
                                </FormItem>
                            </Row>
                            <Row>
                                <FormItem name="description"
                                    label={"Document Description"}
                                    labelCol={{ span: 24 }}
                                >
                                    <Input.TextArea rows={2} placeholder={"Enter Document Description"} />
                                </FormItem>
                            </Row>
                        </Col>
                        <Col span={11}>
                            <FormItem name="documentImage" rules={[{ required: true, message: "Document Image is required" }]}>
                                <Avatar customImage={customDocumentImage} onChange={(info) => {
                                    form.setFields([{ name: "documentImage", value: info.file }])
                                }}/>
                            </FormItem>
                        </Col>
                    </Row>
                </Card>
            </Modal>
        </Form>
    )
};

const mapStateToProps = ({ onboarding, loading }: ConnectState, ownProps: OwnProps) => {
    return {
      selectedDocument: onboarding.selectedDocument,
      submitting: loading.effects["onboarding/createDocument"] || loading.effects["onboarding/updateDocument"],
      showDocumentFormModal: ownProps.showDocumentFormModal,
      selectedEmployee: onboarding.selectedEmployee,
      isUpdating: onboarding.isUpdating,
    };
};

const mapDispatchToProps = (dispatch : Dispatch, ownProps: OwnProps) => {
    return {
        onCancel: ownProps.onCancel,
        dispatch,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingFormModal);