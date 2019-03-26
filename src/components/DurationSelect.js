import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';

const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

const durations = [
  {
    name: '5 Minutes',
    key: 'five_minute',
  },
  {
    name: '30 Minutes',
    key: 'thirty_minute',
  },
  {
    name: '1 Hour',
    key: 'hour',
  },
  {
    name: '24 Hours',
    key: 'day',
  }
];

class DurationSelect extends Component {
  renderMenuItems = () => (
    Object.values(durations).map((duration) => (
      <MenuItem key={duration.key} value={duration.key}>{duration.name}</MenuItem>
    ))
  );

  render() {
    const { classes } = this.props;

    return (
      <FormControl
        className={classes.formControl}
        fullWidth={true}
      >
        <InputLabel>Round Length</InputLabel>
        <Select
          value={this.props.duration}
          onChange={this.props.onChange}
          input={<Input id="duration" />}
        >
          { this.renderMenuItems() }
        </Select>
      </FormControl>
    );
  }
}

DurationSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  duration: PropTypes.string,
};

DurationSelect.defaultProps = {
  duration: 'day',
};

export default withStyles(styles)(DurationSelect);
