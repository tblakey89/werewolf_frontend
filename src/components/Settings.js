import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import List, {
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from 'material-ui/List';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class Settings extends Component {
  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root}>
        <List subheader={<ListSubheader>Settings</ListSubheader>}>
          <ListItem>
            <ListItemText primary="Username" />
            <ListItemSecondaryAction>
              tblakey89
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" />
            <ListItemSecondaryAction>
              tomblakey89@googlemail.com
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Update Password" />
            <ListItemSecondaryAction>
              <TextField
                id="password"
                margin="normal"
                type="password"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <ListItemText primary="Confirm Password" />
            <ListItemSecondaryAction>
              <TextField
                id="confirmPassword"
                margin="normal"
                type="password"
              />
            </ListItemSecondaryAction>
          </ListItem>
          <ListItem>
            <Button variant="raised" color="primary">
              Update
            </Button>
          </ListItem>
          <ListItem>
            <ListItemText primary="Want to log out?" />
            <ListItemSecondaryAction>
              <Button
                variant="raised"
                color="primary"
                component={Link}
                to={`/signin`}>
                Log Out
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </form>
    );
  }
}

export default withStyles(styles)(Settings);
