import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Empty, Image, message } from 'antd';
import { LeaveTableListItem } from '@/models/api/leave';
import { connect, Dispatch } from "umi";
import EmployeeSummary from "./EmployeeSummary";
import styles from "./index.less";
import { ConnectState } from '@/models/connect';
import SelectEmployeeModal from "./SelectEmployeeModal";
import { EmployeeEntity, EmployeeTableListItem } from '@/models/api/employee';
import OnboardingFormModal from './OnboardingFormModal';
import DeleteModal from './DeleteModal';
import { PlusOutlined } from '@ant-design/icons';
import { OnboardingEntity } from '@/models/api/onboarding';

const handleRemove = async (selectedRows: LeaveTableListItem[]) => {
  const hide = message.loading('Deleting record...');
  if (!selectedRows) return true;
  try {
    // await removeEmployees({
    //   leaveIds: selectedRows.map((row) => row.leaveId),
    // });
    hide();
    message.success('Deleted successfully, will refresh soon');
    return true;
  } catch (error) {
    hide();
    message.error('Deletion failed, please try again');
    return false;
  }
};

type OnboardingProps = {
  dispatch: Dispatch;
  documents: OnboardingEntity[];
  selectedEmployee: EmployeeTableListItem & EmployeeEntity;
  showDocumentFormModal: boolean;
  showDeleteDocumentModal: boolean;
  submitting: boolean;
}

const OnboardingPage: React.FC<OnboardingProps> = ({
  dispatch,
  documents,
  submitting,
  selectedEmployee,
  showDocumentFormModal,
  showDeleteDocumentModal
}) => {

  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);

  useEffect(() => {
    dispatch({
      type: "onboarding/getEmployeeDocuments",
      payload: { employeeId: selectedEmployee?.identifier }
    })
  }, [selectedEmployee?.identifier, submitting]);
  
  const onHideEmployeeModal = () => setShowEmployeeModal(false);

  const onDelete = (leaveId: number) => {
    dispatch({ type: 'leave/deleteLeave', payload: { leaveId, employeeId: selectedEmployee.employeeId } });
  };

  const onShowAddDocumentFormModal = () => dispatch({ type: "onboarding/showAddDocumnetFormModal" });
  const onHideDocumentFormModal = () => dispatch({ type: "onboarding/hideDocumentFormModal" });
  const onHideDeleteDocumentModal = () => dispatch({ type: "onboarding/hideDeleteDocumentModal"});

  const getSourcUrl = (imageUrl: string) => `http://localhost:4000/api/documents/images/${imageUrl}`;
  return (
    <PageContainer>
      <Card>
        <Button className={styles.selectEmployee} onClick={() => setShowEmployeeModal(true)} type="primary">Select Employee</Button>
        <EmployeeSummary />
        {showDeleteDocumentModal && <DeleteModal onSubmit={onDelete} deleteModalVisible={showDeleteDocumentModal} onCancel={onHideDeleteDocumentModal} />}
        {showEmployeeModal && <SelectEmployeeModal showEmployeeModal={showEmployeeModal} onCancel={onHideEmployeeModal} />}
        {showDocumentFormModal && <OnboardingFormModal showDocumentFormModal={showDocumentFormModal} onCancel={onHideDocumentFormModal} />}
        <Card className={styles.documentContainer} title="Onboarding Documents">
          <Button disabled={!selectedEmployee?.identifier} className={styles.addDocument} type="primary" onClick={() => onShowAddDocumentFormModal()}>
            <PlusOutlined /> Add Document
          </Button>
          {documents.length > 0 ? (
            <div className={styles.documents}>
            {documents.map((document: OnboardingEntity) => {
              return (
                <div className={styles.documentItem}>
                  <Image className={styles.documentImage} height={200} width={200} src={getSourcUrl(document.image)} />
                  <p className={styles.documentName}>{document.name}</p>
                </div>
              )
            })}
          </div>
          ) : null}
          {documents.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : null}
        </Card>
      </Card>
    </PageContainer>
  );
};

const mapStateToProps = ({ onboarding, loading }: ConnectState) => {
  const { effects } = loading;

  return {
    documents: onboarding.documents,
    selectedEmployee: onboarding.selectedEmployee,
    disableAddButton: !onboarding.selectedEmployee,
    showDocumentFormModal: onboarding.showDocumentFormModal,
    showDeleteDocumentModal: onboarding.showDeleteDocumentModal,
    submitting: effects['onboarding/createDocument'] || effects['onboarding/updateDocument'] || effects['onboarding/deleteDocument'],
  }
}

export default connect(mapStateToProps)(OnboardingPage);
