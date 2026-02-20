import classes from "@/style/Grid.module.css";
import {
    IconDownload, IconEdit, IconTrash
} from "@tabler/icons-react";




export const EditCommandCell = (props: any) => {

    const handleEditClick = () => {
        if (props.editId != null) {
            props.enterEdit(null);
        } else {
            props.enterEdit(props.dataItem);
        }
    };

    const handleDeleteClick = () => {
        props.handleDelete(props.dataItem);
    };

    return (
        <td {...props.tdProps} className={classes.container}>
            <div className={classes.leftItem}>
                {(props.editId != null && props.editIndex === props.dataIndex) ?
                    <IconDownload className={classes.leftItem}
                                  onClick={handleEditClick}
                    /> :
                    <IconEdit className={classes.leftItem}
                              onClick={handleEditClick}
                    />
                }
            </div>
            <IconTrash
                className={classes.rightItem}
                color={"red"}
                onClick={handleDeleteClick}
            />
        </td>
    );
};
