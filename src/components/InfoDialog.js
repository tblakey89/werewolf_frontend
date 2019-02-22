import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class InfoDialog extends Component {
  state = {
    users: {}
  };

  playerDisplay = (player) => {
    debugger;
    const usersGame = this.props.users[player.id];
    if (this.props.gameState === 'initialized') {
      return usersGame.state;
    } else {
      return `${player.alive ? 'Alive' : 'Dead'}, Role: ${player.role}`
    }
  };

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
          <ListItem button>
            <ListItemText
              primary={this.props.users[player.id].user.username}
              secondary={`${player.alive ? 'Alive' : 'Dead'}, Role: ${player.role}`}
            />
          </ListItem>
        }
        {index !== this.props.players.length - 1 && <Divider />}
      </div>
    ))
  );

  renderInvitations = () => (
    Object.values(this.props.users).map((user, index) => (
      <div key={user.id}>
        <ListItem button>
          <ListItemText
            primary={user.user.username}
            secondary={user.state}
          />
        </ListItem>
        {index !== this.props.users.length - 1 && <Divider />}
      </div>
    ))
  );

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

export default withMobileDialog()(InfoDialog);
