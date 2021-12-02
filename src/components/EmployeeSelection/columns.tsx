import React from "react";
import { ProColumns } from "@ant-design/pro-table";
import { EmployeeTableListItem } from '@/models/api/employee';
import { DivisionType, EmploymentStatus } from "@/models/api/common/enums";
import { Avatar } from "antd";
import dayjs from 'dayjs';

import styles from "./index.less";
import ActionComponent from "./ActionComponent";


export default (modelNameSpace: string, onExit: () => void, shouldGetEmployee?: boolean) : ProColumns<EmployeeTableListItem>[] => {
  return [
    {
      title: 'Profile',
      search: false,
      dataIndex: 'position',
      render: (_, entity) => {
        const { profilePicture } = entity;
        const sourcUrl = "http://localhost:4000/api/employee/images/" + profilePicture;
        return <Avatar size="small" className={styles.avatar} src={sourcUrl} alt="avatar" />
      },
    },
    {
      title: 'Employee ID',
      dataIndex: 'employeeIdNumber',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      search: false
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
    },
    {
      title: 'Contact #',
      dataIndex: 'contactNumber',
      search: false,
    },
    {
      title: 'Birth Date',
      dataIndex: 'birthDate',
      valueType: "date",
      search: false,
      render: (_, entity) => {
        const formattedDate = dayjs(entity['birthDate']).format("MMMM D, YYYY");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: 'Division Type',
      dataIndex: 'divisionType',
      valueEnum: DivisionType,
      search: false,
    },
    {
      title: 'Employment Status',
      dataIndex: 'employmentStatus',
      valueEnum: EmploymentStatus,
      search: false,
    },
    {
      title: 'Actions',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => (
        <ActionComponent employee={entity} model={modelNameSpace} onExit={onExit} shouldGetEmployee={shouldGetEmployee}/>
      ),
    },

  ];
};