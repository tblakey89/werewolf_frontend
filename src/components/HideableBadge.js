import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Badge from '@material-ui/core/Badge';

class HideableBadge extends Component {
  render() {
    if (this.props.invisible) {
      return this.props.children;
    } else {
      return (
        <Badge {...this.props}>
          {this.props.children}
        </Badge>
      )
    }
  }
}

HideableBadge.propTypes = {
  invisible: PropTypes.bool,
};

HideableBadge.defaultProps = {
  invisible: false,
};

export default HideableBadge;
