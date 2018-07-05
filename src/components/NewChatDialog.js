import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import User from '../api/user';
import Conversation from '../api/conversation';
import ConversationValidation from '../validation/conversationValidation';

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
    contacts: {},
    conversation: {},
    fields: {
      user_ids: [],
      participants: []
    },
    fieldErrors: {},
    errored: true,
    submitted: false,
    readyForRedirect: false,
    _loading: false,
  };

  componentDidMount() {
    this.setState({_loading: true})
    User.index((response) => {
      this.setState({contacts: this.generateContactsObject(response.users), _loading: false});
    }, (response) => {

    });
  }

  generateContactsObject = (users) => {
    const reducer = (object, user) => {
      object[user.id] = user
      return object;
    };
    return users.reduce(reducer, {});
  };

  handleMenuChange = event => {
    const fields = {...this.state.fields};
    const fieldErrors = {...this.state.fieldErrors};
    const participants = event.target.value;
    const user_ids = event.target.value;

    fields['user_ids'] = user_ids;
    fields['participants'] = participants;
    fieldErrors['user_ids'] = ConversationValidation.checkErrors('user_ids')(event.target.value);
    const errored = this.isErrored(fieldErrors);

    this.setState({ fields, fieldErrors, errored });
  };

  isErrored = (fieldErrors) => {
    return Object.keys(fieldErrors).some((key) => {
      return fieldErrors[key];
    });
  };

  submitChat = () => {
    const fieldErrors = this.getFieldErrors();
    const submitted = true;
    const errored = this.isErrored(fieldErrors);
    this.setState({ fieldErrors, errored, submitted });

    if (!this.state.errored) {
      Conversation.create(this.state.fields, this.successfulCreateCallback, this.errorOnCreateCallback);
    }
  };

  getFieldErrors = () => {
    return {
      user_ids: ConversationValidation.checkErrors('user_ids')(this.state.fields.user_ids),
    };
  };

  showFieldError = () => {
    return this.state.submitted && this.state.fieldErrors.user_ids;
  };

  successfulCreateCallback = (response) => {
    this.setState({readyForRedirect: true, conversation: response.conversation});
    this.props.onNotificationOpen('Started new conversation.')
  };

  errorOnCreateCallback = () => {

  };

  renderMenuItems = () => (
    Object.values(this.state.contacts).map((contact) => (
      <MenuItem key={contact.id} value={contact.id}>{contact.username}</MenuItem>
    ))
  );

  render() {
    const { classes, fullScreen } = this.props;

    if (this.state.readyForRedirect) {
      return (<Redirect to={`/chat/${this.state.conversation.id}`}/>)
    } else {
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
              <FormControl
                className={classes.formControl}
                fullWidth={true}
                error={!!this.showFieldError()}
              >
                <InputLabel htmlFor="vote">Participants</InputLabel>
                <Select
                  multiple
                  value={this.state.fields.participants}
                  onChange={this.handleMenuChange}
                  renderValue={selected => selected.map(user_id => this.state.contacts[user_id].username).join(', ')}
                  input={<Input id="contact" />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  { this.renderMenuItems() }
                </Select>
                <FormHelperText>{this.showFieldError()}</FormHelperText>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button id="close" onClick={this.props.onClose} color="primary">
              Cancel
            </Button>
            <Button id="submit" onClick={this.submitChat} color="primary">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }
}

NewChatDialog.propTypes = {
  fullScreen: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withMobileDialog()(withStyles(styles)(NewChatDialog));
