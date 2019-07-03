import { createMuiTheme } from '@material-ui/core/styles';

let grey = '#F0F2F3';

export const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#114599',
            main: '#103570',
            dark: '#15233b'
        },
        secondary: {
            light: '#cfe0fc',
            main: '#accbfc',
            dark: '#84b1fa'
        },
        text: {
            primary: '#000000',
            secondary: '#FFFFFF'
        },
        background: {
            default: grey
        }
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif"
    },
    overrides: {
        MuiFormLabel: {
            root: {
                color: '#000000'
            }
        },
        MuiModal: {
            root: {
                display: 'grid',
                alignItems: 'center',
                justifyItems: 'center',
                overflowY: 'auto'
            }
        },
        MuiTablePagination: {
            root: {
                color: 'black'
            }
        },
        MuiIconButton: {
            root: {
                padding: 4
            }
        }
    }
});
