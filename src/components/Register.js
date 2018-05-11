import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import User from '../api/user';
import UserValidation from '../validation/userValidation';

// do we need a container component for connecting to server?
// test test test
// some kind of notification if create successful
// what if 500 error?

class Register extends Component {
  state = {
    fields: {
      username: '',
      email: '',
      password: ''
    },
    fieldErrors: {},
    errored: true,
    submitted: false,
    authenticated: false
  };

  handleChange = (name) => (event) => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};

    fields[name] = event.target.value;
    fieldErrors[name] = UserValidation.checkErrors(name)(event.target.value);
    const errored = this.isErrored(fieldErrors);

    this.setState({ fields, fieldErrors, errored });
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = this.getFieldErrors();
    const submitted = true;
    const errored = this.isErrored(fieldErrors);
    this.setState({ fieldErrors, errored, submitted });

    if (!this.state.errored) {
      User.create(this.state.fields, this.successfulCreateCallback, this.errorOnCreateCallback);
    }
  };

  isErrored = (fieldErrors) => {
    return Object.keys(fieldErrors).some((key) => {
      return fieldErrors[key];
    });
  };

  getFieldErrors = () => {
    return {
      username: UserValidation.checkErrors('username')(this.state.fields.username),
      email: UserValidation.checkErrors('email')(this.state.fields.email),
      password: UserValidation.checkErrors('password')(this.state.fields.password)
    };
  };

  showFieldError = (name) => {
    return this.state.submitted && this.state.fieldErrors[name];
  };

  successfulCreateCallback = (response) => {
    this.setState({authenticated: true});
  };

  errorOnCreateCallback = (error) => {
    const errors = error.errors;
    const reducer = (accumulator, key) => {
      accumulator[key] = errors[key][0];
      return accumulator;
    };
    const serverFieldErrors = Object.keys(errors).reduce(reducer, {});
    this.setState({ fieldErrors: serverFieldErrors, errored: true });
  };

  render() {
    if (this.state.authenticated) {
      return (<Redirect to='/games'/>)
    } else {
      return (
        <form onSubmit={this.onFormSubmit}>
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
              onChange={this.handleChange('username')}
              fullWidth
              style={{'margin-top': '20px'}}
              error={!!this.showFieldError('username')}
              helperText={this.showFieldError('username')}
            />
            <TextField
              id="email"
              label="Email Address"
              type="email"
              onChange={this.handleChange('email')}
              fullWidth
              error={!!this.showFieldError('email')}
              helperText={this.showFieldError('email')}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              onChange={this.handleChange('password')}
              fullWidth
              error={!!this.showFieldError('password')}
              helperText={this.showFieldError('password')}
            />
          </DialogContent>
          <DialogActions>
            <Button
              color="primary"
              component={Link}
              to={`/signin`}>
              Cancel
            </Button>
            <Button
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

export default Register;
