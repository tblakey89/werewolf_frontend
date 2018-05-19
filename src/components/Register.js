import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import User from '../api/user';
import UserValidation from '../validation/userValidation';

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
    this.props.onNotificationOpen('Created account')
  };

  errorOnCreateCallback = (error) => {
    if (error instanceof Error) {
      this.props.onNotificationOpen('Server error.')
    } else {
      const errors = error.errors;
      const reducer = (accumulator, key) => {
        accumulator[key] = errors[key][0];
        return accumulator;
      };
      const serverFieldErrors = Object.keys(errors).reduce(reducer, {});
      this.setState({ fieldErrors: serverFieldErrors, errored: true });
    }
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
              style={{'marginTop': '20px'}}
              error={!!this.showFieldError('username')}
              helperText={this.showFieldError('username')}
            />
            <TextField
              id="email"
              label="Email Address"
              type="email"
              onChange={this.handleChange('email')}
              style={{'marginTop': '20px'}}
              fullWidth
              error={!!this.showFieldError('email')}
              helperText={this.showFieldError('email')}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              onChange={this.handleChange('password')}
              style={{'marginTop': '20px'}}
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
