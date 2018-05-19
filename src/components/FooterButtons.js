import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Icon from '@material-ui/core/Icon';
import MessageIcon from '@material-ui/icons/Message';
import ContactsIcon from '@material-ui/icons/Contacts';
import GamesIcon from '@material-ui/icons/Games';
import SettingsIcon from '@material-ui/icons/Settings';

class FooterButtons extends Component {
  render() {
    return (
      <BottomNavigation>
        <BottomNavigationAction
          label="Games"
          component={Link}
          to={`/games`}
          icon={<GamesIcon />}
        />
        <BottomNavigationAction
          label="Messages"
          icon={<MessageIcon />}
          component={Link}
          to={`/chats`}
        />
        <BottomNavigationAction
          label="Contacts"
          icon={<ContactsIcon />}
          component={Link}
          to={`/contacts`}
        />
        <BottomNavigationAction
          label="Settings"
          icon={<SettingsIcon />}
          component={Link}
          to={`/settings`}
        />
      </BottomNavigation>
    );
  }
}

export default FooterButtons;
