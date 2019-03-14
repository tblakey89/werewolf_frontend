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
import InvitationTokenDialog from './InvitationTokenDialog';
import AuthenticatedRoute from './AuthenticatedRoute';
import User from '../api/user';
import Conversation from '../api/conversation';
import socketConnect from '../sockets/socketConnect';
import UserChannel from '../sockets/userChannel';
import ConversationChannel from '../sockets/conversationChannel';
import GameChannel from '../sockets/gameChannel';
import history from '../history';

class ChatContainer extends Component {
  state = {
    _loading: false,
    socket: null,
    user: {},
    userChannel: null,
    conversations: [],
    games: [],
    invitations: [],
    unreadMessageCount: 0,
  };

  componentDidMount() {
    // this react container is getting out of hand,
    // consider having a pre-formatter for data received from the server via sockets/http
    // that should reduce the lines of code here
    this.setState({_loading: true})
    User.me((response) => {
      const socket = socketConnect();
      const { user } = response;
      const userChannel = this.joinUserChannel(socket, user)
      const conversations = user.conversations.map((conversation) =>
        this.buildConversationWithChannel(conversation, socket)
      );
      const games = user.games.map((game) =>
        this.buildGameWithChannel(game, user, socket)
      );
      const invitations = games.filter((game) => game.pending)
      user.conversations = undefined;

      this.setState({
        socket,
        user,
        userChannel,
        conversations,
        games,
        invitations,
        _loading: false
      });
    }, (response) => {

    });
  }

  joinUserChannel = (socket, user) => (
    UserChannel.join(
      socket,
      user.id,
      this.newConversationCallback,
      this.newGameCallback,
      this.updateGameCallback,
      this.updateGameStateCallback,
      this.updateUserCallback,
    )
  );

  buildConversationWithChannel = (conversation, socket) => (
    {
      ...conversation,
      channel: this.joinConversationChannel(socket, conversation),
      unreadMessageCount: 0,
      lastMessageAt: this.lastMessageAt(conversation),
    }
  );

  lastMessageAt = (conversation) => {
    const { messages } = conversation;
    if (messages.length === 0) return undefined;
    return messages.slice(-1)[0].created_at;
  };

  joinConversationChannel = (socket, conversation) => (
    ConversationChannel.join(socket, conversation.id, this.newMessageCallback)
  )

  newConversationCallback = (newConversation) => {
    if (this.state.conversations.find(((conversation) => conversation.id === newConversation.id))) return;
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

  updateUserCallback = (updatedUser) => {
    const user = Object.assign({...this.state.user}, updatedUser);
    this.setState({user});
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
    if (message.bot) {
      this.props.onNotificationOpen(`${message.body}`);
    } else {
      if (message.sender.id === this.state.user.id) return;
      this.props.onNotificationOpen(
        `${message.sender.username}: ${message.body}`
      );
    }
  }

  buildGameWithChannel = (game, user, socket) => (
    {
      ...game,
      pending: game.users_games.some((users_game) => (
        users_game.user_id === user.id && users_game.state === "pending"
      )),
      channel: this.joinGameChannel(socket, game),
      unreadMessageCount: 0,
      lastMessageAt: this.lastMessageAt(game),
    }
  );

  joinGameChannel = (socket, game) => (
    GameChannel.join(socket, game.id, this.newGameMessageCallback)
  )

  updateGameCallback = (updatedGame) => {
    const games = [...this.state.games];
    const gameIndex = games.findIndex((game) => game.id === updatedGame.id);
    const game = this.buildGameWithChannel(updatedGame, this.state.user, this.state.socket);
    if (gameIndex === -1) {
      games.push(game);
      this.props.onNotificationOpen(`You have been invited to ${game.name}`);
    } else {
      games[gameIndex] = game;
    }
    const invitations = games.filter((game) => game.pending);
    this.setState({games, invitations});
  };

  updateGameStateCallback = (updatedState) => {
    const games = [...this.state.games];
    const gameIndex = games.findIndex((game) => game.id === updatedState.id);
    games[gameIndex] = {...games[gameIndex], state: updatedState};
    this.setState({games});
  };

  newGameMessageCallback = (newMessage) => {
    const games = [...this.state.games];
    const game = games.find((game) =>
      game.id === newMessage.game_id
    );

    game.unreadMessageCount++;
    game.lastMessageAt = newMessage.created_at;
    game.messages.push(newMessage);

    this.notifyNewMessage(newMessage);

    this.setState({ games });
  };

  setConversationAsRead = (readConversation) => {
    const { conversations } = this.state;
    const conversation = conversations.find((conversation) => conversation.id === readConversation.id)

    conversation.unreadMessageCount = 0;

    this.setState({
      conversations
    });
  };

  setGameAsRead = (readGame) => {
    const { games } = this.state;
    const game = games.find((game) => game.id === readGame.id)

    game.unreadMessageCount = 0;

    this.setState({
      games
    });
  };

  newGameCallback = (newGame) => {
    const game = this.buildGameWithChannel(newGame, this.state.user, this.state.socket);
    const { games } = this.state;
    if (game.users_games.find((users_game) => users_game.user_id === this.state.user.id).state !== 'host') {
      this.props.onNotificationOpen(`You have been invited to ${game.name}`);
    }
    this.setState({games: [...games, game]});
  };

  render() {
    if (this.state._loading) {
      return <CircularProgress />;
    }
    return (
      <div>
        <Header
          invitations={this.state.invitations}
          user={this.state.user}
          onNotificationOpen={this.props.onNotificationOpen}
        />
        <div style={{'margin-top': '64px', 'margin-bottom': '56px'}}>
          <AuthenticatedRoute
            path='/games'
            component={Games}
            games={this.state.games}
            user={this.state.user}
            onNotificationOpen={this.props.onNotificationOpen}
          />
          <AuthenticatedRoute
            path='/game/:id'
            render={({ match }) => {
              const game = this.state.games.find((game) =>
                game.id === parseInt(match.params.id, 10)
              );
              return (
                <Game
                  game={game}
                  setAsRead={this.setGameAsRead}
                  user={this.state.user}
                  onNotificationOpen={this.props.onNotificationOpen}
                />
              );
            }}
          />
          <AuthenticatedRoute
            path='/chat/:id'
            render={({ match }) => {
              const conversation = this.state.conversations.find((conversation) =>
                conversation.id === parseInt(match.params.id, 10)
              );
              return (
                <Chat
                  user={this.state.user}
                  conversation={conversation}
                  setAsRead={this.setConversationAsRead}
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
          <AuthenticatedRoute
            path='/settings'
            user={this.state.user}
            onNotificationOpen={this.props.onNotificationOpen}
            component={Settings}
          />
          <AuthenticatedRoute
            path='/invitation/:token'
            render={({ match }) => (
              <InvitationTokenDialog
                token={match.params.token}
                onNotificationOpen={this.props.onNotificationOpen}
              />
            )}
          />
        </div>
        <Footer
          conversations={this.state.conversations}
          games={this.state.games}
          unreadMessageCount={this.state.conversations.reduce((sum, conversation) => (
            sum + conversation.unreadMessageCount
          ), 0)}
          unreadGameMessageCount={this.state.games.reduce((sum, game) => (
            sum + game.unreadMessageCount
          ), 0)}
        />
      </div>
    );
  }
}

export default ChatContainer;
