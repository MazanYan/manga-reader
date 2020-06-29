import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginSignupComponent from './LoginSignupComponent';
import { InputEmailPasswRecoverComponent, SetNewPasswRecoverComponent } from './PasswdRecover';

export default function LoginRouteComponent() {
    return (
        <Switch>
            <Route exact path="/auth" component={LoginSignupComponent} />
            <Route exact path="/auth/recover" component={InputEmailPasswRecoverComponent} />
            <Route exact path="/auth/reset_passwd/:token" component={SetNewPasswRecoverComponent} />
        </Switch>
    )
}
