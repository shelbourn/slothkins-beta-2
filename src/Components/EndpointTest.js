import React, { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import Image from 'material-ui-image';
import { observer } from 'mobx-react-lite';

import MyBaby from '../Assets/MyBaby.jpg';
import { useStore } from '../Stores/StoreFunctions';

import './_styles/EndpointTest.css';

const EndpointTest = () => {
    const { CryptoStore } = useStore();

    // const [users, setUsers] = useState({});
    const [isJerryTrue, setIsJerryTrue] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleCryptoNames = async () => {
        try {
            const response = await axios.get(
                'https://slothkins-beta-2.herokuapp.com/crypto-names'
            );
            if (response.data) {
                // Retrieves Array of Crypto Names
                CryptoStore.setCryptoNames(response.data[0]['array']);
                CryptoStore.setIsLoaded('cryptoNames', true);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCryptoPrices = async () => {
        for (const name in CryptoStore.cryptoNames) {
            try {
                const response = await axios.get(
                    `https://slothkins-beta-2.herokuapp.com/all-crypto-prices?currencyName=${CryptoStore.cryptoNames[name]}`
                );
                if (response.data) {
                    const { array } = response.data[0];
                    CryptoStore.setCryptoPrice(
                        CryptoStore.cryptoNames[name],
                        array
                    );
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    console.log(CryptoStore.cryptoPrices);

    const isYourMamaTrue = () => {
        setIsJerryTrue((prev) => !prev);
    };

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
                disabled={!CryptoStore.loaded.cryptoNames}
            >
                Get All Crypto Prices
            </Button>
        </>
    );
};

export default observer(EndpointTest);
