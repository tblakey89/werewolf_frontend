import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
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
  };

  componentDidMount() {
    window.scrollTo(0,0);
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
    this.props.history.push(`/chat/${response.conversation.id}`);
  };

  errorOnCreateCallback = () => {
    // notify
  }

  filteredAndSortedContacts = () => (
    this.state.contacts.filter(user => user.id !== this.props.user.id).sort((contactA, contactB) => {
      if (contactA.username < contactB.username) return -1;
      return 1;
    })
  );

  renderContacts = () => {
    if (this.state._loading) {
      return <CircularProgress />;
    }
    return (
      this.filteredAndSortedContacts().map((user) => (
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
    return (
      <List component="nav">
        { this.renderContacts() }
      </List>
    );
  }
}

export default withRouter(Contacts);
