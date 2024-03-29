import * as React from 'react';
import {useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {useNavigate} from 'react-router-dom';
import log from '../utils/logger';
import delay from '../utils/delay';
import {getBackendURL} from "../services/user.service";

interface DeleteDialogProps {
  productID: string | undefined;
  productName: string | undefined;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

export default function DeleteDialog(props: DeleteDialogProps) {
  const { productID, productName, open, setOpen } = props;
  const [deleteButtonText, setDeleteButtonText] = useState<string>('Delete');
  const navigate = useNavigate();
  
  const handleCancel = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    if (productID) {
      setDeleteButtonText('Deleting...');
      await fetch(`${getBackendURL()}/api/products/${productID}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('jwtToken') ?? ''}`
        }
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`ERROR ${response.status}`);
          setDeleteButtonText('Deleted!');
          await delay(1000);
          setDeleteButtonText('Delete');
          log('Success deleting product.');
          setOpen(false);
          navigate(-1);
          return response;
        })
        .catch((error: Error) => {
          setDeleteButtonText('Delete');
          log(`Error when trying to delete product: ${error.message}`);
        });
    }
  };

  return (
    <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{`Delete item "${productName || ''}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This action cannot be undone. {productName || ''} will be permanently deleted and will not be available to online
          customers.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button
          onClick={() => {
            setDeleteButtonText('Deleting...');
            handleDelete();
          }}
          autoFocus
        >
          {deleteButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
