import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Session from '../api/session';
import SessionValidation from '../validation/sessionValidation';

class SignIn extends Component {
  state = {
    fields: {
      email: '',
      password: ''
    },
    fieldErrors: {},
    errored: true,
    serverErrored: false,
    submitted: false,
    authenticated: false
  };

  handleChange = (name) => (event) => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};

    fields[name] = event.target.value;
    fieldErrors[name] = SessionValidation.checkErrors(name, event.target.value);
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
      Session.create(this.state.fields, this.successfulCreateCallback, this.errorOnCreateCallback);
    }
  };

  isErrored = (fieldErrors) => {
    return Object.keys(fieldErrors).some((key) => {
      return fieldErrors[key];
    });
  };

  getFieldErrors = () => {
    return {
      email: SessionValidation.checkErrors('email', this.state.fields.email),
      password: SessionValidation.checkErrors('password', this.state.fields.password)
    };
  };

  showFieldError = (name) => {
    return this.state.submitted && this.state.fieldErrors[name];
  };

  successfulCreateCallback = (response) => {
    this.setState({authenticated: true});
    this.props.onNotificationOpen('You have been signed in.')
  };

  errorOnCreateCallback = (error) => {
    if (error instanceof Error) {
      this.props.onNotificationOpen('Server error.')
    } else {
      this.setState({ serverErrored: true });
    }
  };

  render() {
    let { from } = this.props.location.state || { from: { pathname: "/games" } };

    if (this.state.authenticated) {
      return (<Redirect to={from}/>)
    } else {
      return (
        <form onSubmit={this.onFormSubmit}>
          <DialogTitle>
            Werewolf Chat
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {this.state.serverErrored ?
                <span className='error'>{'You have entered an incorrect email or password.'}</span>
              :
                'Sign into your account.'}
            </DialogContentText>
            <TextField
              autoFocus
              id="email"
              label="Email Address"
              type="email"
              fullWidth
              onChange={this.handleChange('email')}
              style={{marginTop: '20px'}}
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
            <div style={{marginTop: '20px'}}>
              <Button
                size="small"
                onClick={this.handleClose}
                color="primary"
                component={Link}
                to={{pathname: `/forgotten_password`, state: {from: from}}}
              >
                Forgotten Password?
              </Button>
              <Button
                size="small"
                onClick={this.handleClose}
                color="primary"
                component={Link}
                to={{pathname: `/register`, state: {from: from}}}
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
              type="submit">
              Sign In
            </Button>
          </DialogActions>
        </form>
      );
    }
  }
}

export default SignIn;
