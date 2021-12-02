import React from "react";
import { Button, Modal } from "antd";
import { connect } from "umi";
import EmployeeSelection from "@/components/EmployeeSelection";

export interface EmployeeModalProps {
    onCancel: () => void;
    employeeModalVisible?: boolean;
};

interface OwnProps {
    onCancel: () => void;
    showEmployeeModal: boolean;
}

const SelectEmployeeModal : React.FC<EmployeeModalProps> = ({ onCancel, employeeModalVisible }) => {
    return <Modal
        width={1200}
        destroyOnClose
        title="Select Employee"
        visible={employeeModalVisible}
        onCancel={onCancel}
        footer={<Button type="ghost" onClick={onCancel}>
            Cancel
        </Button>}
    >
        <EmployeeSelection modelNamespace="onboarding" onExit={onCancel} shouldGetEmployee />
    </Modal>
};

const mapStateToProps = (_: any, ownProps: OwnProps) => {
    return {
        employeeModalVisible: ownProps.showEmployeeModal,
    };
};

const mapDispatchToProps = (_:any, ownProps: OwnProps) => {
    return {
        onCancel: ownProps.onCancel,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectEmployeeModal);


