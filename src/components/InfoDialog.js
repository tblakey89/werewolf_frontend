import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withRouter } from "react-router";
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import MessageIcon from '@material-ui/icons/Message';
import IconButton from '@material-ui/core/IconButton';
import UserAvatar from './UserAvatar';
import Conversation from '../api/conversation';

class InfoDialog extends Component {
  state = {
    users: {},
  };

  playerDisplay = (player) => {
    const usersGame = this.props.users[player.id];
    if (this.props.gameState === 'initialized') {
      return usersGame.state;
    } else {
      return `${player.alive ? 'Alive' : 'Dead'}, Role: ${player.role}`
    }
  };

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


  renderUsers = () => {
    if (this.props.gameState === 'initialized' || this.props.gameState === 'ready') {
      return this.renderInvitations();
    }
    return this.renderPlayers();
  };

  renderPlayers = () => (
    Object.values(this.props.players).map((player, index) => (
      <div key={player.id}>
        {this.props.users && this.props.users[player.id] &&
          <ListItem>
            <UserAvatar
              user={this.props.user}
              currentUser={this.props.users[player.id].user}
            />
            <ListItemText
              primary={this.props.users[player.id].user.username}
              secondary={`${player.alive ? 'Alive' : 'Dead'}, Role: ${player.role}`}
            />
            {this.props.user.id !== player.id &&
              <ListItemSecondaryAction>
                <IconButton
                  aria-haspopup="true"
                  color="primary"
                  onClick={this.createConversation(player.id)}
                >
                  <MessageIcon style={{ fontSize: 36 }} />
                </IconButton>
              </ListItemSecondaryAction>
            }
          </ListItem>
        }
        {index !== this.props.players.length - 1 && <Divider />}
      </div>
    ))
  );

  renderInvitations = () => {
    return Object.values(this.props.users || []).map((user, index) => (
      <div key={user.id}>
        <ListItem>
          <UserAvatar
            user={this.props.user}
            currentUser={user.user}
          />
          <ListItemText
            primary={user.user.username}
            secondary={user.state}
          />
          {this.props.user.id !== user.user.id &&
            <ListItemSecondaryAction>
              <IconButton
                aria-haspopup="true"
                color="primary"
                onClick={this.createConversation(user.user.id)}
              >
                <MessageIcon style={{ fontSize: 36 }} />
              </IconButton>
            </ListItemSecondaryAction>
          }
        </ListItem>
        {index !== this.props.users.length - 1 && <Divider />}
      </div>
    ))
  };

  render() {
    const { fullScreen } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {"Game Info"}
        </DialogTitle>
        <List>
          {this.renderUsers()}
        </List>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary" id="close">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

InfoDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withRouter(InfoDialog));
