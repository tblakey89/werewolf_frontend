import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import User from '../api/user';
import UserValidation from '../validation/userValidation';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class Settings extends Component {
  state = {
    fields: {
      password: ''
    },
    fieldErrors: {},
    errored: true,
    submitted: false,
    authenticated: true
  };

  handleChange = (name) => (event) => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};

    fields[name] = event.target.value;
    fieldErrors[name] = UserValidation.checkUpdateErrors(name)(event.target.value);
    const errored = this.isErrored(fieldErrors);

    this.setState({ fields, fieldErrors, errored });
  };

  onFormSubmit = (event) => {
    event.preventDefault();
    const fieldErrors = this.getFieldErrors();
    const submitted = true;
    const errored = !!fieldErrors.password;
    this.setState({ fieldErrors, errored, submitted });

    if (!this.state.errored) {
      User.update(
        this.props.user.id,
        this.state.fields,
        this.successfulCreateCallback,
        this.errorOnCreateCallback
      );
    }
  };

  isErrored = (fieldErrors) => {
    return Object.keys(fieldErrors).some((key) => {
      return fieldErrors[key];
    });
  };

  getFieldErrors = () => {
    return {
      password: UserValidation.checkUpdateErrors('password')(this.state.fields.password),
    };
  };

  showFieldError = () => {
    return this.state.submitted && this.state.fieldErrors.password;
  };

  successfulCreateCallback = (response) => {
    this.setState({submitted: true});
    this.props.onNotificationOpen('Account updated.')
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

  handleSignOut = () => {
    localStorage.removeItem('jwt');
    this.setState({ authenticated: false });
  };

  render() {
    const { classes } = this.props;

    if (!this.state.authenticated) {
      return (<Redirect to='/signin'/>)
    } else {
      return (
        <form className={classes.root} onSubmit={this.onFormSubmit}>
          <List subheader={<ListSubheader>Settings</ListSubheader>}>
            <ListItem>
              <ListItemText primary="Username" />
              <ListItemSecondaryAction id="username">
                {this.props.user.username}
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Email" />
              <ListItemSecondaryAction id="email">
                {this.props.user.email}
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <ListItemText primary="Update Password" />
              <ListItemSecondaryAction>
                <TextField
                  id="password"
                  label="Password"
                  type="password"
                  margin="normal"
                  onChange={this.handleChange('password')}
                  error={!!this.showFieldError('password')}
                  helperText={this.showFieldError('password')}
                />
              </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
              <Button
                id="update"
                variant="raised"
                color="primary"
                type="submit"
              >
                Update
              </Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Want to log out?" />
              <ListItemSecondaryAction>
                <Button
                  id="logOut"
                  variant="raised"
                  color="primary"
                  onClick={this.handleSignOut}>
                  Log Out
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </form>
      );
    }
  }
}

export default withStyles(styles)(Settings);
