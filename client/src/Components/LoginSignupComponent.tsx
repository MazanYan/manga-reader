import React, { Component, useState } from 'react';
import CryptoJS from 'crypto-js';
import axios, { AxiosResponse } from 'axios';
import { Switch, Route } from 'react-router-dom';

const addresses = require('../config');

type LoginSignupProps = {

};

type LoginSignupState = {
    pageSelected: number
};

function LogInComponent() {

    const [user, setUser] = useState("");
    const [passw, setPassw] = useState("");

    const handleLogIn = (event: any) => {
        event?.preventDefault();
        //console.log({user, passw});

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
            //alert(response.data.message);
        });
    };

    return (
        <>
        <style>{`
            #forg-passw {
                text-align: left;
                color: burlywood;
            }
            
            #forg-passw:hover {
                text-decoration: underline;
            }
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
                <a id="forg-passw">Forgot Password?</a>
                <button type="submit">Log in</button>
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
                <button type="submit">Sign up</button>
            </form>
        </div>
    );
}

export default class LoginSignupComponent extends Component<LoginSignupProps, LoginSignupState> {
    constructor(props: LoginSignupProps) {
        super(props);
        this.state = {
            pageSelected: 1
        };
    }

    RenderComponent() {
        switch (this.state.pageSelected) {
            case 1: return <LogInComponent />;
            case 2: return <SignUpComponent />;
        }
    }

    render() {
        return (
            <>
                <main className="contributions-main">
                <div className="btn-group">
                        <button className="btn-contrib" onClick={() => this.setState({pageSelected: 1})}>Log In</button>
                        <button className="btn-contrib" onClick={() => this.setState({pageSelected: 2})}>Sign Up</button>
                    </div>
                    {this.RenderComponent()}
                </main>
            </>
        )
    }   
}
