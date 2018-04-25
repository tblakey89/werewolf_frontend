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

class SignIn extends Component {
  render() {
    return (
      <div>
        <DialogTitle>
          Werewolf Chat
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sign into your account.
          </DialogContentText>
          <TextField
            autoFocus
            id="email"
            label="Email Address"
            type="email"
            fullWidth
            style={{'margin-top': '20px'}}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            fullWidth
          />
          <div style={{'margin-top': '20px'}}>
            <Button
              size="small"
              onClick={this.handleClose}
              color="primary"
              component={Link}
              to={`/forgotten_password`}
            >
              Forgotten Password?
            </Button>
            <Button
              size="small"
              onClick={this.handleClose}
              color="primary"
              component={Link}
              to={`/register`}
            >
              Create Account
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={this.handleClose}
            color="primary"
            component={Link}
            to={`/games`}>
            Sign In
          </Button>
        </DialogActions>
      </div>
    );
  }
}

export default SignIn;
