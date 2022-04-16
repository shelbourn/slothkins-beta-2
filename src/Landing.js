import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

import Sloth from './Assets/sloth-icon-landing.png';

import './Landing.css';

function Landing() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate('/k-means-clustering');
    };

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
                    [ Exploring Machine Learning Algorithms for Crytocurrency
                    Portfolio Management Applications ]
                </Typography>
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1, 1.15, 1]
                    }}
                    transition={{
                        ease: 'linear',
                        duration: 5,
                        repeat: Infinity
                    }}
                >
                    <Button
                        variant="contained"
                        sx={{ mt: 8, mb: 6, height: 60, width: 200 }}
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </Button>
                </motion.div>
            </header>
        </div>
    );
}

export default Landing;
