import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import queryString from 'query-string';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import User from '../api/user';
import UserValidation from '../validation/userValidation';

// tests, test redirect after 400 error

class NewPassword extends Component {
  constructor(props) {
    super(props);
    const params = queryString.parse(props.location.search);
    this.state = {
      fields: {
        password: '',
        id: params.forgotten_password_token
      },
      fieldErrors: {},
      errored: true,
      submitted: false,
      sent: false
    };
  }

  handleChange = (event) => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};

    fields.password = event.target.value;
    fieldErrors.password = UserValidation.checkErrors('password')(event.target.value);
    const errored = !!fieldErrors.password;

    this.setState({ fields, fieldErrors, errored });
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = this.getFieldErrors();
    const submitted = true;
    const errored = !!fieldErrors.password;
    this.setState({ fieldErrors, errored, submitted });

    if (!this.state.errored) {
      User.newPassword(
        this.state.fields.id,
        this.state.fields.password,
        this.successfulCreateCallback,
        this.errorOnCreateCallback
      );
    }
  };

  getFieldErrors = () => {
    return {
      password: UserValidation.checkErrors('password')(this.state.fields.password),
    };
  };

  showFieldError = () => {
    return this.state.submitted && this.state.fieldErrors.password;
  };

  successfulCreateCallback = (response) => {
    this.setState({sent: true});
    this.props.onNotificationOpen('Password updated.')
  };

  errorOnCreateCallback = (error) => {
    if (error instanceof Error) {
      this.props.onNotificationOpen('Server error.')
    } else {
      const serverFieldErrors = {
        password: error.error
      }
      this.props.onNotificationOpen('Invalid token.')
      this.setState({ fieldErrors: serverFieldErrors, errored: true, sent: true });
    }
  };

  render() {
    if (this.state.sent) {
      return (<Redirect to='/signin'/>)
    } else {
      return (
        <form onSubmit={this.onFormSubmit}>
          <DialogTitle>
            New Password
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please update your password.
            </DialogContentText>
            <TextField
              autoFocus
              id="password"
              label="Password"
              type="password"
              onChange={this.handleChange}
              fullWidth
              error={!!this.showFieldError()}
              helperText={this.showFieldError()}
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
              type="submit">
              Create
            </Button>
          </DialogActions>
        </form>
      );
    }
  }
}

export default NewPassword;
