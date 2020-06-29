import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import UserPageViewComponent from './UserPageViewComponent';
import UserPageEditComponent from './UserPageEditComponent';
import UserBookmarksComponent from './UserBookmarksComponent';

export default function UserPageComponent() {
    return (
        <Switch>
            <Route exact path="/user/:id" component={UserPageViewComponent}/>
            <Route exact path="/user/:id/edit" component={UserPageEditComponent}/>
            <Route exact path="/user/:id/bookmarks" component={UserBookmarksComponent} />
        </Switch>
    )
}