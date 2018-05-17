import React from 'react';
import { shallow } from 'enzyme';
import AuthenticatedRoute from './AuthenticatedRoute';
import Games from './Games';

describe('AuthenticatedRoute', () => {
  let wrapper;

  beforeEach(() => {
    localStorage.clear();
    wrapper = shallow(<AuthenticatedRoute path="/test" component={Games} />);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('when no JWT token', () => {
    it('should redirect user', () => {
      expect(wrapper.props().render().props.to.pathname).toEqual('/signin');
    });
  });

  describe('when JWT token', () => {
    beforeEach(() => {
      localStorage.setItem('jwt', 'token');
    });

    it('should redirect user', () => {
      expect(wrapper.props().render().props).toEqual({});
    });
  });
});
