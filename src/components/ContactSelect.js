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
    this.setState(
      {contacts: this.generateContactsObject(this.props.friends)}
    );
  }

  generateContactsObject = (users) => {
    const reducer = (object, user) => {
      // watch out if current currentParticipantIds is large, or users is large
      if (this.props.currentParticipantIds.includes(user.id)) return object;
      object[user.id] = user;
      return object;
    };
    return users.reduce(reducer, {});
  };

  sortedMenuItems = () => (
    Object.values(this.state.contacts).sort((contactA, contactB) => {
      if (contactA.username < contactB.username) return -1;
      return 1;
    })
  )

  renderMenuItems = () => (
    this.sortedMenuItems().map((contact) => (
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
  friends: PropTypes.array.isRequired,
  showFieldError: PropTypes.func,
  participants: PropTypes.array.isRequired,
  currentParticipantIds: PropTypes.array,
};

ContactSelect.defaultProps = {
  currentParticipantIds: [],
  friends: [],
  showFieldError: () => {},
};

export default withStyles(styles)(ContactSelect);
