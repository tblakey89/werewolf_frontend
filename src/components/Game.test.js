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
  let friends;
  let game;
  let channelPush;

  beforeEach(() => {
    channelPush = jest.fn();
    user = {
      id: 1,
    };
    friends = {};
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
        phases: 1,
        players: {
          1: {
            alive: true,
            id: 1,
            role: 'villager',
            host: true,
            actions: {},
          },
          2: {
            alive: true,
            id: 2,
            role: 'none',
            host: false,
            actions: {},
          }
        }
      },
    };
    mockSetAsRead = jest.fn();
    wrapper = shallow(shallow(<Game setAsRead={mockSetAsRead} game={game} user={user} onNotificationOpen={mockNotify} friends={friends} />).get(0));
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
      expect(channelPush.mock.calls.length).toEqual(1);
      expect(channelPush.mock.calls[0][0]).toEqual('read_game');
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
        expect(wrapper.find('span').text()).toEqual(expect.stringContaining('Day Phase 1'));
      });
    });

    describe('when game state is night_phase', () => {
      beforeEach(() => {
        const stateCopy = { ...game.state, state: 'night_phase', phases: 2 };
        const gameCopy = { ...game, state: stateCopy };
        wrapper.setProps({ game: gameCopy });
      });

      it('shows night phase and number', () => {
        expect(wrapper.find('span').text()).toEqual(expect.stringContaining('Night Phase 1'));
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
          const launchButton = wrapper.find('#launchButton');
          channelPush.mockClear();
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

      it('Invitation update has been called with \'rejected\' state', () => {
        expect((Invitation.update.mock.calls.length)).toEqual(1);
        expect(invitationUpdateInvocationArgs[1]).toEqual('rejected');
        expect(invitationUpdateInvocationArgs[0]).toEqual(1);
      });

      describe('when reject update returns success', () => {
        beforeEach(() => {
          const invitationUpdate = invitationUpdateInvocationArgs[2];
          invitationUpdate();
          wrapper.update();
        });

        it('the redirect component is shown', () => {
          expect(wrapper.find('Redirect').length).toEqual(1);
        });
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
      expect(channelPush.mock.calls.length).toEqual(2);
      expect(channelPush.mock.calls[1][0]).toEqual('read_game');
    });
  });

  describe('eligible to vote', () => {
    beforeEach(() => {
      const updatedGame = {...game};
      updatedGame.state.state = 'day_phase';
      wrapper = shallow(shallow(<Game setAsRead={mockSetAsRead} game={game} user={user} onNotificationOpen={mockNotify} friends={friends} />).get(0));
    });

    it('returns true', () => {
      expect(wrapper.instance().eligibleToVote()).toEqual(true);
    });

    describe('when user is villager in night_phase', () => {
      beforeEach(() => {
        const updatedGame = {...game};
        updatedGame.state.state = 'night_phase';
        wrapper.setProps({game: updatedGame});
      });

      it('returns false', () => {
        expect(wrapper.instance().eligibleToVote()).toEqual(false);
      });
    });

    describe('when user is villager in day_phase, but dead', () => {
      beforeEach(() => {
        const updatedGame = {...game};
        updatedGame.state.state = 'day_phase';
        updatedGame.state.players[user.id].alive = false;
        wrapper.setProps({game: updatedGame});
      });

      it('returns false', () => {
        expect(wrapper.instance().eligibleToVote()).toEqual(false);
      });
    });

    describe('when user is villager in day_phase, but already voted', () => {
      beforeEach(() => {
        const updatedGame = {...game};
        updatedGame.state.state = 'day_phase';
        updatedGame.state.players[user.id].actions[1] = {vote: true};
        wrapper.setProps({game: updatedGame});
      });

      it('returns false', () => {
        expect(wrapper.instance().eligibleToVote()).toEqual(false);
      });
    });

    describe('when user is werewolf in night_phase', () => {
      beforeEach(() => {
        const updatedGame = {...game};
        updatedGame.state.state = 'night_phase';
        updatedGame.state.players[user.id].role = 'werewolf';
        wrapper.setProps({game: updatedGame});
      });

      it('returns true', () => {
        expect(wrapper.instance().eligibleToVote()).toEqual(true);
      });
    });
  });
});
