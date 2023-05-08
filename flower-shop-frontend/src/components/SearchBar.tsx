import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { mainTheme as theme } from '../resources/themes';

const Search = styled('div')(() => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette?.primary?.light as string, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette?.primary?.light as string, 0.5)
  },
  margin: '10px',
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(1),
    width: 'auto'
  }
}));

const SearchIconWrapper = styled('div')(() => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white'
}));

const StyledInputBase = styled(InputBase)(() => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '40ch'
      }
    }
  }
}));

export default function SearchBar() {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase placeholder="Search…" inputProps={{ style: { color: 'white' }, 'aria-label': 'search' }} />
    </Search>
  );
}
