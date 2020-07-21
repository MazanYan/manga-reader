import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Link } from 'react-router-dom';

const addresses = require('../../config');

function LogInComponent() {

    const [user, setUser] = useState("");
    const [passw, setPassw] = useState("");

    const handleLogIn = (event: any) => {
        event?.preventDefault();

        const loginData = {
            user: user,
            passw: CryptoJS.SHA256(passw).toString()
        }

        const loginPromise = axios.post(`http://${addresses.serverAddress}/login`, loginData);

        loginPromise.then((response: any) => {
            console.log(response.status);
            window.localStorage.setItem('jwt-token', response.data.token);
            window.location.reload(false);
        }).catch(error => {
            alert(error.response.data.message);
        });
    };

    return (
        <>
            <style>{`
            `}</style>
            <div className="card card-contrib">
                <form onSubmit={handleLogIn} className="form-contrib">
                    <label htmlFor="name">Username or email</label>
                    <input name="name" type="text" onChange={
                        (event) => setUser(event.target.value)
                    }></input>
                    <label htmlFor="passwd">Password</label>
                    <input name="passwd" type="password" onChange={
                        (event) => setPassw(event.target.value)
                    }>
                    </input>
                    <Link className="link-colored" id="forg-passw" to="/auth/recover">Forgot Password?</Link>
                    <button className="btn" type="submit">Log in</button>
                </form>
            </div>
        </>
    );
}

function SignUpComponent() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [passw, setPassw] = useState("");
    const [passwConf, setPasswConf] = useState("");

    const handleSignUp = (event: any) => {
        event.preventDefault();
        console.log({username, email, passw, passwConf});
        if (passw !== passwConf) {
            alert('Password and confirmed password do not match');
            return;
        }
        const passwordHashed = CryptoJS.SHA256(passw).toString();
        const toSend = {
            user: username,
            email: email,
            passw: passwordHashed
        };

        console.log(toSend);

        const sendUserDataPromise = axios.post(`http://${addresses.serverAddress}/users/new`, toSend);

        Promise.all([sendUserDataPromise])
            .then(response => {
                if (response[0].data.filter((message: string) => message.includes('ERROR')).length > 0) {
                    alert("Failed to add new user. Probably this e-mail is already used");
                }
            })
            .catch(error => console.log(error));

    }

    return (
        <div className="card card-contrib">
            <form className="form-contrib" onSubmit={handleSignUp}>
                <label htmlFor="name">Username (50 characters max)</label>
                <input name="name" type="text" maxLength={50} onChange={
                    (event) => setUsername(event.target.value)
                }></input>
                <label htmlFor="mail">E-mail</label>
                <input name="mail" type="email" onChange={
                    (event) => setEmail(event.target.value)
                }></input>
                <label htmlFor="passwd">Password</label>
                <input name="passwd" type="password" onChange={
                    (event) => setPassw(event.target.value)
                }></input>
                <label htmlFor="passwdConf">Confirm password</label>
                <input name="passwdConf" type="password" onChange={
                    (event) => setPasswConf(event.target.value)
                }></input>
                <button className="btn" type="submit">Sign up</button>
            </form>
        </div>
    );
}

export default function LoginSignup() {
    const [pageSelected, setPageSelected] = useState(1);
    const RenderComponent = () => {
        switch (pageSelected) {
            case 1: return <LogInComponent />;
            case 2: return <SignUpComponent />;
        }
    }
    
    return (
        <>
            <main className="contributions-main">
                <div className="btn-group">
                    <button className="btn btn-contrib" onClick={() => setPageSelected(1)}>Log In</button>
                    <button className="btn btn-contrib" onClick={() => setPageSelected(2)}>Sign Up</button>
                </div>
                {RenderComponent()}
            </main>
        </>
    )
}
