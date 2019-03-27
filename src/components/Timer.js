import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class Timer extends Component {
  displayTime = (timeInMilliseconds) => (
    moment.utc(moment.duration(timeInMilliseconds).as('milliseconds')).format('HH:mm:ss')
  );

  state = {
    currentTime: this.displayTime(0),
  };

  componentDidMount() {
    this.updateTimer();
    this.updateTimerInterval = setInterval(() => this.updateTimer(), 200);
  }

  componentWillUnmount() {
    clearInterval(this.updateTimerInterval);
  }

  updateTimer = () => {
    const timeLeft = this.props.endPhaseTime - Date.now();
    this.setState({currentTime: this.displayTime(timeLeft)});
  };

  render() {
    return (
      <span>{this.state.currentTime}</span>
    );
  }
}

Timer.propTypes = {
  endPhaseTime: PropTypes.number,
};

Timer.defaultProps = {
  endPhaseTime: 0,
};

export default Timer;
