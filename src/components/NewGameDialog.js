import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ContactSelect from './ContactSelect';
import Game from '../api/game';
import GameValidation from '../validation/gameValidation';

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

class NewGameDialog extends Component {
  // v2: make this multiple step using stepper component when more form elements added

  state = {
    game: {},
    fields: {
      user_ids: [],
      participants: []
    },
    fieldErrors: {},
    errored: true,
    submitted: false,
    readyForRedirect: false,
    _loading: true,
  };

  handleSetLoaded = () => {
    this.setState({_loading: false})
  }

  handleMenuChange = event => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};
    const participants = event.target.value;
    const user_ids = event.target.value;

    fields['user_ids'] = user_ids;
    fields['participants'] = participants;
    fieldErrors['user_ids'] = GameValidation.checkErrors('user_ids')(event.target.value);
    const errored = this.isErrored(fieldErrors);

    this.setState({ fields, fieldErrors, errored });
  };

  handleChange = (event) => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};

    fields.name = event.target.value;
    fieldErrors.name = GameValidation.checkErrors('name')(event.target.value);
    const errored = !!fieldErrors.name;

    this.setState({ fields, fieldErrors, errored });
  };

  isErrored = (fieldErrors) => {
    return Object.keys(fieldErrors).some((key) => {
      return fieldErrors[key];
    });
  };

  submitGame = () => {
    const fieldErrors = this.getFieldErrors();
    const submitted = true;
    const errored = this.isErrored(fieldErrors);
    this.setState({ fieldErrors, errored, submitted });

    if (!this.state.errored) {
      Game.create(this.state.fields, this.successfulCreateCallback, this.errorOnCreateCallback);
    }
  };

  getFieldErrors = () => {
    return {
      name: GameValidation.checkErrors('name')(this.state.fields.name),
      user_ids: GameValidation.checkErrors('user_ids')(this.state.fields.user_ids),
    };
  };

  showFieldError = (field) => {
    return this.state.submitted && this.state.fieldErrors[field];
  };

  successfulCreateCallback = (response) => {
    this.setState({readyForRedirect: true, game: response});
    this.props.onNotificationOpen('Started new game.')
  };

  errorOnCreateCallback = () => {

  };

  render() {
    const { classes, fullScreen } = this.props;

    if (this.state.readyForRedirect) {
      return (<Redirect to={`/game/${this.state.game.id}`}/>)
    } else {
      return (
        <Dialog
          fullScreen={fullScreen}
          open={this.props.open}
          onClose={this.props.onClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle>
            {"New Game"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the details for your new game of Werewolf.
            </DialogContentText>
            <form className={classes.container}>
              <FormControl className={classes.formControl} fullWidth={true}>
                <TextField
                  autoFocus
                  margin="dense"
                  id="nameInput"
                  label="Game Name"
                  onChange={this.handleChange}
                  type="text"
                  fullWidth
                  error={!!this.showFieldError('name')}
                  helperText={this.showFieldError('name')}
                />
              </FormControl>
              <ContactSelect
                onChange={this.handleMenuChange}
                participants={this.state.fields.participants}
                showFieldError={this.showFieldError}
                setLoaded={this.handleSetLoaded}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button id="close" onClick={this.props.onClose} color="primary">
              Cancel
            </Button>
            <Button id="submit" onClick={this.submitGame} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }
}

NewGameDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(styles)(NewGameDialog));
