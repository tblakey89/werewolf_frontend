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
import Invitation from '../api/invitation';

// refactor to move all user, game, conversation objects out of the chat container

// game should work fully at this point (don't forget to change icons based on game state)
// -> hunt for bugs, then fix them
// -> does not remove self when creating new game
// -> Cannot add more people to game after creation (add edit icon next to other icons)
// -> host is sent invite after game creation
// -> bot message did not bold and show as a new message
// -> does not show invited users on game infodialog
// -> when user joins game, show game name
// -> hide min max players after game launch, instead show current phase
// -> other werewolf shows up in list of options for werewolf in night phase
// -> highlight role dialog with badge when pending action, or launch of game
// -> need to update icon based on phase of the game
// -> CSS issues, like bar always fixed to bottom
// -> phase number in announcement needs to be integer
// -> dead players show as option on dropdowns
// -> users role not revealed after night phase
// add abiity to add avatar image
// deploy game somewhere
// add ability to accept invite via link
// add ability to have friends, send friend requests?

// when stuck with concurrency, comment out the tasks

// should split out all the extra code, like invite, launch button, etc

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

  componentDidMount() {
    this.setUsers(this.props);
    this.setMessagesAsRead();
  }

  componentDidUpdate(prevProps) {
    this.setMessagesAsRead();
  }

  componentWillReceiveProps(nextProps) {
    this.setUsers(nextProps);
  }

  setMessagesAsRead = () => {
    if (!this.props.game) return;
    if (this.props.game.unreadMessageCount !== 0) {
      this.props.setAsRead(this.props.game);
    }
  }

  setUsers = (props) => {
    if (!this.props.game) return;
    const users = this.props.game.users_games.reduce((userObject, usersGame) => {
      userObject[usersGame.user_id] = {...usersGame};
      return userObject;
    }, {});
    this.setState({users});
  }

  handleInviteClick = (newInvitationState) => () => {
    const usersGame = this.props.game.users_games.find((users_game) => users_game.user_id === this.props.user.id)
    Invitation.update(usersGame.id, newInvitationState, () => {
      this.props.onNotificationOpen(`${newInvitationState} invite`)
    }, () => {

    });
  }

  handleRoleClickOpen = () => {
    this.setState({ roleOpen: true });
  };

  handleInfoClickOpen = () => {
    this.setState({ infoOpen: true });
  };

  handleClose = () => {
    this.setState({ roleOpen: false, infoOpen: false });
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
    const usersGame = this.props.game.users_games.find((users_game) => users_game.user_id === this.props.user.id)
    return usersGame.state === 'pending';
  }

  displayRoleIcon = () => {
    if (['day_phase', 'night_phase', 'ready', 'game_over'].includes(this.props.game.state.state)) {
      return true;
    }
    return false;
  };

  showLaunchButton = () => {
    if (this.props.game.state.state !== 'ready') return false;
    const currentPlayer = this.props.game.state.players[this.props.user.id]
    return currentPlayer && currentPlayer.host;
  };

  renderLaunchButton = () => (
    this.showLaunchButton() && (
      <AppBar position="static" color="default">
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
        <Avatar>
          <AccountCircle style={{ fontSize: 36 }} />
        </Avatar>
        <ListItemText
          primary={message.bot ? "bot" : message.sender.username}
          secondary={message.body}
        />
      </ListItem>
    ))
  );

  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.props.game && (
          <div>
            <AppBar position="static" color="default">
              <Toolbar>
                <Typography variant="title" color="inherit" style={{flex: 1}}>
                  {this.props.game.name}
                  <br/>
                  <span style={{'font-size': 12}}>{this.playerCount()} players. 8 minimum. 18 maximum</span>
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
                </div>
              </Toolbar>
            </AppBar>
            {this.renderLaunchButton()}
            {this.renderInvite()}
            <List>
              {this.renderMessages()}
            </List>
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
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Game);
