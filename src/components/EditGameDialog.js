import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ContactSelect from './ContactSelect';
import Game from '../api/game';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  tokenUrl: {
    fontSize: '14px',
  }
});

class EditGameDialog extends Component {
  // needs to remain seperate from new game dialog, as new game dialog could be multi-step
  // in the future

  state = {
    fields: {
      user_ids: [],
      participants: []
    },
    submitted: false,
    _loading: true,
  };

  handleSetLoaded = () => {
    this.setState({_loading: false})
  }

  handleMenuChange = event => {
    const fields = {...this.state.fields};
    const participants = event.target.value;
    const user_ids = event.target.value;

    fields['user_ids'] = user_ids;
    fields['participants'] = participants;

    this.setState({ fields });
  };

  submitGame = () => {
    if (this.state.fields.participants.length > 0) {
      Game.update(
        this.props.gameId,
        this.state.fields,
        this.successfulUpdateCallback,
        this.errorOnUpdateCallback
      );
    }
    this.setState({fields: {
        user_ids: [],
        participants: []
      }},
      this.props.onClose
    );
  };

  successfulUpdateCallback = (response) => {
    this.props.onNotificationOpen('Added new users.')
  };

  errorOnUpdateCallback = () => {

  };

  render() {
    const { classes, fullScreen } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {"Add New Users"}
        </DialogTitle>
        <DialogContent>
          <p>Share the url with friends for them to join:</p>
          <b className={classes.tokenUrl}>http://localhost:3000/invitation/{this.props.token}</b>
          <p>Or add other users here:</p>
          <form className={classes.container}>
            <ContactSelect
              onChange={this.handleMenuChange}
              participants={this.state.fields.participants}
              showFieldError={this.showFieldError}
              setLoaded={this.handleSetLoaded}
              userId={this.props.userId}
              currentParticipantIds={this.props.currentParticipantIds}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button id="close" onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button id="submit" onClick={this.submitGame} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

EditGameDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
  gameId: PropTypes.number.isRequired,
};

export default withMobileDialog()(withStyles(styles)(EditGameDialog));
