import React from 'react';
import { shallow } from 'enzyme';
import AuthenticatedRoute from './AuthenticatedRoute';
import Games from './Games';

describe('AuthenticatedRoute', () => {
  let wrapper;
  let gamesProp;

  beforeEach(() => {
    localStorage.clear();
    gamesProp = [1];
    wrapper = shallow(<AuthenticatedRoute path="/test" games={gamesProp} component={Games} />);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('when no JWT token', () => {
    it('should redirect user', () => {
      expect(wrapper.props().render().props.to.pathname).toEqual('/signin');
      expect(wrapper.props().render().props.games).toEqual(undefined);
    });
  });

  describe('when JWT token', () => {
    beforeEach(() => {
      localStorage.setItem('jwt', 'token');
    });

    it('should display Game component', () => {
      expect(wrapper.props().render().props.games).toEqual(gamesProp);
    });
  });
});
