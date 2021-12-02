import React, { useState, useRef, useEffect } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Drawer, message } from 'antd';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { LeaveTableListItem } from '@/models/api/leave';
import { PlusOutlined } from '@ant-design/icons';
import { connect, Dispatch, history } from "umi";
import ProDescriptions from '@ant-design/pro-descriptions';
import leaveTableColumns from './leaveTableColumns';
import LeaveSummary from "./LeaveSummary";
import styles from "./index.less";
import { ConnectState } from '@/models/connect';
import { getAllLeaves } from '@/services/leave';
import SelectEmployeeModal from "./SelectEmployeeModal";
import { EmployeeTableListItem } from '@/models/api/employee';
import LeaveFormModal from './LeaveFormModal';
import DeleteModal from './DeleteModal';


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

type LeaveProps = {
  dispatch: Dispatch;
  selectedEmployee: EmployeeTableListItem;
  disableLeaveButton: boolean;
  showLeaveFormModal: boolean;
  showDeleteLeaveModal: boolean;
  submitting: boolean;
}

const LeavesPage: React.FC<LeaveProps> = ({
  dispatch,
  submitting,
  selectedEmployee,
  disableLeaveButton,
  showLeaveFormModal,
  showDeleteLeaveModal
}) => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<LeaveTableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<LeaveTableListItem[]>([]);

  const [showEmployeeModal, setShowEmployeeModal] = useState<boolean>(false);

  useEffect(() => actionRef.current?.reload(), [selectedEmployee?.employeeId, submitting]);
  
  const columns = leaveTableColumns(setRow);

  const onHideEmployeeModal = () => setShowEmployeeModal(false);

  const onDelete = (leaveId: number) => {
    dispatch({ type: 'leave/deleteLeave', payload: { leaveId, employeeId: selectedEmployee.employeeId } });
  };

  const onShowAddLeaveFormModal = () => dispatch({ type: "leave/showAddLeaveFormModal" });
  const onHideLeaveFormModal = () => dispatch({ type: "leave/hideLeaveFormModal" });
  const onHideDeleteLeaveModal = () => dispatch({ type: "leave/hideDeleteLeaveModal"});

  return (
    <PageContainer>
      <Card>
        <Button className={styles.selectEmployee} onClick={() => setShowEmployeeModal(true)} type="primary">Select Employee</Button>
        <LeaveSummary />
        {showDeleteLeaveModal && <DeleteModal onSubmit={onDelete} deleteModalVisible={showDeleteLeaveModal} onCancel={onHideDeleteLeaveModal} />}
        {showEmployeeModal && <SelectEmployeeModal showEmployeeModal={showEmployeeModal} onCancel={onHideEmployeeModal} />}
        {showLeaveFormModal && <LeaveFormModal showLeaveFormModal={showLeaveFormModal} onCancel={onHideLeaveFormModal} />}
        <ProTable<LeaveTableListItem>
          headerTitle="Leave Record"
          actionRef={actionRef}
          rowKey="key"
          columns={columns}
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button disabled={disableLeaveButton} type="primary" onClick={onShowAddLeaveFormModal}>
              <PlusOutlined /> Issue Leave
            </Button>,
          ]}
          request={(params, sorter, filter) => {
            return getAllLeaves({ ...params, sorter, filter, employeeId: selectedEmployee?.employeeId });
          }}
          rowSelection={{
            onChange: (_, selectedRows) => setSelectedRows(selectedRows),
          }}
        />
        {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              chosen <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> item&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Bulk delete
          </Button>
        </FooterToolbar>
      )}
      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.leaveId && (
          <ProDescriptions<LeaveTableListItem>
            column={2}
            title="Leave Request"
            request={async () => await ({ 
              data: { ...row } || {},
            })}
            params={{
              leaveId: row?.leaveId,
            }}
            columns={columns}
          />
          )}
      </Drawer>
      </Card>
    </PageContainer>
  );
};

const mapStateToProps = ({ leave, loading }: ConnectState) => {
  const { leaveSummary } = leave;
  const { effects } = loading;

  let disableLeaveButton = parseInt(leaveSummary?.remainingServiceIncentiveLeaves.toString() || "0") === 0;
  disableLeaveButton = disableLeaveButton && parseInt(leaveSummary?.remainingSickLeaves.toString() || "0") === 0;
  disableLeaveButton = disableLeaveButton && parseInt(leaveSummary?.remainingVacationLeaves.toString() || "0") === 0;

  return {
    selectedEmployee: leave.selectedEmployee,
    disableLeaveButton: !leaveSummary || disableLeaveButton,
    showLeaveFormModal: leave.showLeaveFormModal,
    showDeleteLeaveModal: leave.showDeleteLeaveModal,
    submitting: effects['leave/createLeave'] || effects['leave/updateLeave'] || effects['leave/deleteLeave'],
  }
}

export default connect(mapStateToProps)(LeavesPage);
