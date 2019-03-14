import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import ForgottenPassword from './ForgottenPassword';

jest.mock('../api/user');

describe('Register', () => {
  let wrapper;
  let emailInput;
  let form;
  let mockNotify;
  let location;

  beforeEach(() => {
    mockNotify = jest.fn();
    location = {state: {from: '/games'}};
    wrapper = shallow(<ForgottenPassword onNotificationOpen={mockNotify} location={location} />);
    emailInput = wrapper.find('#email').first();
    form = wrapper.find('form').first();
  });

  afterEach(() => {
    User.forgotPassword.mockClear();
  });

  describe('User enters in their email', () => {
    it('no errors are shown', () => {
      expect(wrapper.instance().showFieldError()).toBe(false);
    });

    describe('User enters an invalid email', () => {
      beforeEach(() => {
        emailInput.simulate('change', {
          target: { value: 'fakeemail.com' },
        });
      });

      it('shows no errors on email', () => {
        expect(wrapper.instance().showFieldError()).toBe(false);
      });

      describe('User clicks submit', () => {
        beforeEach(() => {
          form.simulate('submit', {preventDefault: () => {}});
        });

        it('shows errors', () => {
          expect(wrapper.instance().showFieldError('email')).toBeTruthy();
        });
      });
    });

    describe('User enters email correctly and submits', () => {
      const email  = 'test@test.com';
      let invocationArgs;

      beforeEach(() => {
        emailInput.simulate('change', {target: { value: email }});
        form.simulate('submit', {preventDefault: () => {}});
        invocationArgs = User.forgotPassword.mock.calls[0];
      });

      it('should call User.forgotPassword with correct values', () => {
        expect(invocationArgs[0].email).toEqual(email);
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
            error: "User not found"
          });
          wrapper.update();
        });

        it('should display error', () => {
          expect(wrapper.instance().showFieldError()).toBeTruthy();
        });

        describe('changing email', () => {
          beforeEach(() => {
            emailInput.simulate('change', {target: { value: email }});
          });

          it('no longer shows error', () => {
            expect(wrapper.instance().showFieldError()).toBe(false);
          });
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
