import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import SunIcon from '@material-ui/icons/Brightness5';
import MoonIcon from '@material-ui/icons/Brightness3';
import HourglassIcon from '@material-ui/icons/HourglassEmpty';
import TickIcon from '@material-ui/icons/Done';
import CrossIcon from '@material-ui/icons/Close';
import MailIcon from '@material-ui/icons/MailOutline';
import AddIcon from '@material-ui/icons/Add';
import NewGameDialog from './NewGameDialog';
import Invitation from '../api/invitation';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
  bold: {
    'font-weight': 'bold',
  },
});

class Games extends Component {
  state = {
    open: false
  };

  handleInvitationClick = (game, newInvitationState) => () => {
    const usersGame = game.users_games.find((users_game) => users_game.user_id === this.props.user.id)
    Invitation.update(usersGame.id, newInvitationState, () => {
      this.props.onNotificationOpen(`${newInvitationState} invite`)
    }, () => {

    });
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  gameStatus = (game) => {
    // This should show different things, like state of game
    // filter out rejected, and pending invites, etc
    return `${game.users_games.length} players`;
  };

  renderInvite = (game) => (
    <ListItem button>
      <Link to={`/game/${game.id}`}><MailIcon style={{ fontSize: 36 }} /></Link>
      <ListItemText secondary="Accept invite to join">
        <Link to={`/game/${game.id}`}>Invitation: {game.name}</Link>
      </ListItemText>
      <ListItemSecondaryAction>
        <Button
          mini
          variant="fab"
          color="primary"
          className={this.props.classes.button}
          onClick={this.handleInvitationClick(game, 'accepted')}
        >
          <TickIcon />
        </Button>
        <Button
          mini
          variant="fab"
          color="secondary"
          className={this.props.classes.button}
          onClick={this.handleInvitationClick(game, 'rejected')}
        >
          <CrossIcon />
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );

  renderIcon = (game) => {
    if (game.state === 'day') {
      return (<SunIcon style={{ fontSize: 36 }} />);
    } else if (game.state === 'night') {
      return (<MoonIcon style={{ fontSize: 36 }} />);
    }
    return (<HourglassIcon style={{ fontSize: 36 }} />);
  }

  renderGame = (game) => (
    <ListItem button>
      {this.renderIcon(game)}
      <ListItemText
        primary={
          <span className={game.unreadMessageCount > 0 ? this.props.classes.bold : ''}>
            {game.name}
          </span>
        }
        secondary={
          <span className={game.unreadMessageCount > 0 ? this.props.classes.bold : ''}>
            {this.gameStatus(game)}
          </span>
        }
      />
    </ListItem>
  );

  renderGames = () => (
    this.props.games.map((game) => (
      <Link to={`/game/${game.id}`} key={game.id}>
        {game.pending ? this.renderInvite(game) : this.renderGame(game)}
      </Link>
    ))
  );

  render() {
    const { classes } = this.props;

    return (
      <div>
        <List component="nav">
          {this.renderGames()}
          {this.props.games.length === 0 && (
            <ListItem>
              <ListItemText
                primary="Click '+' to add a game."
              />
            </ListItem>
          )}
          <Button variant="fab" className={classes.fab} onClick={this.handleClickOpen}>
            <AddIcon />
          </Button>
        </List>
        <NewGameDialog
          open={this.state.open}
          onClose={this.handleClose}
          onNotificationOpen={this.props.onNotificationOpen}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Games);
