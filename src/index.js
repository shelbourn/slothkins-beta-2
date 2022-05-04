import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { ThemeProvider, createTheme } from '@mui/material/styles';

import './index.css';
import Routing from './Router/Routing';
import { storeContext, stores } from './Stores/StoreFunctions';

/***
 * theme - global app theming using Material UI
 */

const theme = createTheme({
    palette: {
        primary: {
            main: '#5C6BC0'
        },
        secondary: {
            main: '#7E57C2'
        },
        tertiary: '#9E9E9E'
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 968,
            lg: 1200,
            xl: 1536
        }
    }
});

ReactDOM.render(
    <storeContext.Provider value={stores}>
        <ThemeProvider theme={theme}>
            <Routing />
        </ThemeProvider>
    </storeContext.Provider>,
    document.getElementById('root')
);
