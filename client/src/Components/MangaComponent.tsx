import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import { render } from '@testing-library/react';
import MangaMainComponent from './MangaMainComponent';
import MangaPageComponent from './MangaPageComponent';

export default function MangaComponent(props: RouteComponentProps) {
    return (
        <Switch>
            <Route exact path="/manga/:id" component={MangaMainComponent}/>
            <Route exact path="/manga/:id/chapter:ch/page:pg" component={MangaPageComponent}/>
        </Switch>
    )
}
