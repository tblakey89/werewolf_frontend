import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import FooterButtons from './FooterButtons';
import ChatInput from './ChatInput';

class Footer extends Component {
  render() {
    return (
      <Switch>
        <Route path='/chat' component={ChatInput} />
        <Route path='/game' component={ChatInput} />
        <Route component={FooterButtons} />
      </Switch>
    );
  }
}

export default Footer;
