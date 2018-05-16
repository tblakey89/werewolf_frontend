import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import NewPassword from './NewPassword';

jest.mock('../api/user');

describe('NewPassword', () => {
  let wrapper;
  let passwordInput;
  let form;
  let mockNotify;
  let token;

  beforeEach(() => {
    mockNotify = jest.fn();
    token = 'testtoken';
    const location = {search: '?forgotten_password_token=' + token}
    wrapper = shallow(<NewPassword location={location} onNotificationOpen={mockNotify} />);
    passwordInput = wrapper.find('#password').first();
    form = wrapper.find('form').first();
  });

  afterEach(() => {
    User.newPassword.mockClear();
  });

  describe('User enters in their password', () => {
    it('no errors are shown', () => {
      expect(wrapper.instance().showFieldError()).toBe(false);
    });

    describe('User enters an invalid password', () => {
      beforeEach(() => {
        passwordInput.simulate('change', {
          target: { value: 'fak' },
        });
      });

      it('shows no errors on password', () => {
        expect(wrapper.instance().showFieldError()).toBe(false);
      });

      describe('User clicks submit', () => {
        beforeEach(() => {
          form.simulate('submit', {preventDefault: () => {}});
        });

        it('shows errors', () => {
          expect(wrapper.instance().showFieldError('password')).toBeTruthy();
        });
      });
    });

    describe('User enters password correctly and submits', () => {
      const password  = 'testpassword';
      let invocationArgs;

      beforeEach(() => {
        passwordInput.simulate('change', {target: { value: password }});
        form.simulate('submit', {preventDefault: () => {}});
        invocationArgs = User.newPassword.mock.calls[0];
      });

      it('should call User.newPassword with correct values', () => {
        expect(invocationArgs[0]).toEqual(token);
        expect(invocationArgs[1]).toEqual(password);
      });

      describe('API returns results', () => {
        beforeEach(() => {
          const successCallback = invocationArgs[2];
          successCallback();
          wrapper.update();
        });

        it('should redirect and notify user', () => {
          const redirect = wrapper.find('Redirect');
          expect(redirect.length).toEqual(1);
          expect(mockNotify.mock.calls.length).toBe(1);
        });
      });

      describe('API returns 4** error', () => {
        beforeEach(() => {
          const errorCallback = invocationArgs[3];
          errorCallback({
            error: "User not found"
          });
          wrapper.update();
        });

        it('should display error and redirect user', () => {
          const redirect = wrapper.find('Redirect');
          expect(redirect.length).toEqual(1);
          expect(mockNotify.mock.calls.length).toBe(1);
          expect(wrapper.instance().showFieldError()).toBeTruthy();
        });
      });

      describe('API returns 5** error', () => {
        beforeEach(() => {
          const errorCallback = invocationArgs[2];
          errorCallback(new Error('HTTP Error 500'));
          wrapper.update();
        });

        it('should notify user', () => {
          expect(mockNotify.mock.calls.length).toBe(1);
        });
      });
    });
  });
});
