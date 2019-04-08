import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import User from '../api/user';

const styles = {
  avatar: {
    width: 60,
    height: 60,
  },
};


class AvatarUploadForm extends Component {
  state = {
    file: undefined,
    errored: false,
  };

  handleFileChange = (event) => {
    this.setState({file: event.target.files[0]});
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    if (this.state.file) {
      User.avatar(
        this.props.user.id,
        this.state.file,
        this.successfulUploadCallback,
        this.errorUploadCallback
      );
    }
  };

  successfulUploadCallback = (response) => {
    this.setState({submitted: true, file: undefined, errored: false});
    this.props.onNotificationOpen('Account updated.')
  };

  errorUploadCallback = (error) => {
    this.setState({errored: true});
  };

  render() {
    return (
      <form onSubmit={this.handleFormSubmit}>
        <List subheader={<ListSubheader>Avatar</ListSubheader>}>
          {this.state.errored &&
            <ListItem>
              <span className='error'>There was an error uploading the avatar</span>
            </ListItem>
          }
          <ListItem>
            <Grid container justify="center" alignItems="center">
              <Avatar
                src={this.props.user.avatar}
                className={this.props.classes.avatar}
              />
            </Grid>
          </ListItem>
          <ListItem>
            <Input
              type="file"
              onChange={this.handleFileChange}
              error={this.state.errored}
            />
          </ListItem>
          <ListItem>
            <Button
              id="updateAvatar"
              variant="raised"
              color="primary"
              type="submit"
            >
              Update Avatar
            </Button>
          </ListItem>
        </List>
      </form>
    );
  }
}

export default withStyles(styles)(AvatarUploadForm);
