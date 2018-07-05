import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';

class Chat extends Component {
  componentDidMount() {
    this.setMessagesAsRead();
  }

  componentDidUpdate(prevProps) {
    this.setMessagesAsRead();
  }

  setMessagesAsRead = () => {
    if (!this.props.conversation) return;
    if (this.props.conversation.unreadMessageCount !== 0) {
      this.props.setAsRead(this.props.conversation);
    }
  }

  renderConversations = () => {
    const { conversation } = this.props;
    if (!conversation) return [];
    return conversation.messages.slice().sort((message_a, message_b) => (
      message_a.created_at - message_b.created_at
    )).map((message) => (
      <ListItem key={message.id}>
        <Avatar>
          <AccountCircle style={{ fontSize: 36 }} />
        </Avatar>
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
        {this.renderConversations()}
      </List>
    );
  }
}

export default Chat;
