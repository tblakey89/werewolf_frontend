import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import TickIcon from '@material-ui/icons/Done';
import CrossIcon from '@material-ui/icons/Close';
import MailIcon from '@material-ui/icons/MailOutline';
import RoleDialog from './RoleDialog';
import InfoDialog from './InfoDialog';

// maybe users want to chat whilst waiting for it to start
// display block to get p tag on seperate lines

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class Game extends Component {
  state = {
    roleOpen: false,
    infoOpen: false,
    gameReady: false
  };

  handleRoleClickOpen = () => {
    this.setState({ roleOpen: true });
  };

  handleInfoClickOpen = () => {
    this.setState({ infoOpen: true });
  };

  handleClose = () => {
    this.setState({ roleOpen: false, infoOpen: false });
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              Thomas Blakey's Game<br/>
              <span style={{'font-size': 12}}>4 players. 8 minimum. 18 maximum</span>
            </Typography>
            <div>
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleRoleClickOpen}
              >
                <AccountCircle  style={{ fontSize: 36 }} />
              </IconButton>
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleInfoClickOpen}
              >
                <InfoIcon style={{ fontSize: 36 }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {!this.state.gameReady &&
          <List>
            <ListItem>
              <ListItemText>
                Accept invite:
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
          </List> }
          <List>
          <ListItem>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText
              primary="Thomas Blakey"
              secondary="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed risus turpis, sodales sit amet turpis quis, consequat ultricies est. Maecenas bibendum ligula non mattis ultricies. Morbi rutrum nisi erat, eu cursus lectus molestie id. Etiam id tincidunt elit."
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary="Giang Blakey"
              secondary="Cras nisi dolor, euismod eu dapibus eu, mollis vel lacus. Vestibulum quis massa quis risus consequat euismod at non ipsum. Vestibulum quis porta tellus. Ut vestibulum egestas lacus, ut tincidunt nisi ultrices eget. Suspendisse auctor venenatis arcu et condimentum. Aliquam sed blandit ex. Proin quis neque in odio convallis ullamcorper. Nam posuere tincidunt purus."
            />
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
          </ListItem>
          <ListItem>
            <Avatar>
              <AccountCircle style={{ fontSize: 36 }} />
            </Avatar>
            <ListItemText
              primary="Teddy Blakey"
              secondary="Curabitur vel sodales nisi. Maecenas egestas commodo diam."
            />
          </ListItem>
        </List>
        <RoleDialog
          open={this.state.roleOpen}
          onClose={this.handleClose}
        />
        <InfoDialog
          open={this.state.infoOpen}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Game);
