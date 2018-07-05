import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import NewChatDialog from './NewChatDialog';

// change url without redirect?

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  bold: {
    'font-weight': 'bold',
  },
});

class ChatList extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  activeConversations = () => (
    this.props.conversations.filter((conversation) => {
      return conversation.messages.length > 0;
    })
  );

  conversationName = (conversation) => {
    if (conversation.name) return conversation.name;

    return conversation.users.filter((user) => (
      this.props.user ? user.id !== this.props.user.id : true
    )).map((user) => user.username).join(', ');
  };

  renderConversations = () => (
    this.activeConversations().sort((conversation_a, conversation_b) => (
      conversation_b.lastMessageAt - conversation_a.lastMessageAt
    )).map((conversation) => (
      <Link to={`/chat/${conversation.id}`} key={conversation.id}>
        <ListItem button>
          <Avatar>
            <AccountCircle style={{ fontSize: 36 }} />
          </Avatar>
          <ListItemText
            primary={
              <span className={conversation.unreadMessageCount > 0 ? this.props.classes.bold : ''}>
                {this.conversationName(conversation)}
              </span>
            }
            secondary={
              <span className={conversation.unreadMessageCount > 0 ? this.props.classes.bold : ''}>
                {moment(conversation.lastMessageAt).format('MMMM Do YYYY, h:mm:ss a')}
              </span>
            }
          />
        </ListItem>
      </Link>
    ))
  );

  render() {
    const { classes } = this.props;

    return (
      <List component="nav">
        { this.activeConversations().length > 0 ?
          this.renderConversations()
          :
          <ListItem>
            <ListItemText
              primary="Click '+' to add a conversation."
            />
          </ListItem>
        }
        <Button variant="fab" className={classes.fab} onClick={this.handleClickOpen}>
          <AddIcon />
        </Button>
        <NewChatDialog
          open={this.state.open}
          onClose={this.handleClose}
          onNotificationOpen={this.props.onNotificationOpen}
        />
      </List>
    );
  }
}

export default withStyles(styles)(ChatList);
