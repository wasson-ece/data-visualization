import { createMuiTheme } from '@material-ui/core/styles';
import { red, purple, green } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
        secondary: purple,
        primary: green
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
    }
});
