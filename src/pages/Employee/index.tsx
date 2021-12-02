import React, { SetStateAction, useRef, useEffect, useState } from 'react';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message, Drawer } from 'antd';
import DivisionComponent from '@/components/DivisionSelection';
import ProTable, { ActionType } from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
import ProDescriptions from '@ant-design/pro-descriptions';
import { EmployeeTableListItem } from '@/models/api/employee';
import { getAllEmployees } from '@/services/employee';
import { connect, Dispatch, history } from 'umi';
import employeeTableColumns from "./employeeTableColumns";
import { DivisionType } from '@/models/api/common/enums';
import DeleteModal from './DeleteModal';
import { ConnectState } from '@/models/connect';

const handleRemove = async (selectedRows: EmployeeTableListItem[]) => {
  const hide = message.loading('Deleting record...');
  if (!selectedRows) return true;
  try {
    // await removeEmployees({
    //   employeeIdNumbers: selectedRows.map((row) => row.employeeIdNumber),
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

type EmployeesProps = {
  dispatch: Dispatch;
  showDeleteModal?: boolean;
}

const EmployeesPage: React.FC<EmployeesProps> = ({ dispatch, showDeleteModal }) => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<EmployeeTableListItem>();
  const [divisionType, setDivisionType] = useState<DivisionType>(DivisionType.PMO);
  const [selectedRowsState, setSelectedRows] = useState<EmployeeTableListItem[]>([]);

  useEffect(() => actionRef.current?.reload(), [divisionType]);
  
  const columns = employeeTableColumns(setRow);

  const onDelete = (employeeIdNumber: string) => {
    dispatch({ type: 'employee/deleteEmployee', payload: { employeeIdNumber } });
    actionRef.current?.reloadAndRest?.();
  };

  const onCancelDelete = () => {
    dispatch({ type: 'employee/hideModalForDelete' });
  };

  return (
    <PageContainer>
      <DivisionComponent value={divisionType} setDivisionType={(value: SetStateAction<DivisionType>) => setDivisionType(value)} />
      <Card>
        {showDeleteModal && <DeleteModal onSubmit={onDelete} onCancel={onCancelDelete} />}
        <ProTable<EmployeeTableListItem>
          headerTitle="Employe Record"
          actionRef={actionRef}
          rowKey="key"
          columns={columns}
          search={{
            labelWidth: 120,
          }}
          toolBarRender={() => [
            <Button type="primary" onClick={() => {
              history.push("/manage/add-employee");
              dispatch({ type: "employee/removeSelectedEmployee" })
            }}>
              <PlusOutlined /> New Employee
            </Button>,
          ]}
          request={(params, sorter, filter) => {
            return getAllEmployees({ ...params, sorter, filter, divisionType });
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
        {row?.fullName && (
          <ProDescriptions<EmployeeTableListItem>
            column={2}
            title={row?.fullName}
            request={async () => await ({ 
              data: { ...row } || {},
            })}
            params={{
              employeeIdNumber: row?.employeeIdNumber,
            }}
            columns={columns}
          />
          )}
      </Drawer>
      </Card>
    </PageContainer>
  );
};

const mapStateToProps = ({ employee }: ConnectState) => ({
  showDeleteModal: employee.showDeleteModal,
});

export default connect(mapStateToProps)(EmployeesPage);
