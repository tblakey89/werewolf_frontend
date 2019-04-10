import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import UserAvatar from './UserAvatar';

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

  renderMessages = () => {
    // assuming no bot message will be sent here
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
          primary={message.sender.username}
          secondary={message.body}
        />
      </ListItem>
    ))
  };

  render() {
    return (
      <List>
        {this.renderMessages()}
      </List>
    );
  }
}

export default Chat;
