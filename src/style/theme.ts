import { createMuiTheme } from '@material-ui/core/styles';
import { orange } from '@material-ui/core/colors';

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
        secondary: orange
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
    }
});
