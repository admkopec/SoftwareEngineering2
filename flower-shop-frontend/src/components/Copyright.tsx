import { SxProps, Theme } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {alpha, styled} from "@mui/material/styles";
import {mainTheme as theme} from "../resources/themes";
import Grid from "@mui/material/Grid";


export default function Copyright(sx: SxProps<Theme>) {
  return (
    <Box sx={{ pt: 5 }} >
      <Typography variant="body2" color='white' align="center" sx={sx}>
        {'Copyright © '}Flower Shop {new Date().getFullYear()}.
      </Typography>
    </Box>
  );
}
