import React from "react";
import { Button, Modal } from "antd";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";
import { LeaveEntity, LeaveTableListItem } from "@/models/api/leave";

export interface DeleteModalProps {
    onCancel: () => void;
    onSubmit: (leaveId: number) => void;
    deleteModalVisible?: boolean;
    leaveFields?: LeaveEntity & LeaveTableListItem;
    deleting?: boolean;
};

interface OwnProps {
    onCancel: () => void;
    onSubmit: (leaveId: number) => void;
}

const DeleteModal : React.FC<DeleteModalProps> = ({ onCancel, onSubmit, deleting, deleteModalVisible, leaveFields }) => {
    return <Modal
        width={400}
        destroyOnClose
        title="Confirm Deletion"
        visible={deleteModalVisible}
        footer={<>
            <Button loading={deleting} onClick={() => onSubmit(leaveFields?.leaveId!)}>
                Yes
            </Button>
            <Button type="primary" onClick={onCancel}>
                Cancel
            </Button>
        </>}
        onCancel={() => onCancel()}
    >
        Are you sure you want to remove this leave?
    </Modal>
};

const mapStateToProps = ({ leave, loading }: ConnectState) => {
    return {
      leaveFields: leave.selectedLeave,
      deleting: loading.effects["leave/deleteLeave"],
    };
};

const mapDispatchToProps = (_:any, ownProps: OwnProps) => {
    return {
        onCancel: ownProps.onCancel,
        onSubmit: ownProps.onSubmit,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);


