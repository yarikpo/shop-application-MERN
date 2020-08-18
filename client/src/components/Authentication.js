import React from 'react';
import './Authentication.css';

export default class Authentication extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loginField: '',
            passwordField: '',
            emailField: ''
        };

        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmitForm = this.handleSubmitForm.bind(this);
    }

    handleChangeLogin(e) {
        this.setState({ loginField: e.target.value });
    }

    handleChangePassword(e) {
        this.setState({ passwordField: e.target.value });
    }

    handleChangeEmail(e) {
        if (this.props.regAction === 'reg') { this.setState({ emailField: e.target.value }); }
        else if (this.props.regAction === 'log') { this.setState({ emailField: '' }) }
    }

    handleSubmitForm(e) {
        e.preventDefault();

        const send = {
            username: this.state.loginField,
            password: this.state.passwordField,
            email: this.state.emailField
        };
        const where = this.props.regAction === 'log' ? this.props.serverUri + '/api/login' : this.props.serverUri + '/api/register';
        console.log('sending to:', where);

        async function postData(url = '', data = {}) {
            const response = await fetch(where, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(send)
            });
            return await response.json();
        }

        if (this.props.regAction === 'reg') {
            postData(where, send).then(data => {
                console.log(data.message);
            });
        }
        if (this.props.regAction === 'log') {
            postData(where, send).then(data => {
                const accessToken = data.accessToken;
                const refreshToken = data.refreshToken;

                this.props.handleChangeAccessToken(accessToken);
                this.props.handleChangeRefreshToken(refreshToken);
                console.log(`Access Token: ${accessToken}`);
                console.log(`Refresh Token: ${refreshToken}`);
            });
        }

        console.log('Sending: ' + JSON.stringify(send));
    }

    render() {
        return (
            <div className='auth'>
                <form onSubmit={this.handleSubmitForm} method='POST'>
                    <div className='sign-btns'>
                        <button 
                            type='button'
                            onClick={() => {
                                    // this.props.regAction === 'log' ? () => {} : this.props.setRegAction
                                    if (this.props.regAction === 'reg') { this.props.setRegAction() }
                                    this.setState({ emailField: '' });
                                }
                            }
                            style={this.props.regAction === 'log' ? {
                                backgroundColor: '#43a047',
                                color: '#fefefe'
                            } : {
                                backgroundColor: '#fefefe',
                                color: '#000'
                            }}
                        >
                            Log In                        
                        </button>
                        <button 
                            type='button'
                            onClick={this.props.regAction === 'reg' ? () => {} : this.props.setRegAction}
                            style={this.props.regAction === 'reg' ? {
                                backgroundColor: '#43a047',
                                color: '#fefefe'
                            } : {
                                backgroundColor: '#fefefe',
                                color: '#000'
                            }}
                        >
                            Register
                        </button>
                    </div>
                    <div className='login-field'>
                        <label>Login:</label>
                        <input type='text' placeholder='Your Login...' onChange={this.handleChangeLogin} value={this.state.loginField} />
                    </div>
                    <div className='password-field'>
                        <label>Password:</label>
                        <input type='password' placeholder='Your Password...' onChange={this.handleChangePassword} value={this.state.passwordField} />
                    </div>
                    <div 
                        className='email-field'
                        style={
                            this.props.regAction === 'reg' ? {
                                visibility: 'visible'
                            } : {
                                visibility: 'hidden'
                            }
                        }
                    >
                        <label>email:</label>
                        <input type='email' placeholder='Your email...' onChange={this.handleChangeEmail} value={this.state.emailField} />
                    </div>
                    <input className='submit-field' type='submit' value='Submit' />
                </form>
            </div>
        )
    }
}