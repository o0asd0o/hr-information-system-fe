import React from "react";
import { ProColumns } from "@ant-design/pro-table";
import dayjs from 'dayjs';
import ActionsComponent from "./ActionsComponent";
import { LeaveTableListItem } from "@/models/api/leave";
import { Badge, Tag } from "antd";
import { LeaveStatus, LeaveType } from "@/models/api/common/enums";
import { PresetStatusColorType } from "antd/lib/_util/colors";
import { titleCase } from "title-case";

export default (setRow: (item: LeaveTableListItem) => void) : ProColumns<LeaveTableListItem>[] => {
  
  return [
    {
      title: 'Leave ID',
      search: false,
      dataIndex: 'leaveId',
    },
    {
      title: 'Leave Type',
      search: false,
      dataIndex: 'leaveType',
      render: (_, entity) => {
        const leaveTypeMapping = {
          [LeaveType.SERVICE_INCENTIVE_LEAVE]: "cyan",
          [LeaveType.SICK_LEAVE]: "magenta",
          [LeaveType.VACATION_LEAVE]: "blue",
        };

        return <Tag color={leaveTypeMapping[entity.leaveType]}>{titleCase(entity.leaveType)}</Tag>;
      },
    },
    {
      title: 'Status',
      search: false,
      dataIndex: 'status',
      render: (_, entity) => {
        const statusMapping = {
          [LeaveStatus.PENDING]: "processing",
          [LeaveStatus.APPROVED]: "success",
          [LeaveStatus.REJECTED]: "error",
        };

        return <Badge status={statusMapping[entity.status] as PresetStatusColorType} text={titleCase(entity.status)} />;
      },
    },
    {
      title: 'Total Days Paid',
      search: false,
      dataIndex: 'totalDaysPaid',
      render: (_, entity) => {
        return <span>{`${entity.totalDaysPaid} ${entity.totalDaysPaid > 1 ? "days" : "day"}`}</span>;
      },
    },
    {
      title: 'Date requested',
      dataIndex: 'requestDate',
      search: false,
      render: (_, entity) => {
        const formattedDate = dayjs(entity['requestDate']).format("MMMM D, YYYY");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: 'Leave Start Date',
      dataIndex: 'leaveStartDate',
      valueType: "date",
      search: false,
      render: (_, entity) => {
        const formattedDate = dayjs(entity['leaveStartDate']).format("MMMM D, YYYY");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: 'Leave End Date',
      dataIndex: 'leaveEndDate',
      valueType: "date",
      search: false,
      render: (_, entity) => {
        const formattedDate = dayjs(entity['leaveEndDate']).format("MMMM D, YYYY");
        return <span>{formattedDate}</span>;
      },
    },
    {
      title: 'Reason',
      dataIndex: 'reasonForLeave',
      search: false,
    },
    {
      title: 'Actions',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, entity) => (
        <ActionsComponent leave={entity} />
      ),
    },
  ];
};