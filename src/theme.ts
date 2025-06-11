import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#005E46', // verde Petrobras
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#FFB500', // amarelo Petrobras
            contrastText: '#000000',
        },
        info: {
            main: '#007078', // azul Petrobras
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#00A19A', // verde água Petrobras
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#E87722', // laranja Petrobras
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#7A7C7E', // cinza escuro Petrobras
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#CBDCE2', // cinza claro Petrobras
            paper: '#FFFFFF',
        },
        text: {
            primary: 'rgb(30 41 59 / var(--tw-bg-opacity, 1))', // azul escuro Petrobras
            secondary: '#7A7C7E',
        },
    },
    typography: {
        fontFamily: '"Trebuchet MS", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 700 },
        h5: { fontWeight: 700 },
        h6: { fontWeight: 700 },
        subtitle1: { fontWeight: 400 },
        subtitle2: { fontWeight: 400 },
        body1: { fontWeight: 400 },
        body2: { fontWeight: 400 },
        button: { fontWeight: 700, textTransform: 'none' },
        caption: { fontWeight: 400 },
        overline: { fontWeight: 400 },
    },
});
