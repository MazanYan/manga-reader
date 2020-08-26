import React from 'react';
import { RouteComponentProps, Switch, Route } from 'react-router-dom';
import MangaMain from './MangaMainComponent';
import MangaPage from './MangaPageComponent';

export default function Manga(props: RouteComponentProps) {
    return (
        <Switch>
            <Route exact path="/manga/:id" component={MangaMain}/>
            <Route exact path="/manga/:id/:ch/:pg" component={MangaPage}/>
        </Switch>
    )
}
