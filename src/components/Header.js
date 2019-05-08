import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { withRouter } from "react-router";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/MailOutline';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import InvitationDialog from './InvitationDialog';

const styles = theme => ({
  badge: {
    fontSize: 36
  }
});

class Header extends Component {
  state = {
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  invitationLength = () => {
    return this.props.invitations.length + this.props.friends.length;
  };

  renderIconWithBadge = (badgeNumber, component, props) => {
    if (badgeNumber === 0) {
      return (React.createElement(component, {className: this.props.classes.badge}));
    } else {
      return (
        <Badge
          badgeContent={badgeNumber >= 100 ? '99+' : badgeNumber}
          color="secondary"
        >
          {React.createElement(component, {className: this.props.classes.badge})}
        </Badge>
      )
    }
  };

  render() {
    const styles = {
      root: {
        flexGrow: 1,
      },
      flex: {
        flex: 1,
      },
      menuButton: {
        marginLeft: -12,
        marginRight: 20,
      },
    };

    return (
      <div style={{flexGrow: 1}}>
        <AppBar position="fixed">
          <Toolbar>
            <Route path='(/game|/chat)'  render={() => (
              <IconButton
                className={styles.menuButton}
                color="inherit"
                aria-label="Menu"
                onClick={this.props.history.goBack}
              >
                <BackIcon  style={{ fontSize: 36,  }} />
              </IconButton>
            )}/>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              <Switch>
                <Route path="/games" render={() => 'Games'}/>
                <Route path="/chats" render={() => 'Conversations'}/>
                <Route path="/contacts" render={() => 'Contacts'}/>
                <Route path="/settings" render={() => 'Settings'}/>
                <Route render={() => 'WolfChat'}/>
              </Switch>
            </Typography>
            <div>
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleClickOpen}
              >
                {this.renderIconWithBadge(this.invitationLength(), MailIcon)}
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <InvitationDialog
          open={this.state.open}
          onClose={this.handleClose}
          invitations={this.props.invitations}
          user={this.props.user}
          friends={this.props.friends}
          onNotificationOpen={this.props.onNotificationOpen}
        />
      </div>
    );
  }
}

export default withStyles(styles)(withRouter(Header));
