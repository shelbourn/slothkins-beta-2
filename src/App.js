import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
// import logo from './logo.svg';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/* <img src={logo} className="App-logo" alt="logo" /> */}
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
            <Button variant="outlined">Some Text</Button>
            <Typography variant="h1">TEST</Typography>
        </div>
    );
}

export default App;
