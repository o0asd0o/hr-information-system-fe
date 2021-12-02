import React from "react";
import { Button, Modal } from "antd";
import { EmployeeEntity, EmployeeTableListItem } from "@/models/api/employee";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";

export interface DeleteModalProps {
    onCancel: () => void;
    onSubmit: (employeeIdNumber: string) => void;
    deleteModalVisible?: boolean;
    employeeFields?: EmployeeEntity & EmployeeTableListItem;
    deleting?: boolean;
};

interface OwnProps {
    onCancel: () => void;
    onSubmit: (employeeIdNumber: string) => void;
}

const DeleteModal : React.FC<DeleteModalProps> = ({ onCancel, onSubmit, deleting, deleteModalVisible, employeeFields }) => {
    return <Modal
        width={400}
        destroyOnClose
        title="Confirm Deletion"
        visible={deleteModalVisible}
        footer={<>
            <Button loading={deleting} onClick={() => onSubmit(employeeFields?.employeeIdNumber!)}>
                Yes
            </Button>
            <Button type="primary" onClick={onCancel}>
                Cancel
            </Button>
        </>}
        onCancel={() => onCancel()}
    >
        Are you sure you want to remove <b>{employeeFields?.fullName}</b> on employee list?
    </Modal>
};

const mapStateToProps = ({ employee, loading }: ConnectState) => {
    return {
      deleteModalVisible: employee.showDeleteModal,
      employeeFields: employee.selectedEmployee,
      deleting: loading.effects["employee/deleteEmployee"],
    };
};

const mapDispatchToProps = (_:any, ownProps: OwnProps) => {
    return {
        onCancel: ownProps.onCancel,
        onSubmit: ownProps.onSubmit,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);


