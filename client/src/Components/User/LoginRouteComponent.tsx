import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginSignup from './LoginSignupComponent';
import { InputEmailPasswRecover, SetNewPasswRecover } from './PasswdRecover';

export default function LoginRoute() {
    return (
        <Switch>
            <Route exact path="/auth" component={LoginSignup} />
            <Route exact path="/auth/recover" component={InputEmailPasswRecover} />
            <Route exact path="/auth/reset_passwd/:token" component={SetNewPasswRecover} />
        </Switch>
    )
}
