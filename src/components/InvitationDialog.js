import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import TickIcon from '@material-ui/icons/Done';
import CrossIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Invitation from '../api/invitation';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class InvitationDialog extends Component {
  handleClick = (invitation, newInvitationState) => () => {
    const usersGame = invitation.users_games.find((users_game) => users_game.user_id === this.props.user.id)
    Invitation.update(usersGame.id, newInvitationState, () => {
      this.props.onNotificationOpen(`${newInvitationState} invite`)
    }, () => {

    });
  }

  sortedInvitations = () => (
    this.props.invitations.sort((inviteA, inviteB) => {
      if (inviteA.invitationAt > inviteB.invitationAt) return -1;
      return 1;
    })
  );

  renderInvitations = () => (
    this.sortedInvitations().map((invitation, index) => (
      <div key={invitation.id}>
        <ListItem>
          <ListItemText onClick={this.props.onClose}>
            <Link to={`/game`}>{invitation.name}</Link>
          </ListItemText>
          <Button
            mini
            variant="fab"
            color="primary"
            className={this.props.classes.button}
            onClick={this.handleClick(invitation, 'accepted')}
          >
            <TickIcon />
          </Button>
          <Button
            mini
            variant="fab"
            color="secondary"
            className={this.props.classes.button}
            onClick={this.handleClick(invitation, 'rejected')}
          >
            <CrossIcon />
          </Button>
        </ListItem>
        {index !== this.props.invitations.length - 1 && <Divider />}
      </div>
    ))
  );

  render() {
    const { fullScreen, classes } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {"Invitations"}
        </DialogTitle>
        <List>
          {this.renderInvitations()}
          {this.props.invitations.length === 0 && (
            <ListItem>
              <ListItemText>
                No pending invitations
              </ListItemText>
            </ListItem>
          )}
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

InvitationDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(styles)(InvitationDialog));
