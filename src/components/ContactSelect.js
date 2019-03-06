import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import User from '../api/user';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

class ContactSelect extends Component {
  state = {
    contacts: {}
  };

  componentDidMount() {
    this.loadUsers();
  }

  loadUsers = () => {
    User.index((response) => {
      this.setState(
        {contacts: this.generateContactsObject(response.users)},
        this.props.setLoaded
      );
    }, (response) => {

    });
  }

  generateContactsObject = (users) => {
    const reducer = (object, user) => {
      if (user.id === this.props.userId) return object;
      // watch out if current currentParticipantIds is large, or users is large
      if (this.props.currentParticipantIds.includes(user.id)) return object;
      object[user.id] = user;
      return object;
    };
    return users.reduce(reducer, {});
  };

  renderMenuItems = () => (
    Object.values(this.state.contacts).map((contact) => (
      <MenuItem key={contact.id} value={contact.id}>{contact.username}</MenuItem>
    ))
  );

  render() {
    const { classes } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        fullWidth={true}
        error={!!this.props.showFieldError('user_ids')}
      >
        <InputLabel>Participants</InputLabel>
        <Select
          multiple
          value={this.props.participants}
          onChange={this.props.onChange}
          renderValue={
            selected => (
              selected
                .filter(user_id => user_id !== '')
                .map(user_id => this.state.contacts[user_id].username)
                .join(', ')
            )
          }
          input={<Input id="contact" />}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          { this.renderMenuItems() }
        </Select>
        <FormHelperText>{this.props.showFieldError('user_ids')}</FormHelperText>
      </FormControl>
    );
  }
}

ContactSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  showFieldError: PropTypes.func,
  setLoaded: PropTypes.func.isRequired,
  participants: PropTypes.array.isRequired,
  currentParticipantIds: PropTypes.array,
};

ContactSelect.defaultProps = {
  currentParticipantIds: [],
  showFieldError: () => {},
};

export default withStyles(styles)(ContactSelect);