import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddIcon from '@material-ui/icons/Add';
import NewChatDialog from './NewChatDialog';

const styles = theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class ChatList extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <List component="nav">
        <Link to={`/chat`}>
          <ListItem button>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText primary="Thomas Blakey" secondary="Jan 9, 2014" />
          </ListItem>
        </Link>
        <Link to={`/chat`}>
          <ListItem button>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText primary="Giang Blakey" secondary="Jan 7, 2014" />
          </ListItem>
        </Link>
        <Link to={`/chat`}>
          <ListItem button>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText primary="Teddy Blakey" secondary="July 20, 2014" />
          </ListItem>
        </Link>
        <Button variant="fab" className={classes.fab} onClick={this.handleClickOpen}>
          <AddIcon />
        </Button>
        <NewChatDialog
          open={this.state.open}
          onClose={this.handleClose}
        />
      </List>
    );
  }
}

export default withStyles(styles)(ChatList);
