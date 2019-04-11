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
import FormHelperText from '@material-ui/core/FormHelperText';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import VoteValidation from '../validation/voteValidation';

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
    fields: {
      vote: undefined,
    },
    fieldErrors: {},
    errored: true,
    serverErrored: false,
    submitted: false,
  };

  componentDidMount() {
    this.setPlayer(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setPlayer(nextProps);
  }

  setPlayer = (props) => {
    this.setState({player: props.game.state.players[props.user.id]});
  };

  handleChange = name => event => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};

    fields[name] = event.target.value;
    fieldErrors[name] = VoteValidation.checkErrors('vote', event.target.value);
    const errored = this.isErrored(fieldErrors);

    this.setState({ fields, fieldErrors, errored });
  };

  handleVote = (event) => {
    const fieldErrors = this.getFieldErrors();
    const submitted = true;
    const errored = !!fieldErrors.vote;
    this.setState({ fieldErrors, errored, submitted }, () => {
      if (!errored) {
        this.props.game.channel.push('action', {action_type: 'vote', target: this.state.fields.vote})
          .receive("ok", (msg) => console.log("action successful", msg) )
          .receive("error", (reasons) => console.log("action failed", reasons) );
        this.props.onClose();
      }
    });
  };

  isErrored = (fieldErrors) => {
    return Object.keys(fieldErrors).some((key) => {
      return fieldErrors[key];
    });
  };

  getFieldErrors = () => {
    return {
      vote: VoteValidation.checkErrors('vote', this.state.fields.vote)
    };
  };

  showFieldError = (name) => {
    return this.state.submitted && this.state.fieldErrors[name];
  };

  eligibleVoteCandidates = () => {
    const reducer = (accumulator, player) => {
      if (!player.alive) return accumulator;
      if (player.id === this.props.user.id) return accumulator;
      if (this.props.game.state.state === 'night_phase' && player.role === 'werewolf') return accumulator;
      accumulator.push(player);
      return accumulator;
    };
    return Object.values(this.props.game.state.players).reduce(reducer, []);
  }

  roleText = () => {
    switch(this.state.player.role) {
      case 'none':
        return 'You will be assigned a role once the game has begin.';
      case 'villager':
        return 'You are a villager, you need to ensure no werewolves remain to win the game.';
      case 'werewolf':
        return 'You are a werewolf, you need to outnumber the villagers to win the game.';
    }
  }

  actionText = () => {
    if (!this.props.alreadyVoted) return;
    const phaseNumber = this.props.game.state.phases;
    const action = this.props.game.state.players[this.props.user.id].actions[phaseNumber]['vote'];
    const target = this.props.users[action.target].user.username;
    return `You voted for ${target}`;
  }

  renderVotingForm = () => {
    if (!this.props.eligibleToVote) return;
    return (
      <form className={this.props.classes.container} onSubmit={this.onFormSubmit}>
        <FormControl
          className={this.props.classes.formControl}
          fullWidth={true}
          error={!!this.showFieldError('vote')}
        >
          <InputLabel>Vote</InputLabel>
          <Select
            value={this.state.fields.vote}
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
          <FormHelperText>{this.showFieldError('vote')}</FormHelperText>
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
                <p>{this.roleText()}</p>
                <p>{this.actionText()}</p>
              </DialogContentText>
              {this.renderVotingForm()}
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.onClose} color="primary">
                Cancel
              </Button>
              {this.props.eligibleToVote &&
                <Button onClick={this.handleVote} color="primary">
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
