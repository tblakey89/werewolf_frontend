import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import NotificationIcon from '@material-ui/icons/Notifications';

class UserAvatar extends Component {

  currentUser = () => {
    if (this.props.user.id === this.props.currentUser.id) return this.props.user;
    return this.props.currentUser;
  }

  render() {
    if (this.props.currentUser === null) {
      return (
        <Avatar>
          <NotificationIcon/>
        </Avatar>
      );
    }
    return (
      <Avatar
        src={this.currentUser().avatar}
      />
    );
  };
}

export default UserAvatar;
