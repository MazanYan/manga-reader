import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const addresses = require('../../config');

function LogInComponent() {

    const { register, handleSubmit } = useForm();

    const handleLogIn = (data: any) => {

        const loginData = {
            user: data.name,
            passw: CryptoJS.SHA256(data.passwd).toString()
        }

        axios.post(`http://${addresses.serverAddress}/login`, loginData)
            .then((response: any) => {
                console.log(response.status);
                window.localStorage.setItem('jwt-token', response.data.token);
                window.location.reload(false);
            }).catch(error => {
                alert(error.response.data.message);
            });
    };

    return (
        <div className="card card-contrib">
            <form onSubmit={handleSubmit(handleLogIn)} className="form-contrib">
                <label htmlFor="name">Username or email</label>
                <input name="name" type="text" ref={register}></input>
                <label htmlFor="passwd">Password</label>
                <input name="passwd" type="password" ref={register}>
                </input>
                <Link className="link-colored" id="forg-passw" to="/auth/recover">
                    Forgot Password?
                </Link>
                <button className="btn" type="submit">Log in</button>
            </form>
        </div>
    );
}

function SignUpComponent() {

    const { register, handleSubmit } = useForm();

    const handleSignUp = (data: any) => {

        console.log(data);
        if (data.passwd !== data.passwdConf) {
            alert('Password and confirmed password do not match');
            return;
        }
        const passwordHashed = CryptoJS.SHA256(data.passwd).toString();
        const toSend = {
            user: data.username,
            email: data.mail,
            passw: passwordHashed
        };

        axios.post(`http://${addresses.serverAddress}/users/new`, toSend)
            .then(response => {
                if (response.data.filter((message: string) => message.includes('ERROR')).length > 0) {
                    alert("Failed to add new user. Probably this e-mail is already used");
                }
            })
            .catch(error => console.log(error));
    }

    return (
        <div className="card card-contrib">
            <form className="form-contrib" onSubmit={handleSubmit(handleSignUp)}>
                <label htmlFor="name">Username (50 characters max)</label>
                <input 
                    name="username" type="text" /*maxLength={50}*/ 
                    ref={register({ required: true, maxLength: 50 })} />
                <label htmlFor="mail">E-mail</label>
                <input name="mail" type="email" ref={register} />
                <label htmlFor="passwd">Password</label>
                <input name="passwd" type="password" ref={register} />
                <label htmlFor="passwdConf">Confirm password</label>
                <input name="passwdConf" type="password" ref={register} />
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
