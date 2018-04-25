import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
import TextField from 'material-ui/TextField';
import { FormControl } from 'material-ui/Form';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

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

class NewChatDialog extends Component {
  state = {
    participants: []
  };

  handleChange = event => {
    this.setState({ participants: event.target.value });
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
          {"New Conversation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please select the participants of this conversation.
          </DialogContentText>
          <form className={classes.container}>
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel htmlFor="vote">Participants</InputLabel>
              <Select
                multiple
                value={this.state.participants}
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

NewChatDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(styles)(NewChatDialog));
