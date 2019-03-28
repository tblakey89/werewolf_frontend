import React from 'react';
import { shallow } from 'enzyme';
import Invitation from '../api/invitation';
import InvitationDialog from './InvitationDialog';

jest.mock('../api/invitation');

describe('InvitationDialog', () => {
  let wrapper;
  let mockNotify;
  let mockClose;
  let button;
  let closeButton;
  let invitations;
  let user;

  beforeEach(() => {
    user = {
      id: 10
    };
    invitations = [
      {
        id: 1,
        users_games: [
          {
            id: 11,
            user_id: user.id,
            state: 'pending',
          }
        ]
      },
      {
        id: 2,
        users_games: [
          {
            id: 12,
            user_id: user.id,
            state: 'pending',
          }
        ]
      }
    ];
    mockNotify = jest.fn();
    mockClose = jest.fn();
    wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<InvitationDialog onClose={mockClose} onNotificationOpen={mockNotify} open={true} invitations={invitations} user={user} />).get(0)).get(0)).get(0)).get(0)).get(0));
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    Invitation.update.mockClear();
    mockNotify.mockClear();
    mockClose.mockClear();
  });

  describe('User opens dialog', () => {
    it('displays correct number of invites', () => {
      expect(wrapper.find('WithStyles(ListItem)').length).toEqual(2);
    });

    describe('close button', () => {
      it('clicking close button triggers close function', () => {
        expect(mockClose.mock.calls.length).toEqual(0);
        closeButton = wrapper.find('#close');
        closeButton.simulate('click');
        expect(mockClose.mock.calls.length).toEqual(1);
      });
    });

    describe('user clicks on tick icon to accept invite', () => {
      let button;
      let invitationUpdateInvocationArgs;

      beforeEach(() => {
        button = wrapper.find('WithStyles(Button)').first();
        button.simulate('click');
        wrapper.update();
        invitationUpdateInvocationArgs = Invitation.update.mock.calls[0];
      });

      it('triggers update api call', () => {
        expect(invitationUpdateInvocationArgs[0]).toEqual(12);
        expect(invitationUpdateInvocationArgs[1]).toEqual('accepted');
      });

      describe('when invite update responds', () => {
        beforeEach(() => {
          const invitationUpdateCallback = invitationUpdateInvocationArgs[2];
          invitationUpdateCallback();
        });

        it('notifies the user', () => {
          expect(mockNotify.mock.calls.length).toEqual(1);
        });
      });
    });

    describe('user clicks on tick icon to reject invite', () => {
      let button;
      let invitationUpdateInvocationArgs

      beforeEach(() => {
        button = wrapper.find('WithStyles(Button)').at(1);
        button.simulate('click');
        wrapper.update();
        invitationUpdateInvocationArgs = Invitation.update.mock.calls[0];
      });

      it('triggers update api call', () => {
        expect(invitationUpdateInvocationArgs[0]).toEqual(12);
        expect(invitationUpdateInvocationArgs[1]).toEqual('rejected');
      });
    });

    describe('when no invitations', () => {
      beforeEach(() => {
        wrapper.setProps({ invitations: [] });
      });

      it('contains only one ListItem', () => {
        expect(wrapper.find('WithStyles(ListItem)').length).toEqual(1);
        const listItem = wrapper.find('WithStyles(ListItem)')
      });
    })
  });
});
