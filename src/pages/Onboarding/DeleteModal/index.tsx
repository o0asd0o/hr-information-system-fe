import React from "react";
import { Button, Modal } from "antd";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";
import { LeaveEntity, LeaveTableListItem } from "@/models/api/leave";
import { OnboardingTileItem } from "@/models/api/onboarding";

export interface DeleteModalProps {
    onCancel: () => void;
    onSubmit: (leaveId: number) => void;
    deleteModalVisible?: boolean;
    onboardingFields?: OnboardingTileItem;
    deleting?: boolean;
};

interface OwnProps {
    onCancel: () => void;
    onSubmit: (documentId: number) => void;
}

const DeleteModal : React.FC<DeleteModalProps> = ({ onCancel, onSubmit, deleting, deleteModalVisible, onboardingFields }) => {
    return <Modal
        width={400}
        destroyOnClose
        title="Confirm Deletion"
        visible={deleteModalVisible}
        footer={<>
            <Button loading={deleting} onClick={() => onSubmit(onboardingFields?.documentId!)}>
                Yes
            </Button>
            <Button type="primary" onClick={onCancel}>
                Cancel
            </Button>
        </>}
        onCancel={() => onCancel()}
    >
        Are you sure you want to remove this document?
    </Modal>
};

const mapStateToProps = ({ onboarding, loading }: ConnectState) => {
    return {
      documentFields: onboarding.selectedDocument,
      deleting: loading.effects["onboarding/deleteDocument"],
    };
};

const mapDispatchToProps = (_:any, ownProps: OwnProps) => {
    return {
        onCancel: ownProps.onCancel,
        onSubmit: ownProps.onSubmit,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteModal);


