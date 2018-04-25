import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Input, { InputLabel } from 'material-ui/Input';
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

class RoleDialog extends Component {
  state = {
    vote: ''
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

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
        <DialogTitle>
          {"Villager"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are a villager, you need to ensure no werewolf remain to win the game.
          </DialogContentText>
          <form className={classes.container}>
            <FormControl className={classes.formControl} fullWidth={true}>
              <InputLabel htmlFor="age-simple">Vote</InputLabel>
              <Select
                value={this.state.vote}
                onChange={this.handleChange('vote')}
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
            Vote
          </Button>
        </DialogActions>
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
