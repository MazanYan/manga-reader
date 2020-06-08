import React, { Component } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const serverAddress = 'http://localhost:3000/login';

type LoginSignupProps = {

};

type LoginSignupState = {
    name: string,
    password: string
};

export default class LoginSignupComponent extends Component<LoginSignupProps, LoginSignupState> {
    constructor(props: LoginSignupProps) {
        super(props);
        this.state = {name: "", password: ""};
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        //alert("Hello!");
    }

    handleSubmit(event: React.FormEvent<HTMLButtonElement>) {
        const encryptedLogin = CryptoJS.SHA256(this.state.name);
        const encryptedPassword = CryptoJS.SHA256(this.state.password);
        //const response = await axios.post(serverAddress, {encryptedLogin, encryptedPassword});

        fetch("http://localhost:3000/login").then(res => alert(res.text())).catch(err => alert(err));
        /*const res = await fetch(serverAddress, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: {
                    login: encryptedLogin,
                    password: encryptedPassword
                }
            })
        });
        alert(res.text());*/
        //alert(this.state.name);
        
        //event.preventDefault();
    }
    
    handleLogin(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({name: event.target.value});
        event.preventDefault();
    }

    handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: event.target.value});
        event.preventDefault();
    }

    render() {
        return (
            <div className="dropdown-content">
                <form method="post" action="/" className="dropdown-content">
                    <label htmlFor="email">E-Mail</label>
                    <input onChange={this.handleLogin} value={this.state.name} type="text" name="email"/>
                    <label htmlFor="passwd">Password</label>
                    <input onChange={this.handlePassword} value={this.state.password} type="password" name="passwd"/>
                    <button onClick={this.handleSubmit} type="submit">Sign in</button>
                    <label htmlFor="signup">Have no account?</label>
                    <button>Sign up</button>
                </form>
            </div>
            )
    }
}

/*
<ul className="dd-list">
    <li className="dd-list-item"></li>
    <li className="dd-list-item"></li>
    <li className="dd-list-item"></li>
</ul>
*/