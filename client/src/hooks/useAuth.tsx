import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

const addresses = require('../config');

export function useAuth() {
    //const [token, setToken] = useState('');
    const [userId, setUserId] = useState('');
    const [userName, setUserName] = useState('');

    const login = useCallback((jwtToken: string) => {
        window.localStorage.setItem('jwt-token', jwtToken);
        //console.log('jwt-token');
        //console.log(jwtToken);
        axios.post(`http://${addresses.serverAddress}/login/verify`, { token: jwtToken })
            .then(res => {
                console.log("Token verification completed");
                setUserName(res.data.name);
                setUserId(res.data.id);
            });
    }, []);

    const logout = () => {
        window.localStorage.removeItem('jwt-token');
        setUserName('');
        setUserId('');
    }

    useEffect(() => {
        const jwtToken = window.localStorage.getItem('jwt-token');
        if (jwtToken)
            login(jwtToken);
    }, [login]);

    return { userId, userName, login, logout };
}

/*export default async function verifyToken() {
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
}*/
