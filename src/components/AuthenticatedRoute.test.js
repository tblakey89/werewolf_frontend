import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import AuthenticatedRoute from './AuthenticatedRoute';
import Games from './Games';
import { MemoryRouter } from 'react-router'

describe('AuthenticatedRoute', () => {
  let wrapper;
  let gamesProp;
  let location;

  beforeEach(() => {
    location = {state: {from: '/games'}};
    const componentProps = {location: location};
    localStorage.clear();
    gamesProp = [1];
    wrapper = shallow(shallow(shallow(
      <MemoryRouter initialEntries={["/games/2"]}>
        <AuthenticatedRoute path="/test" games={gamesProp} component={Games} />
      </MemoryRouter>
    ).get(0)).get(0));
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
