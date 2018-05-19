import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import SignIn from './SignIn';
import Register from './Register';
import ForgottenPassword from './ForgottenPassword';
import NewPassword from './NewPassword';

class SessionDialog extends Component {
  render() {
    const { fullScreen } = this.props;

    return (
      <Dialog
        fullScreen={fullScreen}
        fullWidth
        open={true}
        aria-labelledby="responsive-dialog-title"
      >
        <Route path='/signin' render={(props) => (
          <SignIn onNotificationOpen={this.props.onNotificationOpen} />
        )}/>
        <Route path='/register' render={props => (
          <Register onNotificationOpen={this.props.onNotificationOpen} />
        )}/>
        <Route path='/forgotten_password' render={props => (
          <ForgottenPassword onNotificationOpen={this.props.onNotificationOpen} />
        )}/>
        <Route path='/new_password' render={({ location }) => (
          <NewPassword location={location} onNotificationOpen={this.props.onNotificationOpen} />
        )}/>
      </Dialog>
    );
  }
}

export default withMobileDialog()(SessionDialog);
