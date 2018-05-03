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

class NewPassword extends Component {
  render() {
    return (
      <div>
        <DialogTitle>
          New Password
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter a new password to access your account.
          </DialogContentText>
          <TextField
            autoFocus
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
          <TextField
            autoFocus
            id="passwordConfirm"
            label="Confirm Password"
            type="password"
            fullWidth
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
            Create
          </Button>
        </DialogActions>
      </div>
    );
  }
}

export default NewPassword;
