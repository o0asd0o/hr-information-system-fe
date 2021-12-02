import React, { SetStateAction } from "react";
import { DivisionType } from "@/models/api/common/enums";
import { Radio } from "antd"
import classnames from "classnames";
import styles from "./index.less";

type Props = {
    setDivisionType: (divisionType: SetStateAction<DivisionType>) => void,
    value: DivisionType,
    customClass?: string,
};

const DivisionComponent:  React.FC<Props> = ({ setDivisionType, value, customClass }) => {
    return (
        <Radio.Group
          onChange={(event) => setDivisionType(event.target.value)}
          value={value}
          buttonStyle="solid"
          className={classnames(styles.container, customClass)}
        >
            <Radio.Button value={DivisionType.PMO}>PMO</Radio.Button>
            <Radio.Button value={DivisionType.MANPOWER}>Manpower</Radio.Button>
        </Radio.Group>
    );
}

export default DivisionComponent;