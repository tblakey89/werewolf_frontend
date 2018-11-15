import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

// Need to do code for voting for a user
// Need to test submitting vote

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class RoleDialog extends Component {
  state = {
    vote: ''
  };

  componentDidMount() {
    this.setPlayer(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPlayer(nextProps);
  }

  setPlayer = (props) => {
    this.setState({player: props.players[props.user.id]});
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  eligibleToVote = () => {
    if (!this.props.players[this.props.user.id].alive) return false;
    if (this.props.gameState === 'night_phase' && this.props.players[this.props.user.id].role === 'werewolf') {
      return true;
    }
    if (this.props.gameState === 'day_phase') return true;
    return false;
  };

  eligibleVoteCandidates = () => {
    const reducer = (accumulator, player) => {
      if (player.id === this.props.user.id) return accumulator;
      if (this.props.gameState === 'night_phase' && player.role === 'werewolf') return accumulator;
      accumulator.push(player);
      return accumulator;
    };
    return Object.values(this.props.players).reduce(reducer, []);
  }

  roleText = () => {
    switch(this.state.player.role) {
      case 'none':
        return 'You will be assigned a role once the game has begin.';
      case 'villager':
        return 'You are a villager, you need to ensure no werewolves remain to win the game.';
      case 'werewolf':
        return 'You are a werewolf, you need to outnumber the willagers to win the game.';
    }
  }

  renderVotingForm = () => {
    if (!this.eligibleToVote()) return;
    return (
      <form className={this.props.classes.container}>
        <FormControl className={this.props.classes.formControl} fullWidth={true}>
          <InputLabel>Vote</InputLabel>
          <Select
            value={this.state.vote}
            onChange={this.handleChange('vote')}
            input={<Input id="vote" />}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {this.eligibleVoteCandidates().map((player) => (
              <MenuItem value={player.id} key={player.id}>{this.props.users[player.id].user.username}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </form>
    );
  }

  render() {
    const { classes, fullScreen } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        {this.state.player && (
          <div>
            <DialogTitle>
              {this.state.player.role}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                {this.roleText()}
              </DialogContentText>
              {this.renderVotingForm()}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.onClose} color="primary">
                Cancel
              </Button>
              {this.eligibleToVote() &&
                <Button onClick={this.props.onClose} color="primary">
                  Vote
                </Button>
              }
            </DialogActions>
          </div>
        )}
      </Dialog>
    );
  }
}

RoleDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(styles)(RoleDialog));
