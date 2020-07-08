import React from 'react';
import { Route, Switch } from 'react-router-dom';
import UserPageView from './UserPageViewComponent';
import UserPageEdit from './UserPageEditComponent';
import UserBookmarksPage from './UserBookmarksComponent';

export default function UserPage() {
    return (
        <Switch>
            <Route exact path="/user/:id" component={UserPageView}/>
            <Route exact path="/user/:id/edit" component={UserPageEdit}/>
            <Route exact path="/user/:id/bookmarks" component={UserBookmarksPage} />
        </Switch>
    )
}