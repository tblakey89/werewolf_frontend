import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Header from './Header';
import Footer from './Footer';
import Games from './Games';
import ChatList from './ChatList';
import Chat from './Chat';
import Game from './Game';
import Contacts from './Contacts';
import Settings from './Settings';
import SessionDialog from './SessionDialog';
import AuthenticatedRoute from './AuthenticatedRoute';
import './App.css';

const styles = theme => ({
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
});

class App extends Component {
  state = {
    notificationOpen: false,
    notificationMessage: ''
  };

  handleNotificationOpen = (notification) => {
    this.setState({
      notificationOpen: true,
      notificationMessage: notification
    });
  };

  handleNotificationClose = () => {
    this.setState({
      notificationOpen: false,
      notificationMessage: ''
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        <Route exact path='(|/signin|/register|/forgotten_password|/new_password)' render={props => (
          <SessionDialog onNotificationOpen={this.handleNotificationOpen}/>
        )}/>
        <AuthenticatedRoute path='/games' render={props => (
          <div><Header/><Games/><Footer/></div>
        )}/>
        <AuthenticatedRoute path='/chats' render={props => (
          <div><Header/><ChatList/><Footer/></div>
        )}/>
        <AuthenticatedRoute path='/contacts' render={props => (
          <div><Header/><Contacts/><Footer/></div>
        )}/>
        <AuthenticatedRoute path='/settings' render={props => (
          <div><Header/><Settings/><Footer/></div>
        )}/>
        <AuthenticatedRoute path='/chat' render={props => (
          <div><Header/><Chat/><Footer/></div>
        )}/>
        <AuthenticatedRoute path='/game' render={props => (
          <div><Header/><Game/><Footer/></div>
        )}/>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.notificationOpen}
          autoHideDuration={4000}
          onClose={this.handleNotificationClose}
          message={<span id="message-id">{this.state.notificationMessage}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleNotificationClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default withStyles(styles)(App);
