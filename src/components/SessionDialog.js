import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Dialog, {
  withMobileDialog,
} from 'material-ui/Dialog';
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
        <Route path='/signin' component={SignIn}/>
        <Route path='/register' render={props => (
          <Register onNotificationOpen={this.props.onNotificationOpen} />
        )}/>
        <Route path='/forgotten_password' render={props => (
          <ForgottenPassword onNotificationOpen={this.props.onNotificationOpen} />
        )}/>
        <Route path='/new_password' component={NewPassword}/>
      </Dialog>
    );
  }
}

export default withMobileDialog()(SessionDialog);
