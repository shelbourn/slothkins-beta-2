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

const theme = createTheme({
    palette: {
        primary: {
            main: '#5C6BC0'
        },
        secondary: {
            main: '#7E57C2'
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
