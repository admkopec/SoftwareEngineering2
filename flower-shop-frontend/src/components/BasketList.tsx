import IconButton from '@mui/material/IconButton';
import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import TextField from '@mui/material/TextField';
import { BasketItem } from '../resources/types';
import FloweryImage from './FloweryImage';

interface BasketListProps {
  basketItems?: BasketItem[];
  dense: boolean;
  maxHeight?: string;
}

export default function BasketList(props: BasketListProps){

  const generateItems = () => {
    if (props.basketItems)
      return props.basketItems.map((basketItem: BasketItem, index) => <ListItem
          secondaryAction={
            <>
              <TextField
                id="outlined-number"
                label="Quantity"
                type="number"
                variant="filled"
                size="small"
                defaultValue={basketItem.quantity}
                aria-valuemax={basketItem.product.quantity}
                sx={{ maxWidth: '70px', m: 2 }}
              />
              <IconButton edge="end" aria-label="delete item">
                <ClearRoundedIcon />
              </IconButton>
            </>
          }
          key={index}
        >
          <ListItemAvatar>
            <Avatar variant="rounded" alt="Item avatar" sx={{backgroundColor: 'transparent'}}>
              <FloweryImage src={`data:image/png;base64,${basketItem?.product.image || ''}`} width="auto" height="fit-content"/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={basketItem?.product.name || 'A product'}
          />
        </ListItem>);
    return false;
  }

  return (
    <List dense={props.dense} sx={{overflow: 'auto', maxHeight: props.maxHeight || '200px'}} id={"basket-list"}
          role={"basket-list"}>
      {generateItems()}
    </List>
  );
}