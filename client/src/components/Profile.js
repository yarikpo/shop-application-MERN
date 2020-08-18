import React from 'react';
import './Profile.css';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            data: 'tyta'
        };
    }

    componentDidMount() {
        const accessToken = localStorage.getItem('accessToken');
        const url = this.props.serverUri + '/api/profile';

        fetch(url, {
            'method': 'GET',
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Authorization': 'Bearer ' + accessToken
            }
        })
            .then(response => response.json())
            .then(response => this.setState({ username: response.username, email: response.email, password: response.password }))
            .catch(err => console.log('Unauthorized'));

        
        
        // this.setState({ data: data })JSON.stringify(getData(where)[0]);

    }

    render() {
        return (
            <div>
                <h2>Profile</h2>
                <h3>username: {this.state.username}</h3>
                <h3>password: {this.state.password}</h3>
                <h3>email: {this.state.email}</h3>
            </div>
        )
    }
}