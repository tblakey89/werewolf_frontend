import React from 'react';
import { shallow } from 'enzyme';
import Session from '../api/session';
import SignIn from './SignIn';

jest.mock('../api/session');

describe('SignIn', () => {
  let wrapper;
  let emailInput;
  let passwordInput
  let form;
  let mockNotify;
  let location;

  beforeEach(() => {
    location = {state: {from: '/games'}};
    mockNotify = jest.fn();
    wrapper = shallow(<SignIn onNotificationOpen={mockNotify} location={location} />);
    emailInput = wrapper.find('#email').first();
    passwordInput = wrapper.find('#password').first();
    form = wrapper.find('form').first();
  });

  afterEach(() => {
    Session.create.mockClear();
  });

  describe('User enters in their details', () => {
    it('no errors are shown', () => {
      expect(wrapper.instance().showFieldError('email')).toBe(false);
      expect(wrapper.instance().showFieldError('password')).toBe(false);
    });

    describe('User clicks submit with no details', () => {
      beforeEach(() => {
        form.simulate('submit', {preventDefault: () => {}});
      });

      it('shows errors', () => {
        expect(wrapper.instance().showFieldError('email')).toBeTruthy();
        expect(wrapper.instance().showFieldError('password')).toBeTruthy();
      });
    });

    describe('User fills form correctly and submits', () => {
      const email  = 'test@test.com';
      const password = 'testtest';
      let invocationArgs;

      beforeEach(() => {
        emailInput.simulate('change', {target: { value: email }});
        passwordInput.simulate('change', {target: { value: password }});
        form.simulate('submit', {preventDefault: () => {}});
        invocationArgs = Session.create.mock.calls[0];
      });

      it('should call Session.create with correct values', () => {
        expect(invocationArgs[0].email).toEqual(email);
        expect(invocationArgs[0].password).toEqual(password);
      });

      describe('API returns results', () => {
        beforeEach(() => {
          const successCallback = invocationArgs[1];
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
          const errorCallback = invocationArgs[2];
          errorCallback({
            error: "Invalid login"
          });
          wrapper.update();
        });

        it('should display error', () => {
          expect(wrapper.state().serverErrored).toBe(true);
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
