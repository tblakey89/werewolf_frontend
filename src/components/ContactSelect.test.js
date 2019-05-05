import React from 'react';
import { shallow } from 'enzyme';
import ContactSelect from './ContactSelect';

describe('ContactSelect', () => {
  let wrapper;
  let mockOnChange;
  let mockShowFieldError;
  let participants;
  let friends;
  let user;

  beforeEach(() => {
    mockOnChange = jest.fn();
    mockShowFieldError = jest.fn();
    participants= [];
    user = {
      id: 1,
      username: 'test',
    };
    friends = [
      user,
      {
        id: 2
      }
    ];
    wrapper = shallow(shallow(
      <ContactSelect
        friends={friends}
        participants={participants}
        onChange={mockOnChange}
        showFieldError={mockShowFieldError}
      />
    ).get(0));
  });

  afterEach(() => {
    mockOnChange.mockClear();
    mockShowFieldError.mockClear();
  });

  describe('ContactSelect is mounted', () => {
    it('fills contacts object', () => {
      const contacts = wrapper.state().contacts;
      expect(Object.keys(contacts).length).toEqual(2);
      expect(contacts[user.id]).toEqual(user);
    });

    describe('when user is already a participant', () => {
      beforeEach(() => {
        const participantsIds = [user.id];
        wrapper = shallow(shallow(
          <ContactSelect
            participants={participants}
            friends={friends}
            onChange={mockOnChange}
            showFieldError={mockShowFieldError}
            currentParticipantIds={participantsIds}
          />
        ).get(0));
      });

      it('does fills the contacts object with 1', () => {
        const contacts = wrapper.state().contacts;
        expect(Object.keys(contacts).length).toEqual(1);
      });
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
