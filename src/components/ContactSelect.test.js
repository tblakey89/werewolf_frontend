import React from 'react';
import { shallow } from 'enzyme';
import User from '../api/user';
import ContactSelect from './ContactSelect';

jest.mock('../api/user');

describe('ContactSelect', () => {
  let wrapper;
  let mockOnChange;
  let mockShowFieldError;
  let mockSetLoaded;
  let participants;

  beforeEach(() => {
    mockOnChange = jest.fn();
    mockShowFieldError = jest.fn();
    mockSetLoaded = jest.fn();
    participants= [];
    wrapper = shallow(shallow(
      <ContactSelect
        participants={participants}
        onChange={mockOnChange}
        showFieldError={mockShowFieldError}
        setLoaded={mockSetLoaded}
      />
    ).get(0));
  });

  afterEach(() => {
    User.index.mockClear();
    mockOnChange.mockClear();
    mockShowFieldError.mockClear();
    mockSetLoaded.mockClear();
  });

  describe('ContactSelect is mounted', () => {
    it('calls User.index', () => {
      expect(User.index.mock.calls.length).toEqual(1);
      expect(wrapper.find('WithStyles(FormControl)').first().props().error).toEqual(false)
      expect(wrapper.find('WithStyles(FormHelperText)').render().text()).toEqual("")
    });

    describe('loads users on callback', () => {
      let userInvocationArgs;
      let user;

      beforeEach(() => {
        userInvocationArgs = User.index.mock.calls[0];
        const successCallback = userInvocationArgs[0];
        user = {
          id: 1,
          username: 'test',
        };
        successCallback({ users: [user] });
        wrapper.update();
      });

      it('fills contacts object', () => {
        const contacts = wrapper.state().contacts;
        expect(Object.keys(contacts).length).toEqual(1);
        expect(contacts[user.id]).toEqual(user);
        expect(mockSetLoaded.mock.calls.length).toEqual(1);
      });

      describe('when showFieldError returns error', () => {
        let errorMessage;

        beforeEach(() => {
          errorMessage = 'must have at least one user';
          mockShowFieldError.mockReturnValue(errorMessage);
          wrapper.setProps({ showFieldError: mockShowFieldError });
        });

        it('shows errorMessage to user', () => {
          expect(wrapper.find('WithStyles(FormControl)').first().props().error).toEqual(true)
          expect(wrapper.find('WithStyles(FormHelperText)').render().text()).toEqual(errorMessage)
        });
      });

      describe('user selects user', () => {
        let input;
        let event;

        beforeEach(() => {
          input = wrapper.find('WithStyles(Select)');
          event = {
            target: { value: [user] },
          };
          input.simulate('change', event);
        });

        it('updates state to include selected user_id', () => {
          expect(mockOnChange.mock.calls.length).toEqual(1);
          expect(mockOnChange.mock.calls[0][0]).toEqual(event);
        });
      });
    });
  });
});
