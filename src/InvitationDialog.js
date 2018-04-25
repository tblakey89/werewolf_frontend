import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TickIcon from '@material-ui/icons/Done';
import CrossIcon from '@material-ui/icons/Close';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
});

class InvitationDialog extends Component {
  render() {
    const { fullScreen, classes } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {"Invitations"}
        </DialogTitle>
        <List>
            <ListItem>
              <ListItemText onClick={this.props.onClose}>
                <Link to={`/game`}>New Game</Link>
              </ListItemText>
              <Button mini variant="fab" color="primary" className={classes.button}>
                <TickIcon />
              </Button>
              <Button mini variant="fab" color="secondary" className={classes.button}>
                <CrossIcon />
              </Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText onClick={this.props.onClose}>
                <Link to={`/game`}>New Werewolf game</Link>
              </ListItemText>
              <Button mini variant="fab" color="primary" className={classes.button}>
                <TickIcon />
              </Button>
              <Button mini variant="fab" color="secondary" className={classes.button}>
                <CrossIcon />
              </Button>
            </ListItem>
          </List>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

InvitationDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(styles)(InvitationDialog));
