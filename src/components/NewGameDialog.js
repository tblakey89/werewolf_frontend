import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  // made this multiple step using stepper component when more form elements added

  state = {
    players: []
  };

  handleChange = event => {
    this.setState({ players: event.target.value });
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
                id="name"
                label="Game Name"
                type="text"
                fullWidth
              />
            </FormControl>
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel htmlFor="vote">Players</InputLabel>
              <Select
                multiple
                value={this.state.players}
                onChange={this.handleChange}
                renderValue={selected => selected.join(', ')}
                input={<Input id="vote" />}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={"Thomas Blakey"}>Thomas Blakey</MenuItem>
                <MenuItem value={"Giang Blakey"}>Giang Blakey</MenuItem>
                <MenuItem value={"Teddy Blakey"}>Teddy Blakey</MenuItem>
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.props.onClose} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

NewGameDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(styles)(NewGameDialog));
