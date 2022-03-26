import { makeAutoObservable } from 'mobx';

class CryptoStore {
    cryptoTest = '12345';

    constructor(root) {
        makeAutoObservable(this);
        this.root = root;
    }
}

export default CryptoStore;
