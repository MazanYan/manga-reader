import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
//import verifyToken from '../../helpers/VerifyToken';
import { useAuth } from '../../hooks/useAuth';
import axios from 'axios';
import { getProfilePhotoName } from '../../helpers/generateImageName';
import CryptoJS from 'crypto-js';
import { useForm } from 'react-hook-form';

const addresses = require('../../config');

interface UserPageEditRouter {
    id: string
}

interface UserPageEditProps extends RouteComponentProps<UserPageEditRouter> {}

function EditGeneralUserData(props: UserPageEditProps) {

    const [username, setUsername] = useState("");
    const [descr, setDescr] = useState("");

    const { register, handleSubmit } = useForm();
    
    const userId = props.match.params.id;

    useEffect(() => {
        axios.get(`http://${addresses.serverAddress}/users/${userId}`)
            .then(response => {
                setUsername(response.data.username);
                setDescr(response.data.description);
            });
    }, [userId]);

    const handleSubmitUserEdit = (data: any) => {
        
        console.log("Description");
        console.log(descr);

        let file;
        const photo = data.photo[0];
        console.log("Data Photo");
        console.log(photo);
        if (photo !== undefined) {
            // render new filename on client side
            const newFileName = getProfilePhotoName(userId, photo.type?.slice(6));
            file = new File([photo], newFileName);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('name', file.name);

            axios.post(`http://${addresses.serverAddress}/upload/profile_photo`, formData);
        }

        const toSend = {
            username: data.username,
            photo: file?.name,
            descr: data.descr,
            passwd: CryptoJS.SHA256(data.passwd).toString()
        };

        console.log(toSend);

        axios.post(`http://${addresses.serverAddress}/users/${userId}/edit_general`, toSend)
            .then(res => alert(res.data))
            .catch(err => {
                alert(err.response.data.message);
            });
    }

    return (
        <div className="card card-contrib">
            <form onSubmit={handleSubmit(handleSubmitUserEdit)} className="form-contrib">
                <label htmlFor="username">
                    Set new username
                </label>
                <input defaultValue={username} type="textarea" name="username" ref={register}/>
                <label htmlFor="descr">
                    Set new description
                </label>
                <textarea defaultValue={descr} name="descr" ref={register}/>
                <label htmlFor="photo">
                    Upload new profile photo
                </label>
                <input name="photo" type="file" accept="image/*" multiple={false} ref={register}/>
                <label htmlFor="passwd">
                    Enter password
                </label>
                <input type="password" name="passwd" ref={register}/>
                <button className="btn" type="submit">
                    Submit changes
                </button>
            </form>
        </div>
    );
}

function EditUserPassword(props: UserPageEditProps) {

    const { register, handleSubmit } = useForm();

    const handleSubmitPasswordChange = (data: any) => {

        if (data.newPasswd !== data.newPasswdConfirm) {
            alert("Please retype confirmed password");
        }
        else if (data.newPasswd === "") {
            alert("Please type new password");
        }
        else {
            const toSend = {
                oldPasswd: CryptoJS.SHA256(data.oldPasswd).toString(),
                newPasswd: CryptoJS.SHA256(data.newPasswd).toString()
            }
    
            axios.post(`http://${addresses.serverAddress}/users/${props.match.params.id}/edit_passwd`, toSend)
                .then(_ => alert("Password successfully changed"))
                .catch(err => alert(err.response.data));
        }
    }

    return (
        <div className="card card-contrib">
            <form onSubmit={handleSubmit(handleSubmitPasswordChange)} className="form-contrib">
                <label htmlFor="oldPasswd">
                    Type old password
                </label>
                <input name="oldPasswd" type="password" ref={register} />
                <label htmlFor="newPasswd">
                    Type new password
                </label>
                <input name="newPasswd" type="password" ref={register} />
                <label htmlFor="newPasswdConfirm">
                    Repeat new password
                </label>
                <input name="newPasswdConfirm" type="password" ref={register} />
                <button className="btn" type="submit">
                    Change password
                </button>
            </form>
        </div>
    )
}


export default function UserPageEdit(props: UserPageEditProps) {

    const [isAllowed, setIsAllowed] = useState<boolean>();
    const [pageSelected, setPageSelected] = useState(1);
    const { userId } = useAuth();

    useEffect(() => {
        if (userId === props.match.params.id)
            setIsAllowed(true);
        else
            setIsAllowed(false);
        /*verifyToken().then(res => {
            if (res?.accId === props.match.params.id)
                setIsAllowed(true);
        }).catch(error => {
            setIsAllowed(false);
        })*/
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
                            <button className="btn btn-contrib" onClick={() => setPageSelected(1)}>
                                Edit general data
                            </button>
                            <button className="btn btn-contrib" onClick={() => setPageSelected(2)}>
                                Change password
                            </button>
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
