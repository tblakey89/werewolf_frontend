import React from 'react';
import { shallow } from 'enzyme';
import Game from './Game';
import Invitation from '../api/invitation';

jest.mock('../api/invitation');

describe('Game', () => {
  let wrapper;
  let mockSetAsRead;
  let mockNotify;
  let user;
  let game;

  beforeEach(() => {
    user = {
      id: 1,
    };
    game = {
      id: 10,
      pending: false,
      messages: [
        {
          id: 1,
          body: 'test',
          game_id: 10,
          created_at: new Date(2018, 6, 1),
          sender: user
        },
        {
          id: 2,
          body: 'test2',
          game_id: 10,
          created_at: new Date(2018, 3, 1),
          sender: user
        },
      ],
      users_games: [
        {
          id: 10,
          user_id: 2,
          state: 'accepted',
        },
        {
          id: 1,
          user_id: user.id,
          state: 'pending',
        }
      ],
      unreadMessageCount: 0,
      state: {},
    };
    mockSetAsRead = jest.fn();
    wrapper = shallow(shallow(<Game setAsRead={mockSetAsRead} game={game} user={user} onNotificationOpen={mockNotify} />).get(0));
  });

  afterEach(() => {
    mockNotify = jest.fn();
    Invitation.update.mockClear();
  });

  describe('loads up component', () => {
    it('displays messages in correct order', () => {
      const listItemTexts = wrapper.find('WithStyles(ListItemText)');
      expect(listItemTexts.length).toEqual(2);
      expect(listItemTexts.first().props()['secondary']).toEqual(game.messages[1].body);
      expect(wrapper.find('#invitations').length).toEqual(0);
    });

    it('does not call setAsUnread function', () => {
      expect(mockSetAsRead.mock.calls.length).toBe(0);
    });
  });

  describe('displays invitations when game is pending', () => {
    beforeEach(() => {
      const gameCopy = { ...game, pending: true }
      wrapper.setProps({ game: gameCopy });
    });

    it('invitations are displayed', () => {
      expect(wrapper.find('#invitations').length).toEqual(1);
    });

    describe('clicking on tick icon causes invite update', () => {
      let invitationUpdateInvocationArgs;

      beforeEach(() => {
        wrapper.find('#accept').simulate('click');
        wrapper.update();
        invitationUpdateInvocationArgs = Invitation.update.mock.calls[0];
      });

      it('Invitation update has been called with \'accepted\' state', () => {
        expect((Invitation.update.mock.calls.length)).toEqual(1);
        expect(invitationUpdateInvocationArgs[1]).toEqual('accepted');
        expect(invitationUpdateInvocationArgs[0]).toEqual(1);
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

    describe('clicking on reject button causes invite update', () => {
      let invitationUpdateInvocationArgs;

      beforeEach(() => {
        wrapper.find('#reject').simulate('click');
        wrapper.update();
        invitationUpdateInvocationArgs = Invitation.update.mock.calls[0];
      });

      it('Invitation update has been called with \'accepted\' state', () => {
        expect((Invitation.update.mock.calls.length)).toEqual(1);
        expect(invitationUpdateInvocationArgs[1]).toEqual('rejected');
        expect(invitationUpdateInvocationArgs[0]).toEqual(1);
      });
    });
  });

  describe('loads up component when unreadMessageCount is greater than 0', () => {
    beforeEach(() => {
      const gameCopy = { ...game, unreadMessageCount: 1 }
      wrapper.setProps({ game: gameCopy });
    });

    it('calls setAsUnread function', () => {
      expect(mockSetAsRead.mock.calls.length).toBe(1);
    });
  });
});
