import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import Sloth from './Assets/sloth-icon-landing.png';

import './Landing.css';

function Landing() {
    return (
        <div className="landing">
            <header className="main">
                <img src={Sloth} alt="Slothkins logo" />
                <Typography variant="h4" sx={{ mt: 5 }}>
                    welcome to
                </Typography>
                <Typography
                    variant="h2"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                >
                    SLOTHKINS BETA-2
                </Typography>
                <Typography variant="h5" color="secondary" sx={{ mt: 5 }}>
                    Exploring Machine Learning Algorithms for Crytocurrency
                    Portfolio Management Applications
                </Typography>
            </header>
        </div>
    );
}

export default Landing;
