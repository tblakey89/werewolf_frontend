import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { Link } from 'react-router-dom';
import List, { ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import Button from 'material-ui/Button';
import Avatar from 'material-ui/Avatar';
import SunIcon from '@material-ui/icons/Brightness5';
import MoonIcon from '@material-ui/icons/Brightness3';
import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import TickIcon from '@material-ui/icons/Done';
import CrossIcon from '@material-ui/icons/Close';
import MailIcon from '@material-ui/icons/MailOutline';
import AddIcon from '@material-ui/icons/Add';
import NewGameDialog from './NewGameDialog';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class Games extends Component {
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
      <div>
        <List component="nav">
          <ListItem button>
            <Link to={`/game`}><MailIcon style={{ fontSize: 36 }} /></Link>
            <ListItemText secondary="Accept invite to join">
              <Link to={`/game`}>Invitation: New Game</Link>
            </ListItemText>
            <ListItemSecondaryAction>
              <Button mini variant="fab" color="primary" className={classes.button}>
                <TickIcon />
              </Button>
              <Button mini variant="fab" color="secondary" className={classes.button}>
                <CrossIcon />
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          <Link to={`/game`}>
            <ListItem button>
              <HourglassIcon style={{ fontSize: 36 }} />
              <ListItemText primary="New Game" secondary="Waiting for players..." />
            </ListItem>
          </Link>
          <Link to={`/game`}>
            <ListItem button>
              <SunIcon style={{ fontSize: 36 }} />
              <ListItemText primary="Thomas Blakey's Game" secondary="Day 3" />
            </ListItem>
          </Link>
          <Link to={`/game`}>
            <ListItem button>
              <MoonIcon style={{ fontSize: 36 }} />
              <ListItemText primary="Werewolf game" secondary="Night 5" />
            </ListItem>
          </Link>
          <Link to={`/game`}>
            <ListItem button>
              <SunIcon style={{ fontSize: 36 }} />
              <ListItemText primary="Teddy Bear Game" secondary="Day 1" />
            </ListItem>
          </Link>
          <Button variant="fab" className={classes.fab} onClick={this.handleClickOpen}>
            <AddIcon />
          </Button>
        </List>
        <NewGameDialog
          open={this.state.open}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Games);
