import React from 'react';
import { shallow } from 'enzyme';
import Invitation from '../api/invitation';
import Games from './Games';

jest.mock('../api/invitation');

describe('Games', () => {
  let wrapper;
  let gamesDisplayed;
  let mockNotify;
  const user = {
    username: 'currentUser',
    id: 1,
  };
  const games = [
    {
      id: 1,
      name: 'test1',
      users_games: [
        {
          id: 11,
          user_id: user.id,
          state: 'accepted',
        }
      ],
      state: {
        state: 'initialized',
      }
    },
    {
      id: 2,
      name: 'test2',
      pending: true,
      users_games: [
        {
          id: 10,
          user_id: 2,
          state: 'accepted',
        },
        {
          id: 12,
          user_id: user.id,
          state: 'pending',
        }
      ],
      state: {
        state: 'initialized',
      }
    }
  ];

  beforeEach(() => {
    mockNotify = jest.fn();
    wrapper = shallow(shallow(<Games games={games} user={user} onNotificationOpen={mockNotify}/>).get(0));
  });

  afterEach(() => {
    Invitation.update.mockClear();
    mockNotify.mockClear();
  });

  describe('when no games present', () => {
    beforeEach(() => {
      wrapper.setProps({ games: [] });
      gamesDisplayed = wrapper.find('Link');
    });

    it('should show no games, but allow users to add new game', () => {
      expect(gamesDisplayed.length).toEqual(0);
      expect(wrapper.find('WithStyles(ListItemText)').length).toEqual(1);
    });

    describe('when user clicks on "+"', () => {
      beforeEach(() => {
        let button = wrapper.find('WithStyles(Button)').first();
        button.simulate('click');
      });

      it('changes open state to true', () => {
        expect(wrapper.state().open).toEqual(true);
      });

      describe('when handleClose is called', () => {
        beforeEach(() => {
          wrapper.instance().handleClose();
        });

        it('changes open state back to false', () => {
          expect(wrapper.state().open).toEqual(false);
        });
      });
    });
  });

  describe('when games present', () => {
    it('displays correct number of games', () => {
      const listItems = wrapper.find('WithStyles(ListItemText)');
      expect(listItems.length).toEqual(2);
    });

    describe('pending game shows accept and reject options', () => {
      let buttons;

      beforeEach(() => {
        const listItemSecondaryAction = wrapper.find('WithStyles(ListItemSecondaryAction)');
        buttons = listItemSecondaryAction.find('WithStyles(Button)');
      });

      it('displays invitation options', () => {
        expect(buttons.length).toEqual(2);
      });

      describe('clicking on first button causes invite update', () => {
        let invitationUpdateInvocationArgs;

        beforeEach(() => {
          buttons.first().simulate('click');
          wrapper.update();
          invitationUpdateInvocationArgs = Invitation.update.mock.calls[0];
        });

        it('Invitation update has been called with \'accepted\' state', () => {
          expect((Invitation.update.mock.calls.length)).toEqual(1);
          expect(invitationUpdateInvocationArgs[1]).toEqual('accepted');
          expect(invitationUpdateInvocationArgs[0]).toEqual(12);
        });

        describe('when callback is called', () => {
          beforeEach(() => {
            const invitationUpdateCallback = invitationUpdateInvocationArgs[2];
            invitationUpdateCallback();
          });

          it('notifies the user', () => {
            expect(mockNotify.mock.calls.length).toEqual(1);
          });
        });
      });

      describe('clicking on first button causes invite update', () => {
        let invitationUpdateInvocationArgs;

        beforeEach(() => {
          buttons.at(1).simulate('click');
          wrapper.update();
          invitationUpdateInvocationArgs = Invitation.update.mock.calls[0];
        });

        it('Invitation update has been called with \'accepted\' state', () => {
          expect((Invitation.update.mock.calls.length)).toEqual(1);
          expect(invitationUpdateInvocationArgs[1]).toEqual('rejected');
          expect(invitationUpdateInvocationArgs[0]).toEqual(12);
        });
      });
    });
  });
});
