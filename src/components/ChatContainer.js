import React, { Component } from 'react';
import Header from './Header';
import Footer from './Footer';
import Games from './Games';
import ChatList from './ChatList';
import Chat from './Chat';
import Game from './Game';
import Contacts from './Contacts';
import Settings from './Settings';
import AuthenticatedRoute from './AuthenticatedRoute';

class ChatContainer extends Component {
  render() {
    return (
      <div>
        <Header/>
        <AuthenticatedRoute path='/games' component={Games}/>
        <AuthenticatedRoute path='/chats' component={ChatList}/>
        <AuthenticatedRoute path='/contacts' component={Contacts}/>
        <AuthenticatedRoute path='/settings' component={Settings}/>
        <AuthenticatedRoute path='/chat' component={Chat}/>
        <AuthenticatedRoute path='/game' component={Game}/>
        <Footer/>
      </div>
    );
  }
}

export default ChatContainer;
