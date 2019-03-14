import React, { Component } from 'react';
import { Link, Redirect  } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Button from '@material-ui/core/Button';
import Invitation from '../api/invitation';

class InvitationTokenDialog extends Component {
  state = {
    gameName: undefined,
    errored: false,
    errorMessage: undefined,
    redirect: false,
    isOpen: true,
    gameId: undefined,
  };

  componentDidMount() {
    Invitation.show(this.props.token, this.successCallback, this.errorCallback);
  }

  successCallback = (data) => {
    this.setState({gameName: data.name});
  };

  errorCallback = (error) => {
    this.setState({errored: true, errorMessage: error.error});
  };

  handleJoiningGame = () => {
    Invitation.create(this.props.token, this.joinSuccessCallback, this.errorCallback);
  };

  joinSuccessCallback = (data) => {
    this.setState({gameId: data.game_id, redirect: true});
  };

  handleClose = () => {
    this.setState({redirect: true});
  }

  redirectTo = () => {
    if (this.state.gameId) {
      return `/game/${this.state.gameId}`;
    }
    return '/games';
  };

  render() {
    const { fullScreen } = this.props;

    if (this.state.redirect) {
      return (<Redirect to={this.redirectTo()}/>)
    } else {
      return (
        <Dialog
          fullScreen={fullScreen}
          fullWidth
          open={this.state.isOpen}
          aria-labelledby="responsive-dialog-title"
        >
          {this.state.errored ? (
            <div>
              <DialogTitle>
                {this.state.errorMessage}
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Please press close to return to the app.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  id="close"
                  color="primary"
                  onClick={this.handleClose}
                >
                  Close
                </Button>
              </DialogActions>
            </div>
          ) : (
            <div>
              <DialogTitle>
                Would you like to join {this.state.gameName}?
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Press accept to join the game, otherwise press decline to return to the app.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  id="close"
                  onClick={this.handleClose}
                >
                  Decline
                </Button>
                <Button
                  color="primary"
                  id="submit"
                  onClick={this.handleJoiningGame}
                >
                  Accept
                </Button>
              </DialogActions>
            </div>
          )}
        </Dialog>
      );
    }
  }
}

export default withMobileDialog()(InvitationTokenDialog);
