import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Box from '@mui/material/Box';
import * as React from 'react';
import {useEffect} from 'react';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Button from '@mui/material/Button';
import {useNavigate} from 'react-router-dom';
import {BasketItem} from '../resources/types';
import {fetchBasket} from '../services/product.service';
import log from '../utils/logger';
import BasketList from './BasketList';

export default function Basket(){
  const [basketOpen, setBasketOpen] = React.useState<boolean>(false);
  const [basketData, setBasketData] = React.useState<BasketItem[]>([]);
  const navigate = useNavigate();
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleOpenBasket = () => {
    setBasketOpen((prevOpen) => !prevOpen);
  };

  const handleBasketClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setBasketOpen(false);
  };

  const handleBasketFetch = () => {
      fetchBasket()
          .then((responseJSON: BasketItem[]) => {
              log('Success fetching basket.');
              log(JSON.stringify(responseJSON));
              setBasketData(responseJSON);
              return responseJSON;
          })
          .catch((error: Error) => {
              log(`Error when trying to fetch product: ${error.message}`);
          });
  }

  useEffect(() => {
    if (basketOpen){
        handleBasketFetch();
    }
  }, [basketOpen]);

  return (
    <React.Fragment>
      <Box sx={{ flexGrow: 0 }} ref={anchorRef}>
        <Tooltip title="Show items in your basket" sx={{ p: 0 }}>
          <IconButton onClick={handleOpenBasket} sx={{ p: 0 }}>
            <ShoppingBagIcon fontSize="large" sx={{ color: 'white' }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Popper
        sx={{
          zIndex: 1000,
          width: 'min(100%, 400px)',
          minHeight: '200px'
        }}
        open={basketOpen}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleBasketClose}>
                {basketData.length > 0 ?
                  <Box sx={{m: '0 auto', p: 1 }}>
                    <BasketList dense={true} basketItems={basketData} refetch={handleBasketFetch}/>
                    <Button
                      type="button"
                      variant="text"
                      size="small"
                      onClick={() => navigate('/order')}
                      sx={{ m: 2 }}
                    >
                      Proceed to checkout
                    </Button>
                  </Box>
                : <Typography sx={{p: '2%'}}>Your basket is empty!</Typography>}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
}