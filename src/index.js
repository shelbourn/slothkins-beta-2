import React from 'react';
import ReactDOM from 'react-dom';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
// import App from './App';
import Routing from './Router/Routing';
import { storeContext, stores } from './Stores/StoreFunctions';

ReactDOM.render(
    <storeContext.Provider value={stores}>
        <Routing />
    </storeContext.Provider>,
    document.getElementById('root')
);
