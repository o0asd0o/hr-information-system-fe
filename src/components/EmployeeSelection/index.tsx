import React, { SetStateAction, useState, useRef, useEffect } from "react";
import { DivisionType } from "@/models/api/common/enums";
import { Card } from "antd";
import DivisionComponent from "../DivisionSelection";
import ProTable, { ActionType } from "@ant-design/pro-table";
import { EmployeeTableListItem } from "@/models/api/employee";
import { getAllEmployees } from "@/services/employee";
import getTableColumns from "./columns";
import styles from "./index.less";

type Props = {
    modelNamespace: string;
    onExit: () => void;
    shouldGetEmployee?: boolean;
};

const EmployeeSelection: React.FC<Props> = ({ modelNamespace, onExit, shouldGetEmployee }) => {
    const actionRef = useRef<ActionType>();
    const [divisionType, setDivisionType] = useState<DivisionType>(DivisionType.PMO);

    useEffect(() => actionRef.current?.reload(), [divisionType]);
    
    const columns =  getTableColumns(modelNamespace, onExit, shouldGetEmployee);

    return(
        <Card className={styles.wrapper}>
            <DivisionComponent customClass={styles.divisionStyle} value={divisionType} setDivisionType={(value: SetStateAction<DivisionType>) => setDivisionType(value)} />
            <ProTable<EmployeeTableListItem>
            headerTitle="Employe Record"
            size="small"
            actionRef={actionRef}
            rowKey="key"
            columns={columns}
            request={(params, sorter, filter) => {
                return getAllEmployees({ ...params, sorter, filter, divisionType });
            }}
            />
        </Card>
    )
};

export default EmployeeSelection;