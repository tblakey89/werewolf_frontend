import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InfoIcon from '@material-ui/icons/Info';
import IconButton from '@material-ui/core/IconButton';
import TickIcon from '@material-ui/icons/Done';
import CrossIcon from '@material-ui/icons/Close';
import MailIcon from '@material-ui/icons/MailOutline';
import SettingsIcon from '@material-ui/icons/Settings';
import RoleDialog from './RoleDialog';
import InfoDialog from './InfoDialog';
import EditGameDialog from './EditGameDialog';
import Timer from './Timer';
import UserAvatar from './UserAvatar';
import Invitation from '../api/invitation';

// refactor to move all user, game, conversation objects out of the chat container

// game should have things like function to check if user is host

// bugs
// -> highlight role dialog with badge when pending action, or launch of game
// -> mark game as started on starting with datetime
// -> race condition on joining game, joined game message
// -> review database reads on state update, etc
// -> are dead users allowed to speak?
// ->* game ordering, invitation ordering
// ->* notification covers text box on mobile view
// ->* when invited, does not automatically appear in invite icon badge, or modal
// ->* Games page not counting players correctly
// ->* redirects to sign in or games on visiting '/'

// epics
// deploy game on aws/wherever
// stop 'dead' users sending messages in the game chat
// how to best inform werewolfs of other werewolfs? Make werewolf chat group?
// add ability to have friends, send friend requests

// when stuck with concurrency, comment out the tasks

// should split out all the extra code, like invite, launch button, etc

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  gameHeader: {
    [theme.breakpoints.down('sm')]: {
      top: '55px'
    },
    [theme.breakpoints.up('sm')]: {
      top: '64px'
    },
  },
  launchHeader: {
    [theme.breakpoints.down('sm')]: {
      top: '110px'
    },
    [theme.breakpoints.up('sm')]: {
      top: '128px'
    },
  },
});

class Game extends Component {
  state = {
    roleOpen: false,
    infoOpen: false,
    editGameOpen: false,
    gameReady: false,
    redirect: false,
  };

  componentDidMount() {
    this.setUsers(this.props);
    this.setMessagesAsRead();
    window.scrollTo(0,document.body.scrollHeight);
  }

  componentDidUpdate(prevProps) {
    this.setMessagesAsRead();
    if (this.props.game.messages.length > prevProps.game.messages.length) {
      window.scrollTo(0,document.body.scrollHeight);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setUsers(nextProps);
  }

  setMessagesAsRead = () => {
    if (!this.props.game) return;
    if (this.props.game.unreadMessageCount !== 0) {
      this.props.setAsRead(this.props.game);
    }
  };

  setUsers = (props) => {
    if (!this.props.game) return;
    const users = this.props.game.users_games.reduce((userObject, usersGame) => {
      userObject[usersGame.user_id] = {...usersGame};
      return userObject;
    }, {});
    this.setState({users});
  }

  handleInviteClick = (newInvitationState) => () => {
    const usersGame = this.props.game.users_games.find((users_game) => users_game.user_id === this.props.user.id);
    Invitation.update(usersGame.id, newInvitationState, () => {
      if (newInvitationState === 'rejected') {
        this.setState({redirect: true});
      }
      this.props.onNotificationOpen(`${newInvitationState} invite`);
    }, () => {

    });
  };

  handleRoleClickOpen = () => {
    this.setState({ roleOpen: true });
  };

  handleInfoClickOpen = () => {
    this.setState({ infoOpen: true });
  };

  handleSettingsOpen = () => {
    this.setState({ editGameOpen: true });
  };

  handleClose = () => {
    this.setState({ roleOpen: false, infoOpen: false, editGameOpen: false });
  };

  handleLaunchGame = () => {
    const response = this.props.game.channel.push('launch_game');
  };

  playerCount = () => (
    this.props.game.users_games.filter((usersGame) => (
      usersGame.state === 'accepted' || usersGame.state === 'host'
    )).length
  );

  invitationPending = () => {
    const usersGame = this.props.game.users_games.find((users_game) => users_game.user_id === this.props.user.id);
    return usersGame.state === 'pending';
  }

  displayRoleIcon = () => {
    if (['day_phase', 'night_phase', 'ready', 'game_over'].includes(this.props.game.state.state)) {
      return true;
    }
    return false;
  };

  displaySettingsIcon = () => {
    const usersGame = this.props.game.users_games.find((users_game) => users_game.user_id === this.props.user.id)
    if (usersGame.state === 'host' && this.props.game.state.state === 'initialized') {
      return true;
    }
    return false;
  };

  showLaunchButton = () => {
    if (this.props.game.state.state !== 'ready') return false;
    const currentPlayer = this.props.game.state.players[this.props.user.id]
    return currentPlayer && currentPlayer.host;
  };

  currentParticipantIds = () => (
    this.props.game.users_games.map((users_game) => users_game.user_id)
  );

  renderLaunchButton = () => (
    this.showLaunchButton() && (
      <AppBar position="fixed" color="default" className={this.props.classes.launchHeader}>
        <Button
          variant="raised"
          color="primary"
          className={this.props.classes.button}
          onClick={this.handleLaunchGame}
          id="launchButton"
        >
          Launch
        </Button>
      </AppBar>
    )
  );

  renderInvite = () => (
    this.props.game.pending === true && (
      <List id="invitations">
        <ListItem>
          <ListItemText>
            Accept invite:
          </ListItemText>
          <ListItemSecondaryAction>
            <Button
              id="accept"
              mini
              variant="fab"
              color="primary"
              className={this.props.classes.button}
              onClick={this.handleInviteClick('accepted')}
            >
              <TickIcon />
            </Button>
            <Button
              id="reject"
              mini
              variant="fab"
              color="secondary"
              className={this.props.classes.button}
              onClick={this.handleInviteClick('rejected')}
            >
              <CrossIcon />
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    )
  );

  renderMessages = () => (
    this.props.game.messages.slice().sort((message_a, message_b) => (
      message_a.created_at - message_b.created_at
    )).map((message) => (
      <ListItem key={message.id}>
        <UserAvatar
          user={this.props.user}
          currentUser={message.sender}
        />
        <ListItemText
          primary={message.bot ? "bot" : message.sender.username}
          secondary={message.body}
        />
      </ListItem>
    ))
  );

  renderGameStatus = () => {
    const gameState = this.props.game.state.state;
    if (gameState === 'ready' || gameState === 'initialized') {
      return (<span style={{'font-size': 12}}>{this.playerCount()} players. 8 minimum. 18 maximum</span>);
    } else {
      const phaseNumber = Math.ceil(this.props.game.state.phases / 2);
      switch(gameState) {
        case 'day_phase': return this.renderGamePhase('Day', phaseNumber);
        case 'night_phase': return this.renderGamePhase('Night', phaseNumber);
        case 'game_over': return (<span style={{'font-size': 12}}>Game Over</span>);
      }
    }
  };

  renderGamePhase = (phase, number) => (
    <span
      style={{'font-size': 12}}
    >
      {phase} Phase {number} - <Timer endPhaseTime={this.props.game.state.end_phase_unix_time} />
    </span>
  );

  render() {
    const { classes } = this.props;
    if (this.state.redirect) {
      return (<Redirect to='/games'/>)
    } else {
      return (
        <div>
          {this.props.game && (
            <div>
              <AppBar position="fixed" color="default" className={classes.gameHeader}>
                <Toolbar>
                  <Typography variant="title" color="inherit" style={{flex: 1}}>
                    {this.props.game.name}
                    <br/>
                    {this.renderGameStatus()}
                  </Typography>
                  <div>
                    {this.displayRoleIcon() &&
                      <IconButton
                        aria-haspopup="true"
                        color="inherit"
                        onClick={this.handleRoleClickOpen}
                      >
                        <AccountCircle  style={{ fontSize: 36 }} />
                      </IconButton>
                    }
                    <IconButton
                      aria-haspopup="true"
                      color="inherit"
                      onClick={this.handleInfoClickOpen}
                    >
                      <InfoIcon style={{ fontSize: 36 }} />
                    </IconButton>
                    {this.displaySettingsIcon() &&
                      <IconButton
                        aria-haspopup="true"
                        color="inherit"
                        onClick={this.handleSettingsOpen}
                      >
                        <SettingsIcon style={{ fontSize: 36 }} />
                      </IconButton>
                    }
                  </div>
                </Toolbar>
              </AppBar>
              <div style={{'margin-top': '128px'}}>
                {this.renderLaunchButton()}
                {this.renderInvite()}
                <List>
                  {this.renderMessages()}
                  <div ref={(el) => { this.messagesEnd = el; }} />
                </List>
              </div>
              <RoleDialog
                open={this.state.roleOpen}
                onClose={this.handleClose}
                game={this.props.game}
                user={this.props.user}
                users={this.state.users}
              />
              <InfoDialog
                open={this.state.infoOpen}
                onClose={this.handleClose}
                gameState={this.props.game.state.state}
                players={this.props.game.state.players}
                user={this.props.user}
                users={this.state.users}
              />
              <EditGameDialog
                open={this.state.editGameOpen}
                onClose={this.handleClose}
                onNotificationOpen={this.props.onNotificationOpen}
                currentParticipantIds={this.currentParticipantIds()}
                gameId={this.props.game.id}
                token={this.props.game.token}
              />
            </div>
          )}
        </div>
      );
    }
  }
}

export default withStyles(styles)(Game);
