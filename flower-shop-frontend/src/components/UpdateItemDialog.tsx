import * as React from 'react';
import { ReactElement, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import CircularProgress from '@mui/material/CircularProgress';
import { updateOrderStatus } from '../services/order.service';
import { OrderStatus } from '../resources/constants';
import log from '../utils/logger';
import { deleteProduct } from '../services/product.service';

export type AvailableActions = 'acceptOrder' | 'declineOrder' | 'deliverOrder' | 'deleteProduct';

interface UpdateDialogProps {
  orderID?: string;
  productID?: string;
  currentStatus?: string;
  action: AvailableActions | undefined;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

interface DialogActionProps {
  dialogTitle: string;
  dialogContents: ReactElement;
  dialogPerformActionButtonText: string;
  dialogActionCallback: () => void;
}

export default function UpdateItemDialog(props: UpdateDialogProps) {
  const { orderID, productID, currentStatus, action, open, setOpen } = props;
  const [dialogProperties, setDialogProperties] = React.useState<DialogActionProps>();
  const [isActionBeingExecuted, setIsActionBeingExecuted] = React.useState<boolean>(false);

  const handleCancel = () => {
    setOpen(false);
  };

  const handleDialogProperties = () => {
    if (action === 'acceptOrder' && orderID)
      setDialogProperties({
        dialogTitle: `Accept order #${orderID.slice(0, 5)} for execution?`,
        dialogContents: (
          <Typography>
            You are about to change the chosen order status from {currentStatus} to Accepted. The user will be notified.
            Do you want to perform this action?
          </Typography>
        ),
        dialogPerformActionButtonText: 'Accept',
        dialogActionCallback: () => {
          setIsActionBeingExecuted(true);
          updateOrderStatus(OrderStatus.Accepted, orderID)
            .then(() => {
              setIsActionBeingExecuted(false);
              return true;
            })
            .catch((error: Error) => {
              log(`Error when trying to update order status: ${error.message}`);
            });
          window.location.reload();
        }
      });
    if (action === 'declineOrder' && orderID)
      setDialogProperties({
        dialogTitle: `Decline order #${orderID.slice(0, 5)}?`,
        dialogContents: (
          <Typography>
            You are about to change the chosen order status from {currentStatus} to Declined. The user will be notified.
            Do you want to perform this action?
          </Typography>
        ),
        dialogPerformActionButtonText: 'Decline',
        dialogActionCallback: () => {
          setIsActionBeingExecuted(true);
          updateOrderStatus(OrderStatus.Declined, orderID)
            .then(() => {
              setIsActionBeingExecuted(false);
              return true;
            })
            .catch((error: Error) => {
              log(`Error when trying to update order status: ${error.message}`);
            });
          window.location.reload();
        }
      });
    if (action === 'deliverOrder' && orderID)
      setDialogProperties({
        dialogTitle: `Mark order #${orderID.slice(0, 5)} as delivered?`,
        dialogContents: (
          <Typography>
            You are about to change the chosen order status from {currentStatus} to Delivered. The user will be
            notified. Do you want to perform this action?
          </Typography>
        ),
        dialogPerformActionButtonText: 'Mark as delivered',
        dialogActionCallback: () => {
          setIsActionBeingExecuted(true);
          updateOrderStatus(OrderStatus.Delivered, orderID)
            .then(() => {
              setIsActionBeingExecuted(false);
              return true;
            })
            .catch((error: Error) => {
              log(`Error when trying to update order status: ${error.message}`);
            });
          window.location.reload();
        }
      });
    if (action === 'deleteProduct' && productID)
      setDialogProperties({
        dialogTitle: `Delete product #${productID.slice(0, 5)}?`,
        dialogContents: (
          <Typography>
            You are about to delete the product entirely from the database. This action cannot be undone. Do you want to
            delete it anyway?
          </Typography>
        ),
        dialogPerformActionButtonText: 'Delete',
        dialogActionCallback: () => {
          setIsActionBeingExecuted(true);
          deleteProduct(productID)
            .then(() => {
              setIsActionBeingExecuted(false);
              return true;
            })
            .catch((error: Error) => {
              log(`Error when trying to delete product: ${error.message}`);
            });
          window.location.reload();
        }
      });
    return new Error('Given action is not valid.');
  };

  useEffect(() => {
    handleDialogProperties();
  }, [action]);

  return (
    <Dialog open={open} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">{dialogProperties?.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{dialogProperties?.dialogContents}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} autoFocus>
          Cancel
        </Button>
        <LoadingButton
          onClick={() => {
            dialogProperties?.dialogActionCallback();
          }}
          loading={isActionBeingExecuted}
          loadingIndicator={<CircularProgress color="primary" size={20} />}
        >
          {dialogProperties?.dialogPerformActionButtonText}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
