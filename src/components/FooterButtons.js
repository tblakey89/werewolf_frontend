import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Badge from '@material-ui/core/Badge';
import Icon from '@material-ui/core/Icon';
import MessageIcon from '@material-ui/icons/Message';
import ContactsIcon from '@material-ui/icons/Contacts';
import GamesIcon from '@material-ui/icons/Games';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit * 2,
  },
});

class FooterButtons extends Component {
  renderIconWithBadge = (component, badgeNumber) => {
    if (badgeNumber === 0) {
      return (React.createElement(component, {}));
    } else {
      return (
        <Badge
          className={this.props.classes.margin}
          badgeContent={badgeNumber >= 100 ? '99+' : badgeNumber}
          color="secondary"
        >
          {React.createElement(component, {})}
        </Badge>
      )
    }
  };

  render() {
    return (
      <BottomNavigation>
        <BottomNavigationAction
          label="Games"
          component={Link}
          to={`/games`}
          icon={this.renderIconWithBadge(GamesIcon, this.props.unreadGameMessageCount)}
        />
        <BottomNavigationAction
          label="Messages"
          icon={this.renderIconWithBadge(MessageIcon, this.props.unreadMessageCount)}
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

export default withStyles(styles)(FooterButtons);
