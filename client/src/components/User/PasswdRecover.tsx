import React, { useState } from 'react';
import axios from 'axios';
import { RouteComponentProps } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { useForm } from 'react-hook-form';

const addresses = require('../../config');

export function InputEmailPasswRecover() {

    const { register, handleSubmit } = useForm();
    //const [email, setEmail] = useState("");

    const handlePasswordReset = (data: any) => {
        //event.preventDefault();
        axios.post(`http://${addresses.serverAddress}/users/recover`, {
            email: data.mail
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
                    <form className="form-contrib" onSubmit={handleSubmit(handlePasswordReset)}>
                        <label htmlFor="email">Type your e-mail</label>
                        <input name="mail" type="email" ref={register}/>
                        <button className="btn" name="submit" type="submit">
                            Send me e-mail for password reset
                        </button>
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

    const { register, handleSubmit } = useForm();

    const handleSetNewPasswd = (data: any) => {

        if (data.passwd !== data.passwdRepeat) {
            alert("New password and his confirmation are not the same");
        }
        else if (data.passwd === "") {
            alert("Please set new password");
        }
        else {
            const toSend = {
                newPasswd: CryptoJS.SHA256(data.passwd).toString()
            }
            const token = props.match.params.token;
            console.log(token);
            axios.post(`http://${addresses.serverAddress}/users/recover_passw/${token}`, toSend)
                .then(res => console.log(res));
        }
    }

    return (
        <>
            <div className="header">
                <p>Set new password</p>
            </div>
            <main className="contributions-main">
                <div className="card card-contrib">
                    <form className="form-contrib" onSubmit={handleSubmit(handleSetNewPasswd)}>
                        <label htmlFor="passwd">Set new password</label>
                        <input name="passwd" type="password" ref={register}/>
                        <label htmlFor="passwdRepeat">Repeat new password</label>
                        <input name="passwdRepeat" type="password" ref={register}/>
                        <button className="btn" name="submit" type="submit">Reset password</button>
                    </form>
                </div>
            </main>
        </>
    )
}