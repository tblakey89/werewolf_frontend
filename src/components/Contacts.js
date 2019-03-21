import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserAvatar from './UserAvatar';
import User from '../api/user';
import Conversation from '../api/conversation';

// need to test errorCallback, what happens if error?

class Contacts extends Component {
  state = {
    contacts: [],
    _loading: false,
    readyForRedirect: false,
  };

  componentDidMount() {
    this.setState({_loading: true})
    User.index((response) => {
      this.setState({contacts: response.users, _loading: false});
    }, (response) => {

    });
  }

  createConversation = (user_id) => () => {
    Conversation.create(
      { user_ids: [user_id] },
      this.successfulCreateCallback,
      this.errorOnCreateCallback
    );
  }

  successfulCreateCallback = (response) => {
    this.setState({readyForRedirect: true, conversation: response.conversation});
  };

  errorOnCreateCallback = () => {
    // notify
  }

  renderContacts = () => {
    if (this.state._loading) {
      return <CircularProgress />;
    }
    return (
      this.state.contacts.filter(user => user.id !== this.props.user.id).map((user) => (
        <ListItem
          button
          onClick={this.createConversation(user.id)}
          key={user.id}
        >
          <UserAvatar
            user={this.props.user}
            currentUser={user}
          />
          <ListItemText primary={user.username} secondary="" />
        </ListItem>
      ))
    );
  };

  render() {
    if (this.state.readyForRedirect) {
      return (<Redirect to={`/chat/${this.state.conversation.id}`}/>)
    } else {
      return (
        <List component="nav">
          { this.renderContacts() }
        </List>
      );
    }
  }
}

export default Contacts;
