import { createMuiTheme } from '@material-ui/core/styles';
import { purple, teal } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
        secondary: purple,
        primary: teal
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
    }
});
