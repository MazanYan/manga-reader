import React from 'react';

type MainPageProps = {};

export default class MainPageComponent extends React.Component<MainPageProps> {

    async getLoginPage() {
        const result = await fetch('http://www.ubuntu.com');
        alert(result);
        return (
            <div>
                {result.text}
            </div>
        )}

    render() {
        return (
            <React.Fragment>
                Site Main Page
            </React.Fragment>
        )
    }
}
