import axios from 'axios';
const addresses = require('../config');

export default async function verifyToken() {
    const hasToken = window.localStorage.getItem('jwt-token');
    if (!hasToken)
        return;
    const tokenVerify = {
        token: window.localStorage.getItem('jwt-token')
    };
    console.log("User has token");
    try {
        const res = await axios.post(`http://${addresses.serverAddress}/login/verify`, tokenVerify);
        return { accName: res.data.name, accId: res.data.id };
    } catch (e) {
        console.error(e);
    }
}
