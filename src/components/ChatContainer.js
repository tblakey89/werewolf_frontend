import React, { Component } from 'react';
import { matchPath } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from './Header';
import Footer from './Footer';
import Games from './Games';
import ChatList from './ChatList';
import Chat from './Chat';
import Game from './Game';
import Contacts from './Contacts';
import Settings from './Settings';
import AuthenticatedRoute from './AuthenticatedRoute';
import User from '../api/user';
import Conversation from '../api/conversation';
import socketConnect from '../sockets/socketConnect';
import UserChannel from '../sockets/userChannel';
import ConversationChannel from '../sockets/conversationChannel';
import history from '../history';

// if the chat page for that username has less than 100 messages
// then get 100 messages from the server, where message.date > last_message.date limit 100
// we need a way to mark the very first message in a conversation, don't get more if first
// message

// Do not need to pass functions from here to chat, as websockets send message back here

// should probably use join like in book or handle_info for sending previous conversations
// callback for receiving invitation

class ChatContainer extends Component {
  state = {
    _loading: false,
    socket: null,
    user: {},
    userChannel: null,
    conversations: [],
    unreadMessageCount: 0,
  };

  componentDidMount() {
    this.setState({_loading: true})
    User.me((response) => {
      const socket = socketConnect();
      const { user } = response;
      const userChannel = this.joinUserChannel(socket, user)
      const conversations = user.conversations.map((conversation) =>
        this.buildConversationWithChannel(conversation, socket)
      );
      user.conversations = undefined;

      this.setState({
        socket,
        user,
        userChannel,
        conversations,
        _loading: false
      });
    }, (response) => {

    });
  }

  joinUserChannel = (socket, user) => (
    UserChannel.join(socket, user.id, this.newConversationCallback)
  );

  buildConversationWithChannel = (conversation, socket) => (
    {
      ...conversation,
      channel: this.joinConversationChannel(socket, conversation),
      unreadMessageCount: 0,
      lastMessageAt: this.conversationLastMessageAt(conversation),
    }
  );

  conversationLastMessageAt = (conversation) => {
    const { messages } = conversation;
    if (messages.length === 0) return undefined;
    return messages.slice(-1)[0].created_at;
  };

  joinConversationChannel = (socket, conversation) => (
    ConversationChannel.join(socket, conversation.id, this.newMessageCallback)
  )

  newConversationCallback = (newConversation) => {
    const conversation =
      this.buildConversationWithChannel(newConversation, this.state.socket);
    const { conversations } = this.state;

    if (conversation.messages.length > 0) {
      this.notifyNewMessage(conversation.messages.slice(-1)[0]);
    }

    this.setState({
      conversations: [...conversations, conversation],
    });
  };

  newMessageCallback = (newMessage) => {
    const conversations = [...this.state.conversations];
    const conversation = conversations.find((conversation) =>
      conversation.id === newMessage.conversation_id
    );

    conversation.unreadMessageCount++;
    conversation.lastMessageAt = newMessage.created_at;
    conversation.messages.push(newMessage);

    this.notifyNewMessage(newMessage);

    this.setState({ conversations });
  };

  notifyNewMessage = (message) => {
    if (message.sender.id === this.state.user.id) return;
    this.props.onNotificationOpen(
      `${message.sender.username}: ${message.body}`
    );
  }

  setAsRead = (readConversation) => {
    const { conversations } = this.state;
    const conversation = conversations.find((conversation) => conversation.id === readConversation.id)

    conversation.unreadMessageCount = 0;

    this.setState({
      conversations
    });
  };

  render() {
    if (this.state._loading) {
      return <CircularProgress />;
    }
    return (
      <div>
        <Header/>
        <AuthenticatedRoute path='/games' component={Games}/>
        <AuthenticatedRoute
          path='/chat/:id'
          render={({ match }) => {
            const conversation = this.state.conversations.find((conversation) =>
              conversation.id === parseInt(match.params.id, 10)
            );
            return (
              <Chat
                conversation={conversation}
                setAsRead={this.setAsRead}
              />
            );
          }}
        />
        <AuthenticatedRoute
          exact
          path='/chats'
          component={ChatList}
          conversations={this.state.conversations}
          user={this.state.user}
          onNotificationOpen={this.props.onNotificationOpen}
        />
        <AuthenticatedRoute path='/contacts' component={Contacts}/>
        <AuthenticatedRoute path='/settings' component={Settings}/>
        <AuthenticatedRoute path='/game' component={Game}/>
        <Footer
          conversations={this.state.conversations}
          unreadMessageCount={this.state.conversations.reduce((sum, conversation) => (
            sum + conversation.unreadMessageCount
          ), 0)}
        />
      </div>
    );
  }
}

export default ChatContainer;
