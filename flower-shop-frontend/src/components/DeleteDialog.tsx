import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Product} from "../resources/types";
import {IS_DEV} from "../resources/constants";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

interface DeleteDialogProps{
    productId: string | undefined,
    productName: string | undefined,
    open: boolean,
    setOpen: (isOpen: boolean) => void,
}

export default function DeleteDialog(props: DeleteDialogProps) {
    const [deleteButtonText, setDeleteButtonText] = useState<string>('Delete');
    const navigate = useNavigate();
    const handleCancel = () => {
        props.setOpen(false);
    };

    const handleDelete = async () => {
        await fetch(`/api/products/${props.productId}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}`,
            }})
            .then((response) => {
                if (response.ok) return response.json();
                throw new Error(`ERROR ${response.status}`);
            })
            .then((responseJSON: Product) => {
                IS_DEV && console.log('Success deleting product.');
                IS_DEV && console.log(responseJSON);
            })
            .catch((e) => {
                IS_DEV && console.log(`Error when trying to delete product: ${e}`);
            });
        props.setOpen(false);
    };

    return (
        <>
            <Dialog
                open={props.open}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {`Delete item "${props.productName}?`}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone. {props.productName} will be permanently deleted and will not be available to
                        online customers.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancel</Button>
                    <Button onClick={(event) => {
                        setDeleteButtonText('Deleting...');
                        handleDelete().finally();
                        navigate(-1);
                    }} autoFocus>
                        {deleteButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}