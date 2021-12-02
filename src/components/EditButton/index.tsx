import { CheckOutlined, FormOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useState } from "react";
import styles from "./index.less";

type EditButton = {
    onToggleEdit: () => void;
    isUpdating?: boolean;
};

enum ActionType {
    EDITING = "Editing",
    NOT_EDITING = "Not Editing",
};

const EditButton: React.FC<EditButton> = ({ onToggleEdit, isUpdating }) => {
    const [actionType, setActionType] = useState<ActionType>(ActionType.NOT_EDITING);

    const isEditingFields = actionType === ActionType.EDITING;
    const onButtonClick = () => {
        setActionType(isEditingFields ? ActionType.NOT_EDITING : ActionType.EDITING);
        onToggleEdit();
    }
    const icon = isEditingFields ? <CheckOutlined /> : <FormOutlined /> ;
    if (isUpdating) {
        return (
            <Button onClick={onButtonClick} className={styles.editButton} type={isEditingFields ? "primary" : "ghost"} icon={icon}>
                {`${isEditingFields ? "Done" : "Edit"}`}
            </Button>
        );
    }
    return null;
}
  
export default EditButton;