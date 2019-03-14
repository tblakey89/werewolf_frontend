import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import NotificationIcon from '@material-ui/icons/Notifications';
import AccountCircle from '@material-ui/icons/AccountCircle';

class UserAvatar extends Component {

  currentUser = () => {
    if (this.props.user.id === this.props.currentUser.id) return this.props.user;
    return this.props.currentUser;
  }

  render() {
    if (this.props.currentUser === null) {
      return (
        <Avatar>
          <NotificationIcon style={{ fontSize: 36 }}/>
        </Avatar>
      );
    }
    let avatar = this.currentUser().avatar;
    if (avatar === null) {
      return (
        <Avatar>
          <AccountCircle style={{ fontSize: 36 }}/>
        </Avatar>
      );
    }
    return (
      <Avatar
        src={avatar}
      />
    );
  };
}

export default UserAvatar;
