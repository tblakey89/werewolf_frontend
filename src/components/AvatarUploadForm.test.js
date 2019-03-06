import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import AvatarUploadForm from './AvatarUploadForm';

jest.mock('../api/user');

describe('AvatarUploadForm', () => {
  let wrapper;
  let user;
  let mockNotify;
  const file = { file: 'fake file' };

  beforeEach(() => {
    mockNotify = jest.fn();
    user = {
      id: 1,
      avatar: 'fake.png'
    };

    wrapper = shallow(shallow(<AvatarUploadForm user={user} onNotificationOpen={mockNotify}/>).get(0));
  });

  afterEach(() => {
    User.avatar.mockClear();
    mockNotify.mockClear();
  });

  describe('loads AvatarUploadForm component', () => {
    let form;
    beforeEach(() => {
      form = wrapper.find('form').first();
    });

    describe('trying to submit with no avatar', () => {
      beforeEach(() => {
        form.simulate('submit', {preventDefault: () => {}});
      });

      it('does not call the avatar function', () => {
        expect(User.avatar.mock.calls.length).toEqual(0);
      });

      describe('adds avatar', () => {
        beforeEach(() => {
          const inputField = wrapper.find('WithStyles(Input)');
          inputField.simulate('change', {
            target: {
               files: [
                 file
               ]
            }
          });
          wrapper.update();
        });

        it('changes state of component', () => {
          expect(wrapper.state().file).toEqual(file);
        });

        describe('submitting form', () => {
          beforeEach(() => {
            form.simulate('submit', {preventDefault: () => {}});
          });

          it('calls the avatar function', () => {
            expect(User.avatar.mock.calls.length).toEqual(1);
          });
        });
      });
    });
  });
});
