import React, { Component } from 'react';
import { Link, Redirect  } from 'react-router-dom';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import User from '../api/user';
import UserValidation from '../validation/userValidation';

// test test test

class ForgottenPassword extends Component {
  state = {
    fields: {
      email: '',
    },
    fieldErrors: {},
    errored: true,
    submitted: false,
    sent: false
  };

  handleChange = (event) => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};

    fields.email = event.target.value;
    fieldErrors.email = UserValidation.checkErrors('email')(event.target.value);
    const errored = !!fieldErrors.email;

    this.setState({ fields, fieldErrors, errored });
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = this.getFieldErrors();
    const submitted = true;
    const errored = !!fieldErrors.email;
    this.setState({ fieldErrors, errored, submitted });

    if (!this.state.errored) {
      User.forgotPassword(this.state.fields, this.successfulCreateCallback, this.errorOnCreateCallback);
    }
  };

  getFieldErrors = () => {
    return {
      email: UserValidation.checkErrors('email')(this.state.fields.email),
    };
  };

  showFieldError = () => {
    return this.state.submitted && this.state.fieldErrors.email;
  };

  successfulCreateCallback = (response) => {
    this.setState({sent: true});
    this.props.onNotificationOpen('You will receive an email shortly.')
  };

  errorOnCreateCallback = (error) => {
    if (error instanceof Error) {
      this.props.onNotificationOpen('Server error.')
    } else {
      const serverFieldErrors = {
        email: error.error
      }
      this.setState({ fieldErrors: serverFieldErrors, errored: true });
    }
  };

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/games" } };

    if (this.state.sent) {
      return (<Redirect to={{pathname: `/signin`, state: {from: from}}}/>)
    } else {
      return (
        <form onSubmit={this.onFormSubmit}>
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
              onChange={this.handleChange}
              fullWidth
              style={{'margin-top': '20px'}}
              error={!!this.showFieldError()}
              helperText={this.showFieldError()}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color="primary"
              component={Link}
              to={{pathname: `/signin`, state: {from: from}}}>
              Cancel
            </Button>
            <Button
              color="primary"
              type="submit">
              Send
            </Button>
          </DialogActions>
        </form>
      );
    }
  }
}

export default ForgottenPassword;
