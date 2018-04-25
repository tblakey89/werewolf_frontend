import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Games from './Games';
import ChatList from './ChatList';
import Chat from './Chat';
import Game from './Game';
import Contacts from './Contacts';
import Settings from './Settings';
import SessionDialog from './SessionDialog';
import './App.css';

// Tasks
// Split into smaller components, like new chat/game button could be one
// Tidy up/refactor
// tests?

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path='(|/signin|/register|/forgotten_password|/new_password)' component={SessionDialog}/>
        <Route path='/games' render={props => (
          <div><Header/><Games/><Footer/></div>
        )}/>
        <Route path='/chats' render={props => (
          <div><Header/><ChatList/><Footer/></div>
        )}/>
        <Route path='/contacts' render={props => (
          <div><Header/><Contacts/><Footer/></div>
        )}/>
        <Route path='/settings' render={props => (
          <div><Header/><Settings/><Footer/></div>
        )}/>
        <Route path='/chat' render={props => (<div><Header/><Chat/><Footer/></div>
        )}/>
        <Route path='/game' render={props => (
          <div><Header/><Game/><Footer/></div>
        )}/>
      </div>
    );
  }
}

export default App;
