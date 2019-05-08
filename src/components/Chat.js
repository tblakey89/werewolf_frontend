import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FriendRequestButton from './FriendRequestButton';
import UserAvatar from './UserAvatar';

const styles = theme => ({
  chatHeader: {
    [theme.breakpoints.down('sm')]: {
      top: '55px'
    },
    [theme.breakpoints.up('sm')]: {
      top: '64px'
    },
  },
});

class Chat extends Component {
  componentDidMount() {
    this.setMessagesAsRead();
    window.scrollTo(0,document.body.scrollHeight);
    if(this.props.conversation) this.props.conversation.channel.push('read_conversation');
  }

  componentDidUpdate(prevProps) {
    this.setMessagesAsRead();
    if (!prevProps.conversation) return;
    if (this.props.conversation.messages.length > prevProps.conversation.messages.length) {
      window.scrollTo(0,document.body.scrollHeight);
    }
  }

  setMessagesAsRead = () => {
    if (!this.props.conversation) return;
    if (this.props.conversation.unreadMessageCount !== 0) {
      this.props.setAsRead(this.props.conversation);
      this.props.conversation.channel.push('read_conversation');
    }
  }

  conversationName = () => {
    const { conversation } = this.props;
    if (conversation === undefined) return;
    if (conversation.name) return conversation.name;

    return conversation.users.filter((user) => (
      this.props.user ? user.id !== this.props.user.id : true
    )).map((user) => user.username).join(', ');
  };

  otherUser = () => (
    this.props.conversation.users.find((user) => (
      this.props.user ? user.id !== this.props.user.id : false
    ))
  );

  renderMessages = () => {
    const { conversation } = this.props;
    if (!conversation) return [];
    return conversation.messages.slice().sort((message_a, message_b) => (
      message_a.created_at - message_b.created_at
    )).map((message) => (
      <ListItem key={message.id}>
        <UserAvatar
          user={this.props.user}
          currentUser={message.sender}
        />
        <ListItemText
          primary={message.bot ? "bot" : message.sender.username}
          secondary={message.body}
        />
      </ListItem>
    ))
  };

  render() {
    return (
      <React.Fragment>
        <AppBar position="fixed" color="default" className={this.props.classes.chatHeader}>
          <Toolbar>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              {this.conversationName()}
            </Typography>
            <div>
              {this.props.conversation && this.props.conversation.users.length === 2 &&
                <FriendRequestButton
                  friends={this.props.friends}
                  friendId={this.otherUser().id}
                />
              }
            </div>
          </Toolbar>
        </AppBar>
        <List>
          {this.renderMessages()}
        </List>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Chat);
