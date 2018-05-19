import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import User from '../api/user';

// need to test errorCallback, what happens if error?

class Contacts extends Component {
  state = {
    contacts: [],
    _loading: false
  };

  componentDidMount() {
    this.setState({_loading: true})
    User.index((response) => {
      this.setState({contacts: response.users, _loading: false});
    }, (response) => {

    });
  }

  renderContacts = () => {
    if (this.state._loading) {
      return <CircularProgress />;
    }
    return (
      this.state.contacts.map((user) => (
        <Link to={`/chat`} key={user.id}>
          <ListItem button>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText primary={user.username} secondary="Jan 9, 2014" />
          </ListItem>
        </Link>
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

export default Contacts;
