import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Image from 'material-ui-image';
import MyBaby from '../Assets/MyBaby.jpg';
import './_styles/EndpointTest.css';

const EndpointTest = () => {
    // const [users, setUsers] = useState({});
    const [isJerryTrue, setIsJerryTrue] = useState(false);

    const handleClick = async () => {
        try {
            const response = await axios.get(
                'https://slothkins-beta-2.herokuapp.com/crypto-names'
            );
            if (response.data) {
                // Retrieves Array of Crypto Names
                const testData = Object.values(response.data[0]);
                console.log(testData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const isYourMamaTrue = () => {
        setIsJerryTrue((prev) => !prev);
    };

    console.log(isJerryTrue);

    return (
        <>
            {isJerryTrue && (
                <Image src={MyBaby} alt="Sky loves Dad" size="small" />
            )}
            <Button
                onClick={handleClick}
                variant="contained"
                className="endpointTest"
            >
                Endpoint Test
            </Button>
        </>
    );
};

export default EndpointTest;
