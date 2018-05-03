import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

class ForgottenPassword extends Component {
  render() {
    return (
      <div>
        <DialogTitle>
          Forgotten Password?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email, and we will send you a link to change your password.
          </DialogContentText>
          <TextField
            autoFocus
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            style={{'margin-top': '20px'}}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.handleClose}
            color="primary"
            component={Link}
            to={`/signin`}>
            Cancel
          </Button>
          <Button
            onClick={this.handleClose}
            color="primary"
            component={Link}
            to={`/signin`}>
            Send
          </Button>
        </DialogActions>
      </div>
    );
  }
}

export default ForgottenPassword;
