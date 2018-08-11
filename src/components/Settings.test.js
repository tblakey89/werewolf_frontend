import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import Settings from './Settings';

jest.mock('../api/user');

describe('Settings', () => {
  let wrapper;
  let mockNotify;
  let form;
  const user = {
    username: 'currentUser',
    id: 1,
    email: 'current@user.com',
  };

  beforeEach(() => {
    mockNotify = jest.fn();
    wrapper = shallow(shallow(<Settings user={user} onNotificationOpen={mockNotify}/>).get(0));
    form = wrapper.find('form');
  });

  afterEach(() => {
    User.update.mockClear();
    mockNotify.mockClear();
    localStorage.clear();
  });

  describe('component loads up successfully', () => {
    it('displays user information', () => {
      expect(wrapper.find('#username').children().text()).toEqual(user.username);
      expect(wrapper.find('#email').children().text()).toEqual(user.email);
    });

    describe('filling in password', () => {
      let passwordInput;

      beforeEach(() => {
        passwordInput = wrapper.find('#password');
        passwordInput.simulate('change', {target: { value: 'short' }});
        form.simulate('submit', {preventDefault: () => {}});
      });

      it('raises error when submits with invalid password', () => {
        expect(User.update.mock.calls.length).toEqual(0);
        expect(wrapper.instance().showFieldError('password')).toBeTruthy();
      });

      describe('when password is valid', () => {
        let invocationArgs;

        beforeEach(() => {
          passwordInput.simulate('change', {target: { value: 'password' }});
          form.simulate('submit', {preventDefault: () => {}});
          invocationArgs = User.update.mock.calls[0];
        });

        it('calls user update', () => {
          expect(invocationArgs[0]).toEqual(user.id);
          expect(invocationArgs[1]).toEqual({password: 'password'});
        });

        describe('notifies user when success callback', () => {
          beforeEach(() => {
            const successCallback = invocationArgs[2];
            successCallback();
          });

          it('calls mockNotify once', () => {
            expect(mockNotify.mock.calls.length).toBe(1);
          });
        });
      });
    });

    describe('leaving password blank', () => {
      let invocationArgs;

      beforeEach(() => {
        form.simulate('submit', {preventDefault: () => {}});
        invocationArgs = User.update.mock.calls[0];
      });

      it('calls user update', () => {
        expect(invocationArgs[0]).toEqual(user.id);
        expect(invocationArgs[1]).toEqual({password: ""});
      });
    });

    describe('logging out', () => {
      let logOutButton;

      beforeEach(() => {
        localStorage.setItem('jwt', 'token');
        wrapper.find('#logOut').simulate('click');
        wrapper.update();
      });

      it('calls delete on localStorage, and redirects', () => {
        expect(localStorage.getItem('jwt')).toEqual(null);
        expect(wrapper.find('Redirect').length).toEqual(1);
      });
    });
  });
});
