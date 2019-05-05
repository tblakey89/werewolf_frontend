import React, { Component } from 'react';
import { matchPath } from 'react-router';
import _ from 'lodash';
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
    friends: {},
    unreadMessageCount: 0,
  };

  componentDidMount() {
    // this react container is getting out of hand,
    // consider having a pre-formatter for data received from the server via sockets/http
    // that should reduce the lines of code here
    this.setState({_loading: true});
    User.me((response) => {
      const socket = socketConnect();
      const { user } = response;
      const userChannel = this.joinUserChannel(socket, user)
      const conversations = user.conversations.map((conversation) =>
        this.buildConversationWithChannel(conversation, user, socket)
      );
      const games = user.games.map((game) =>
        this.buildGameWithChannel(game, user, socket)
      );
      const invitations = games.filter((game) => game.pending)
      user.conversations = undefined;
      const friends = this.buildFriends(user, user.friendships);

      this.setState({
        socket,
        user,
        userChannel,
        conversations,
        games,
        invitations,
        friends,
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
      this.leaveGameCallback,
      this.newFriendRequestCallback,
      this.friendRequestUpdatedCallback,
    )
  );

  buildConversationWithChannel = (conversation, user, socket) => {
    const usersConversation = conversation.users_conversations.find((usersConversation) => (
      usersConversation.user_id === user.id
    ));
    return {
      ...conversation,
      channel: this.joinConversationChannel(socket, conversation),
      unreadMessageCount: this.calculateUnreadMessageCount(conversation.messages, usersConversation.last_read_at),
      lastMessageAt: this.lastMessageAt(conversation),
    }
  };

  calculateUnreadMessageCount = (messages, lastReadAt) => {
    if (messages.length === 0) return 0;
    const unreadIndex = messages.findIndex((message) => lastReadAt >= message.created_at);
    if (unreadIndex === -1) return messages.length;
    return unreadIndex;
  };

  lastMessageAt = (conversation) => {
    const { messages } = conversation;
    if (messages.length === 0) return undefined;
    return messages[0].created_at;
  };

  joinConversationChannel = (socket, conversation) => (
    ConversationChannel.join(socket, conversation.id, this.newMessageCallback)
  )

  newConversationCallback = (newConversation) => {
    if (this.state.conversations.find(((conversation) => conversation.id === newConversation.id))) return;
    const conversation =
      this.buildConversationWithChannel(newConversation, this.state.user, this.state.socket);
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
    const conversations = _.cloneDeep(this.state.conversations);
    const conversation = conversations.find((conversation) =>
      conversation.id === newMessage.conversation_id
    );

    conversation.unreadMessageCount++;
    conversation.lastMessageAt = newMessage.created_at;
    conversation.messages = [newMessage, ...conversation.messages];

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

  buildGameWithChannel = (game, user, socket) => {
    const usersGame = game.users_games.find((usersGame) => (
      usersGame.user_id === user.id
    ));
    return {
      ...game,
      pending: usersGame.state === 'pending',
      invitationAt: usersGame.created_at,
      channel: this.joinGameChannel(socket, game),
      unreadMessageCount: this.calculateUnreadMessageCount(game.messages, usersGame.last_read_at),
      lastMessageAt: this.lastMessageAt(game) || game.created_at,
    }
  };

  joinGameChannel = (socket, game) => (
    GameChannel.join(socket, game.id, this.newGameMessageCallback)
  );

  updateGame = (originalGame, updatedGame) => {
    const usersGame = updatedGame.users_games.find((usersGame) => (
      usersGame.user_id === this.state.user.id
    ));
    return {
      ...updatedGame,
      pending: usersGame.state === 'pending',
      channel: originalGame.channel,
      messages: _.cloneDeep(originalGame.messages),
    };
  };

  updateGameCallback = (updatedGame) => {
    const games = [...this.state.games];
    const gameIndex = games.findIndex((game) => game.id === updatedGame.id);
    if (gameIndex === -1) {
      const game = this.buildGameWithChannel(updatedGame, this.state.user, this.state.socket);
      games.push(game);
      this.props.onNotificationOpen(`You have been invited to ${game.name}`);
    } else {
      const game = this.updateGame(games[gameIndex], updatedGame);
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
    const games = _.cloneDeep(this.state.games);
    const game = games.find((game) =>
      game.id === newMessage.game_id
    );

    game.unreadMessageCount++;
    game.lastMessageAt = newMessage.created_at;
    game.messages = [newMessage, ...game.messages];

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
    const { games, invitations } = this.state;
    const updatedInvitations = game.pending ? [...invitations, game] : invitations;
    if (game.users_games.find((users_game) => users_game.user_id === this.state.user.id).state !== 'host') {
      this.props.onNotificationOpen(`You have been invited to ${game.name}`);
    }
    this.setState({invitations: updatedInvitations, games: [...games, game]});
  };

  leaveGameCallback = (userGame) => {
    const { games } = this.state;
    const gameIndex = games.findIndex((game) => game.id === userGame.game_id);
    if (gameIndex >= 0) {
      games[gameIndex].channel.leave();
      const clonedGames = games.slice(0);
      clonedGames.splice(gameIndex, 1);
      const invitations = clonedGames.filter((game) => game.pending)
      this.setState({invitations, games: clonedGames});
    }
  };

  buildFriends = (user, friendships) => (
    friendships.reduce((accumulator, friendship) => {
      const attribute = friendship.user.id === user.id ? 'friend' : 'user';
      const friend = friendship[attribute];
      accumulator[friend.id] = {
        id: friend.id,
        requestId: friendship.id,
        username: friend.username,
        avatar: friend.avatar,
        state: friendship.state,
        requestId: friendship.id,
        requestAt: friendship.created_at,
        userRequest: friendship.user.id === user.id
      }
      return accumulator;
    }, {})
  );

  newFriendRequestCallback = (friendship) => {
    const attribute = friendship.user.id === this.state.user.id ? 'friend' : 'user';
    const friend = friendship[attribute];
    const friends = {...this.state.friends};
    friends[friend.id] = {
      id: friend.id,
      requestId: friendship.id,
      username: friend.username,
      avatar: friend.avatar,
      state: friendship.state,
      requestId: friendship.id,
      requestAt: friendship.created_at,
      userRequest: friendship.user.id === this.state.user.id
    };
    this.setState({friends}, () => {
      if (attribute === 'friend') {
        this.props.onNotificationOpen(`${friend.username} has been sent a friend request.`);
      } else {
        this.props.onNotificationOpen(`${friend.username} has sent you a friend request.`);
      }
    });
  };

  friendRequestUpdatedCallback = (friendship) => {
    const attribute = friendship.user.id === this.state.user.id ? 'friend' : 'user';
    const friend = friendship[attribute];
    const friends = _.cloneDeep(this.state.friends);
    friends[friend.id].state = friendship.state;
    this.setState({friends}, () => {
      if (friendship.state === 'accepted') {
        if (attribute === 'user') {
          this.props.onNotificationOpen(`You are now friends with ${friend.username}.`);
        } else {
          this.props.onNotificationOpen(`${friend.username} has accepted your friend request.`);
        }
      }
    });
  };

  pendingFriendRequests = () => (
    Object.values(this.state.friends).reduce((accumulator, friend) => {
      if (friend.state === 'pending' && !friend.userRequest) {
        accumulator.push(friend);
      }
      return accumulator;
    }, [])
  );

  acceptedFriendRequests = () => (
    Object.values(this.state.friends).reduce((accumulator, friend) => {
      if (friend.state === 'accepted') accumulator.push(friend);
      return accumulator;
    }, [])
  );

  render() {
    if (this.state._loading) {
      return <CircularProgress />;
    }
    return (
      <div>
        <Header
          invitations={this.state.invitations}
          user={this.state.user}
          friends={this.pendingFriendRequests()}
          onNotificationOpen={this.props.onNotificationOpen}
        />
        <div style={{'margin-top': '64px', 'margin-bottom': '56px'}}>
          <AuthenticatedRoute
            path='/games'
            component={Games}
            games={this.state.games}
            friends={this.acceptedFriendRequests()}
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
                  friends={this.state.friends}
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
            friends={this.acceptedFriendRequests()}
            user={this.state.user}
            onNotificationOpen={this.props.onNotificationOpen}
          />
          <AuthenticatedRoute
            path='/contacts'
            user={this.state.user}
            friends={this.acceptedFriendRequests()}
            component={Contacts}
          />
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
          user={this.state.user}
        />
      </div>
    );
  }
}

export default ChatContainer;
