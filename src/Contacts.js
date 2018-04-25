import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';

class Contacts extends Component {
  render() {
    return (
      <List component="nav">
        <Link to={`/chat`}>
          <ListItem button>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText primary="Thomas Blakey" secondary="Jan 9, 2014" />
          </ListItem>
        </Link>
        <Link to={`/chat`}>
          <ListItem button>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText primary="Giang Blakey" secondary="Jan 7, 2014" />
          </ListItem>
        </Link>
        <Link to={`/chat`}>
          <ListItem button>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText primary="Teddy Blakey" secondary="July 20, 2014" />
          </ListItem>
        </Link>
      </List>
    );
  }
}

export default Contacts;
