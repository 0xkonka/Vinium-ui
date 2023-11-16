import { createTheme } from '@mui/material/styles';
import colors from './base/colors';
import typography from './base/typography';
let theme = createTheme({
  palette: { ...colors },
  typography: { ...typography },
});

export default theme;
