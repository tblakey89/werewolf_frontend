import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';

// we could always wrap some components in a higher order component to avoid those divs on appjs
// Do we need a notify for users not logged in trying to access authenticated pages?
// what about going back to page originally attempted to access
// tests

class AuthenticatedRoute extends Component {
  isLoggedIn = () => {
    return !!localStorage.getItem('jwt');
  }

  render() {
    const {render, component, ...rest} = this.props;
    return (
      <Route {...rest} render={(props) => (
        this.isLoggedIn() ? (
          render ? render(props) : React.createElement(component, props)
        ):(
          <Redirect to={{pathname: '/signin',}} />
        )
      )} />
    );
  }
}

export default AuthenticatedRoute;
