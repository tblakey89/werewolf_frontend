import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import Register from './Register';

jest.mock('../api/user');

describe('Register', () => {
  let wrapper;
  let userInput;
  let emailInput;
  let passwordInput
  let form;

  beforeEach(() => {
    wrapper = shallow(<Register />);
    userInput = wrapper.find('#username').first();
    emailInput = wrapper.find('#email').first();
    passwordInput = wrapper.find('#password').first();
    form = wrapper.find('form').first();
  });

  afterEach(() => {
    User.create.mockClear();
  });

  describe('User enters in their details', () => {
    it('no errors are shown', () => {
      expect(wrapper.instance().showFieldError('username')).toBe(false);
      expect(wrapper.instance().showFieldError('email')).toBe(false);
      expect(wrapper.instance().showFieldError('password')).toBe(false);
    });

    describe('User enters an invalid username', () => {
      beforeEach(() => {
        const input = wrapper.find('TextField').first();
        input.simulate('change', {
          target: { value: 'tst' },
        });
      });

      it('shows no errors on username', () => {
        expect(wrapper.instance().showFieldError('username')).toBe(false);
      });

      describe('User clicks submit', () => {
        beforeEach(() => {
          form.simulate('submit', {preventDefault: () => {}});
        });

        it('shows errors', () => {
          expect(wrapper.instance().showFieldError('username')).toBeTruthy();
          expect(wrapper.instance().showFieldError('email')).toBeTruthy();
          expect(wrapper.instance().showFieldError('password')).toBeTruthy();
        });
      });
    });

    describe('User fills form correctly and submits', () => {
      const username = 'testuser';
      const email  = 'test@test.com';
      const password = 'testtest';
      let invocationArgs;

      beforeEach(() => {
        userInput.simulate('change', {target: { value: username }});
        emailInput.simulate('change', {target: { value: email }});
        passwordInput.simulate('change', {target: { value: password }});
        form.simulate('submit', {preventDefault: () => {}});
        invocationArgs = User.create.mock.calls[0];
      });

      it('should call User.create with correct values', () => {
        expect(invocationArgs[0].username).toEqual(username);
        expect(invocationArgs[0].email).toEqual(email);
        expect(invocationArgs[0].password).toEqual(password);
      });

      describe('API returns results', () => {
        beforeEach(() => {
          const successCallback = invocationArgs[1];
          successCallback();
          wrapper.update();
        });

        it('should redirect', () => {
          const redirect = wrapper.find('Redirect');
          expect(redirect.length).toEqual(1);
        });
      });

      describe('API returns error', () => {
        beforeEach(() => {
          const errorCallback = invocationArgs[2];
          errorCallback({
            errors: {
              email: ['has already been taken']
            }
          });
          wrapper.update();
        });

        it('should display error', () => {
          expect(wrapper.instance().showFieldError('email')).toBeTruthy();
        });

        describe('changing email', () => {
          beforeEach(() => {
            emailInput.simulate('change', {target: { value: email }});
          });

          it('no longer shows error', () => {
            expect(wrapper.instance().showFieldError('email')).toBe(false);
          });
        });
      });
    });
  });
});
