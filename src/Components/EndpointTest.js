import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Image from 'material-ui-image';
import MyBaby from '../Assets/MyBaby.jpg';
import './_styles/EndpointTest.css';

const EndpointTest = () => {
    // const [users, setUsers] = useState({});
    const [isJerryTrue, setIsJerryTrue] = useState(false);
    const [cryptoNames, setCryptoNames] = useState([]);

    const handleCryptoNames = async () => {
        try {
            const response = await axios.get(
                'https://slothkins-beta-2.herokuapp.com/crypto-names'
            );
            if (response.data) {
                // Retrieves Array of Crypto Names
                const testData = response.data[0]['array'];

                setCryptoNames(testData);
            }
        } catch (error) {
            console.log(error);
        }
    };

    console.log(cryptoNames);

    const handleCryptoPrices = async () => {
        for (const name in cryptoNames) {
            try {
                const response = await axios.get(
                    `https://slothkins-beta-2.herokuapp.com/all-crypto-prices?currencyName=${cryptoNames[name]}`
                );
                if (response.data) {
                    console.log(response.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    console.log(cryptoNames);

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
                onClick={handleCryptoNames}
                variant="contained"
                className="endpointTest"
            >
                Get All Crypto Names
            </Button>
            <Button
                onClick={handleCryptoPrices}
                variant="contained"
                className="endpointTest"
            >
                Get All Crypto Prices
            </Button>
        </>
    );
};

export default EndpointTest;
