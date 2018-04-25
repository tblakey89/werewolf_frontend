import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog';

// shows joined/pending/denied status of players if yet to begin

class InfoDialog extends Component {
  render() {
    const { fullScreen } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={this.props.open}
        onClose={this.props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          {"Game Info"}
        </DialogTitle>
        <List>
            <ListItem button>
              <ListItemText primary="Thomas Blakey" secondary="Dead Role: Werewolf" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Giang Blakey" secondary="Alive" />
            </ListItem>
            <Divider />
            <ListItem button>
              <ListItemText primary="Teddy Blakey" secondary="Alive" />
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

InfoDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(InfoDialog);
