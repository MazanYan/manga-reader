import React from 'react';

type MyProps = {
    field1: string,
    field2: string,
    className: string
};
 
export default class NavbarComponent extends React.Component<MyProps> {
    constructor(props: MyProps) {
        super(props);
    }

    render() {
        return (
            <nav className={this.props.className}>
                <a rel="index.html">Manga Reader</a>
                <a rel="index.html">My Profile</a>
                <a rel="index.html">Bookmarks</a>
                <a rel="index.html">Notifications</a>
                <a rel="index.html">Log Out</a>
            </nav>
        );
    }
}
