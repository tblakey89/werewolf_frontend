import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import FriendRequest from '../api/friendRequest';

class FriendRequestButton extends Component {
  handleClick = () => {
    FriendRequest.create(
      this.props.friendId,
      this.successfulCallback,
      this.errorCallback
    );
  };

  successCallback = () => {

  };

  errorCallback = () => {

  };

  notCurrentFriend = () => !this.props.friends[this.props.friendId];

  render() {
    return (
      <React.Fragment>
        {this.notCurrentFriend() &&
          <IconButton
            aria-haspopup="true"
            color="primary"
            onClick={this.handleClick}
          >
            <PersonAddIcon style={{ fontSize: 36 }} />
          </IconButton>
        }
      </React.Fragment>
    );
  }
}

FriendRequestButton.propTypes = {
  friends: PropTypes.object.isRequired,
  friendId: PropTypes.number.isRequired,
};

export default FriendRequestButton;
