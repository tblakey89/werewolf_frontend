import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';

class UserAvatar extends Component {

  currentUser = () => {
    if (this.props.user.id === this.props.currentUser.id) return this.props.user;
    return this.props.currentUser;
  }

  render() {
    return (
      <Avatar
        src={this.currentUser().avatar}
      />
    );
  };
}

export default UserAvatar;
