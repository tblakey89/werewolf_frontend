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
  let channelPush;

  beforeEach(() => {
    channelPush = jest.fn();
    user = {
      id: 1,
    };
    game = {
      id: 10,
      pending: false,
      channel: {
        push: channelPush,
      },
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
      state: {
        state: 'initialized',
        players: {
          1: {
            alive: true,
            id: 1,
            role: 'villager',
            host: true,
          },
          2: {
            alive: true,
            id: 2,
            role: 'none',
            host: false,
          }
        }
      },
    };
    mockSetAsRead = jest.fn();
    wrapper = shallow(shallow(<Game setAsRead={mockSetAsRead} game={game} user={user} onNotificationOpen={mockNotify} />).get(0));
  });

  afterEach(() => {
    mockNotify = jest.fn();
    Invitation.update.mockClear();
    channelPush.mockClear();
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

  describe('shows game status', () => {
    describe('when game state is initialized', () => {
      it('shows player count', () => {
        expect(wrapper.find('span').text()).toEqual('1 players. 8 minimum. 18 maximum');
      });
    });

    describe('when game state is ready', () => {
      beforeEach(() => {
        const stateCopy = { ...game.state, state: 'ready' };
        const gameCopy = { ...game, state: stateCopy };
        wrapper.setProps({ game: gameCopy });
      });

      it('shows player count', () => {
        expect(wrapper.find('span').text()).toEqual('1 players. 8 minimum. 18 maximum');
      });
    });

    describe('when game state is day_phase', () => {
      beforeEach(() => {
        const stateCopy = { ...game.state, state: 'day_phase', phases: 1 };
        const gameCopy = { ...game, state: stateCopy };
        wrapper.setProps({ game: gameCopy });
      });

      it('shows day phase and number', () => {
        expect(wrapper.find('span').text()).toEqual('Day Phase 1');
      });
    });

    describe('when game state is night_phase', () => {
      beforeEach(() => {
        const stateCopy = { ...game.state, state: 'night_phase', phases: 2 };
        const gameCopy = { ...game, state: stateCopy };
        wrapper.setProps({ game: gameCopy });
      });

      it('shows night phase and number', () => {
        expect(wrapper.find('span').text()).toEqual('Night Phase 1');
      });
    });

    describe('when game state is game_over', () => {
      beforeEach(() => {
        const stateCopy = { ...game.state, state: 'game_over' };
        const gameCopy = { ...game, state: stateCopy };
        wrapper.setProps({ game: gameCopy });
      });

      it('shows game over', () => {
        expect(wrapper.find('span').text()).toEqual('Game Over');
      });
    });
  });

  describe('launch button', () => {
    describe('when game state is not ready and user is host', () => {
      it('launch button is not displayed', () => {
        expect(wrapper.find('#launchButton').length).toEqual(0);
      });
    });

    describe('when game state is ready', () => {
      beforeEach(() => {
        const stateCopy = { ...game.state, state: 'ready' };
        const gameCopy = { ...game, state: stateCopy };
        wrapper.setProps({ game: gameCopy });
      });

      describe('when user is host of game', () => {
        it('launch button is displayed', () => {
          expect(wrapper.find('#launchButton').length).toEqual(1);
        });

        it('pushes to the server when clicked', () => {
          const launchButton = wrapper.find('#launchButton')
          launchButton.simulate('click');
          expect(channelPush.mock.calls.length).toEqual(1);
        });
      });

      describe('when user is not host of game', () => {
        beforeEach(() => {
          const otherUser = {id: 2};
          wrapper.setProps({ user: otherUser });
        });

        it('launch button is not displayed', () => {
          expect(wrapper.find('#launchButton').length).toEqual(0);
        });
      });
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
