import React from 'react';

type UserPageProps = {

};

export default class UserPageComponent extends React.Component<UserPageProps> {

    render() {
        return (
            <React.Fragment>
                <div id="imagePlaceholder">
                    <img src="http://placekitten.com/g/300/200"/>
                </div>
                <div id="namePlaceholder">Username</div>
                <div id="userDescrPlaceholder">Hello everyone!</div>
                <div id="isOnline">Offline</div>
            </React.Fragment>
        );
    }
}