import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };

        this.handleLogOutClick = this.handleLogOutClick.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
    }

    handleLogOutClick() {
        const uri = this.props.serverUri + '/api/logout';
        const send = { token: localStorage.getItem('refreshToken')};

        try {
            fetch(uri, {
                method: 'DELETE',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(send)
            });
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            console.log('Log Out successfully');
        } catch (err) {
            console.log(err);
        }
    }

    handleRefreshClick() {
        const uri = this.props.serverUri + '/api/token';
        const send = { token: localStorage.getItem('refreshToken') };

        async function postData(uri='', send='') {
            try {
                const response = await fetch(uri, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(send)
                });
                return await response.json();
            } catch (err) {
                
            }
        }

        postData(uri, send)
            .then(data => localStorage.setItem('accessToken', data.accessToken))
            .catch(err => console.log('Unauthorized'));
    }

    render() {
        return (
            <header className='header'>
                <ul>
                    <li><Link to='/'>Home</Link></li>
                    <li className='right'><button onClick={this.handleLogOutClick}>Log out</button></li>
                    <li className='right'><button onClick={this.handleRefreshClick}>Refresh</button></li>
                    <li className='right'><Link to='/auth'>{this.props.isAuthorized === false ? 'Sign In' : ''}</Link></li>
                    <li className='right'><Link to='/profile'>{this.props.isAuthorized === false ? 'Profile' : ''}</Link></li>
                </ul>
            </header>
        )
    }
}