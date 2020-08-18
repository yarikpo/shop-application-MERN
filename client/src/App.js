import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Body from './components/Body';
import Authentication from './components/Authentication';
import Bottom from './components/Bottom';
import Profile from './components/Profile';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      regAction: 'reg', // shows if user wants to register(reg) or to login(log)
      serverUri: 'http://localhost:3001',
      isAuthorized: false,
      accessToken: '',
      refreshToken: ''
    };

    this.setRegAction = this.setRegAction.bind(this);
    this.handleChangeAuthorized = this.handleChangeAuthorized.bind(this);
    this.handleChangeAccessToken = this.handleChangeAccessToken.bind(this);
    this.handleChangeRefreshToken = this.handleChangeRefreshToken.bind(this);
  }

  setRegAction() {
    if (this.state.regAction === 'reg') this.setState({ regAction: 'log' }); 
    else if (this.state.regAction === 'log') this.setState({ regAction: 'reg' });
  }

  handleChangeAuthorized() {
    this.setState({ isAuthorized: !this.state.isAuthorized });
  }

  handleChangeAccessToken(token) {
    localStorage.setItem('accessToken', token);
    this.setState({ accessToken: localStorage.getItem('accessToken') });
  }

  handleChangeRefreshToken(token) {
    localStorage.setItem('refreshToken', token);
    this.setState({ refreshToken: localStorage.getItem('refreshToken') });
  }

  render() {
    return (
      <>
        <Header 
          isAuthorized={this.state.isAuthorized} 
          serverUri={this.state.serverUri}
          handleChangeAuthorized={this.handleChangeAuthorized}
        />
        <Switch>
          <Route exact path='/' component={Body} />
          <Route exact path='/profile' render={() => 
            <Profile 
              serverUri={this.state.serverUri}
              accessToken={this.state.accessToken}
              refreshToken={this.state.refreshToken}
              handleChangeAuthorized={this.handleChangeAuthorized}
            />}
          />
          <Route exact path='/auth' render={() => 
            <Authentication 
              serverUri={this.state.serverUri} 
              setRegAction={this.setRegAction} 
              regAction={this.state.regAction} 
              accessToken={this.state.accessToken}
              refreshToken={this.state.refreshToken}
              handleChangeAuthorized={this.handleChangeAuthorized}
              handleChangeAccessToken={this.handleChangeAccessToken}
              handleChangeRefreshToken={this.handleChangeRefreshToken}
            />} 
          />
        </Switch>
        <Bottom />
      </>
    )
  }
}

export default App;
