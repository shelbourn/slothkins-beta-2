import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';

import Sloth from './Assets/sloth-icon-landing.png';

import './Landing.css';

function Landing() {
    const navigate = useNavigate();

    /***
     * Component handler
     */

    const handleGetStarted = () => {
        navigate('/k-means-clustering');
    };

    return (
        <div className="landing">
            <header className="main">
                <img src={Sloth} alt="Slothkins logo" />
                <motion.div
                    className="landingHeader"
                    key={'landingHeader'}
                    initial={{
                        y: -1000
                    }}
                    animate={{ y: 0, opacity: [0, 0.5, 1] }}
                    transition={{
                        ease: 'easeIn',
                        duration: 1,
                        type: 'spring',
                        delay: 0.5
                    }}
                >
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
                </motion.div>
                <motion.div
                    className="landingSubtitle"
                    key={'landingSubtitle'}
                    initial={{
                        y: 1000
                    }}
                    animate={{ y: 0, opacity: [0, 0.5, 1] }}
                    transition={{
                        ease: 'easeIn',
                        duration: 1,
                        type: 'spring',
                        delay: 2
                    }}
                >
                    <Typography variant="h6" color="secondary" sx={{ mt: 2 }}>
                        [ Exploring Machine Learning Algorithms for
                        Crytocurrency Portfolio Management Applications ]
                    </Typography>
                </motion.div>
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
                        sx={{ mt: 6, mb: 6, height: 60, width: 200 }}
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
