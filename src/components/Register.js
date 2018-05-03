import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';

class Register extends Component {
  render() {
    return (
      <div>
        <DialogTitle>
          Sign Up To Werewolf Chat
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter your details to create an account.
          </DialogContentText>
          <TextField
            autoFocus
            id="username"
            label="Username"
            type="text"
            fullWidth
            style={{'margin-top': '20px'}}
          />
          <TextField
            id="email"
            label="Email Address"
            type="email"
            fullWidth
          />
          <TextField
            id="password"
            label="Password"
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

export default Register;
