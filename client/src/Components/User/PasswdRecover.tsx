import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const addresses = require('../../config');

export function InputEmailPasswRecover() {

    const [email, setEmail] = useState("");

    const handlePasswordReset = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        axios.post(`http://${addresses.serverAddress}/users/recover`, {
            email: email
        }).then(res => {
            console.log(res);
        });
    };

    return (
        <>
            <div className="header">
                <p>Password recover</p>
            </div>
            <main className="contributions-main">
                <div className="card card-contrib">
                    <form className="form-contrib" onSubmit={handlePasswordReset}>
                        <label htmlFor="email">Type your e-mail</label>
                        <input type="email" onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => 
                                setEmail(e.currentTarget.value)
                        } />
                        <button name="submit" type="submit">Send me e-mail for password reset</button>
                    </form>
                </div>
            </main>
        </>
    )
}

interface SetNewPasswRouter {
    token: string
}

interface SetNewPasswProps extends RouteComponentProps<SetNewPasswRouter> {
    
}

export function SetNewPasswRecover(props: SetNewPasswProps) {

    const [newPasswd, setNewPasswd] = useState("");
    const [newPasswdConfirm, setNewPasswdConfirm] = useState("");

    const handleSetNewPasswd = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPasswd !== newPasswdConfirm) {
            alert("New password and his confirmation are not the same");
        }
        else if (newPasswd === "") {
            alert("Please set new password");
        }
        else {
            const toSend = {
                newPasswd: CryptoJS.SHA256(newPasswd).toString()
            }
            const token = props.match.params.token;
            console.log(token);
            axios.post(`http://${addresses.serverAddress}/users/recover_passw/${token}`, toSend)
                .then(res => console.log(res));
        }
    }

    const token = props.match.params.token;
    console.log(token);

    return (
        <>
            <div className="header">
                <p>Set new password</p>
            </div>
            <main className="contributions-main">
                <div className="card card-contrib">
                    <form className="form-contrib" onSubmit={handleSetNewPasswd}>
                        <label htmlFor="passwd">Set new password</label>
                        <input name="passwd" type="password" onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => 
                                setNewPasswd(e.currentTarget.value)
                        }/>
                        <label htmlFor="passwd-repeat">Repeat new password</label>
                        <input name="passwd-repeat" type="password" onChange={
                            (e: React.ChangeEvent<HTMLInputElement>) => 
                                setNewPasswdConfirm(e.currentTarget.value)
                        }/>
                        <button name="submit" type="submit">Reset password</button>
                    </form>
                </div>
            </main>
        </>
    )
}