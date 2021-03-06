import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class SessionDialog extends Component {
  render() {
    const { fullScreen, location } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={true}
        aria-labelledby="responsive-dialog-title"
      >
      <DialogTitle>
        Support
      </DialogTitle>
      <DialogContent>
        <p>For all questions, and support issues, please contact <a href="mailto:thomas@blakey.co.uk">thomas@blakey.co.uk</a></p>
        <p><a href="https://www.iubenda.com/privacy-policy/89511121">Privacy Policy</a></p>
        <h4>FAQ</h4>
        <h5>How do I invite other users?</h5>
        <p>At present the app only supports inviting other users by sending them the link generated by a new game. Then clicking on the add friend icon within the game itself once they join. In the future we intend to add the option for friends to be added without needing to create a game.</p>
        <h5>Will other roles be added to the game in the future?</h5>
        <p>Yes, we intend to continuously improve the game of werewolf within the app, and who knows, we may even add more games in the future</p>
        <h5>I don't know enough people to have a game with 8 players</h5>
        <p>Sorry to hear that, how about asking the people you have already invited to share the link further? We are coming up with ways for people to enjoy WolfChat with less people.</p>
        <h5>I want to play ladder matches with strangers</h5>
        <p>WolfChat has no plans to support playing with strangers. We believe that playing with friends is the safest and most enjoyable way of enjoying this game. The game of werewolf is best enjoyed with the people you know.</p>
        <h5>How do I block users?</h5>
        <p>Please contact <a href="mailto:thomas@blakey.co.uk">thomas@blakey.co.uk</a> as soon as possible with your username and the user you want to block's username, and the user will be blocked from contacting you</p>
        <h5>Under GDPR, I would like to request all my data be removed</h5>
        <p>Please contact <a href="mailto:thomas@blakey.co.uk">thomas@blakey.co.uk</a> who will be able to remove all your personal data</p>
      </DialogContent>
      </Dialog>
    );
  }
}

export default withMobileDialog()(SessionDialog);
