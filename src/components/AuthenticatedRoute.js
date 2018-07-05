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
    const {render, component, ...componentProps} = this.props;
    return (
      <Route {...componentProps} render={(props) => {
        return this.isLoggedIn() ? (
          render ? render(props) : React.createElement(component, componentProps)
        ):(
          <Redirect to={{pathname: '/signin',}} />
        )
      }} />
    );
  }
}

export default AuthenticatedRoute;
