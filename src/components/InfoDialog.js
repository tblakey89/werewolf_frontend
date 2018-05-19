import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

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
