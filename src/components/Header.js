import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/MailOutline';
import BackIcon from '@material-ui/icons/KeyboardArrowLeft';
import InvitationDialog from './InvitationDialog';

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
        <AppBar position="static">
          <Toolbar>
            <Route path='/chat'  render={() => (
              <Link to={`/chats`} className={'iconLink'}>
                <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
                  <BackIcon  style={{ fontSize: 36,  }} />
                </IconButton>
              </Link>
            )}/>
            <Route path='/game'  render={() => (
              <Link to={`/games`} className={'iconLink'}>
                <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
                  <BackIcon  style={{ fontSize: 36,  }} />
                </IconButton>
              </Link>
            )}/>
            <Typography variant="title" color="inherit" style={{flex: 1}}>
              Chat
            </Typography>
            <div>
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={this.handleClickOpen}
              >
                <MailIcon style={{ fontSize: 36 }} />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        <InvitationDialog
          open={this.state.open}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}

export default Header;
