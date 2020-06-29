import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import verifyToken from '../../helpers/VerifyToken';
import axios from 'axios';
import { getProfilePhotoName } from '../../helpers/generateImageName';
import CryptoJS from 'crypto-js';

const addresses = require('../../config');

interface UserPageEditRouter {
    id: string
}

interface UserPageEditProps extends RouteComponentProps<UserPageEditRouter> {
    
}


function EditGeneralUserData(props: UserPageEditProps) {

    const [username, setUsername] = useState("");
    const [descr, setDescr] = useState("");
    const [photo, setPhoto] = useState<File>();
    const [passwd, setPasswd] = useState("");
    
    const userId = props.match.params.id;

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/users/${userId}`)
            .then(response => {
                console.log(response);
                setUsername(response.data.username);
                setDescr(response.data.description);
            });
    }, []);

    const handleSubmitUserEdit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        console.log("Description");
        console.log(descr);

        let file;
        if (photo) {
            // render new filename on client side
            const newFileName = getProfilePhotoName(userId, photo?.type.slice(6));
            file = new File([photo!], newFileName);

            const data = new FormData();
            data.append('file', file);
            data.append('name', file.name);

            axios.post(`http://${addresses.serverAddress}/upload/profile_photo`, data);
        }

        const toSend = {
            username: username,
            photo: file?.name,
            descr: descr,
            passwd: CryptoJS.SHA256(passwd).toString()
        };

        console.log(toSend);

        axios.post(`http://${addresses.serverAddress}/users/${userId}/edit_general`, toSend)
            .then(res => alert(res.data))
            .catch(err => {
                alert(err.response.data.message);
            })
    }

    return (
        <div className="card card-contrib">
            <form onSubmit={handleSubmitUserEdit} className="form-contrib">
                <label htmlFor="username">Set new username</label>
                <input defaultValue={username} type="textarea" name="username" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                        setUsername(e.currentTarget.value)
                }/>
                <label htmlFor="descr">Set new description</label>
                <textarea defaultValue={descr} name="descr" onChange={
                    (e: React.FormEvent<HTMLTextAreaElement>) => {
                        console.log(e.currentTarget.value);
                        setDescr(e.currentTarget.value);
                    }
                }/>
                <label htmlFor="photo">Upload new profile photo</label>
                <input type="file" accept="image/*" onChange={
                    (e: any) => {
                        if (e.target.files[0].type.match("image/*"))
                            setPhoto(e.target.files[0]);
                }}/>
                <label htmlFor="passwd">Enter password</label>
                <input type="password" name="passwd" onChange={
                    (e: React.FormEvent<HTMLInputElement>) => 
                        setPasswd(e.currentTarget.value)
                }/>
                <button className="btn" type="submit">Submit changes</button>
            </form>
        </div>
    );
}

function EditUserPassword(props: UserPageEditProps) {

    const [oldPasswd, setOldPasswd] = useState("");
    const [newPasswd, setNewPasswd] = useState("");
    const [newPasswdConfirm, setNewPasswdConfirm] = useState("");

    const handleSubmitPasswordChange = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (newPasswd !== newPasswdConfirm) {
            alert("Please retype confirmed password");
        }
        else if (newPasswd === "") {
            alert("Please type new password");
        }
        else {
            const toSend = {
                oldPasswd: CryptoJS.SHA256(oldPasswd).toString(),
                newPasswd: CryptoJS.SHA256(newPasswd).toString()
            }
    
            axios.post(`http://${addresses.serverAddress}/users/${props.match.params.id}/edit_passwd`, toSend)
                .then(_ => alert("Password successfully changed"))
                .catch(err => alert(err.response.data));
        }
    }

    return (
        <div className="card card-contrib">
            <form onSubmit={handleSubmitPasswordChange} className="form-contrib">
                <label htmlFor="old-passwd">Type old password</label>
                <input name="old-passwd" type="password" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                        setOldPasswd(e.currentTarget.value)
                }></input>
                <label htmlFor="new-passwd">Type new password</label>
                <input name="new-passwd" type="password" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                        setNewPasswd(e.currentTarget.value)
                }></input>
                <label htmlFor="new-passwd-confirm">Repeat new password</label>
                <input name="new-passwd-confirm" type="password" onChange={
                    (e: React.FormEvent<HTMLInputElement>) =>
                        setNewPasswdConfirm(e.currentTarget.value)
                }></input>
                <button className="btn" type="submit">Change password</button>
            </form>
        </div>
    )
}


export default function UserPageEdit(props: UserPageEditProps) {

    const [isAllowed, setIsAllowed] = useState(false);
    const [pageSelected, setPageSelected] = useState(1);

    useEffect(() => {
        verifyToken().then(res => {
            if (res?.accId === props.match.params.id)
                setIsAllowed(true);
        }).catch(error => {
            setIsAllowed(false);
        })
    });

    const selectPage = () => {
        switch (pageSelected) {
            case 1: return <EditGeneralUserData {...props}/>;
            case 2: return <EditUserPassword {...props}/>;
        }
    }

    if (isAllowed)
        return (
            <>
                <div className="header">
                    <p>A page where you can change your user data</p>
                </div>
                <main>
                    <div className="contributions-main">
                        <div className="btn-group">
                            <button className="btn btn-contrib" onClick={() => setPageSelected(1)}>Edit general data</button>
                            <button className="btn btn-contrib" onClick={() => setPageSelected(2)}>Change password</button>
                        </div>
                        {selectPage()}
                    </div>
                </main>
            </>
        )
    else
        return (
            <main>
                <h1>You are not allowed to edit data of this user</h1>
            </main>
        )
}
