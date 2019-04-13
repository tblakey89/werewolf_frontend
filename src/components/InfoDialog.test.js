import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import { MemoryRouter } from 'react-router'
import Conversation from '../api/conversation';
import InfoDialog from './InfoDialog';

jest.mock('../api/conversation');

describe('InfoDialog', () => {
  const shallow = createShallow({untilSelector: 'InfoDialog'})
  let wrapper;
  let mockClose;
  let button;
  let closeButton;
  let state;
  const users = {
    1: {
      id: 1,
      state: 'host',
      user_id: 1,
      user: {
        id: 1,
        username: 'tester',
      }
    },
    2: {
      id: 2,
      state: 'host',
      user_id: 2,
      user: {
        id: 2,
        username: 'tester2',
      }
    }
  };
  const players = {
    1: {
      alive: true,
      id: 1,
      role: 'villager'
    },
    2: {
      alive: true,
      id: 2,
      role: 'none'
    }
  };
  const user = {
    username: 'tester',
    id: 1,
  };

  beforeEach(() => {
    mockClose = jest.fn();
    state = 'initialized';
    wrapper = shallow(<MemoryRouter><InfoDialog onClose={mockClose} open={true} gameState={state} players={players} user={user} users={users}/></MemoryRouter>);
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    mockClose.mockClear();
    Conversation.create.mockClear();
  });

  describe('User opens dialog', () => {
    it('displays correct number of players', () => {
      expect(wrapper.find('WithStyles(ListItem)').length).toEqual(2);
    });

    it('clicking close button triggers close function', () => {
      expect(mockClose.mock.calls.length).toEqual(0);
      closeButton = wrapper.find('#close');
      closeButton.simulate('click');
      expect(mockClose.mock.calls.length).toEqual(1);
    });

    it('displays correct role for user', () => {
      const listItemTexts = wrapper.find('WithStyles(ListItemText)');
      expect(listItemTexts.first().props()['primary']).toEqual(users[1].user.username);
      expect(listItemTexts.first().props()['secondary']).toEqual(users[1].state);
    });

    describe('when game has started, displays roles, and alive boolean', () => {
      beforeEach(() => {
        state = 'day_phase';
        wrapper.setProps({gameState: state});
      });

      it('displays correct role for user', () => {
        const listItemTexts = wrapper.find('WithStyles(ListItemText)');
        expect(listItemTexts.first().props()['primary']).toEqual(users[1].user.username);
        expect(listItemTexts.first().props()['secondary']).toEqual(`Alive, Role: ${players[1].role}`);
      });
    });

    describe('when game has started, displays roles, and user dead', () => {
      beforeEach(() => {
        let updatedState = 'day_phase';
        let deadPlayers = [
          {
            alive: false,
            id: 1,
            role: 'villager'
          },
          {
            alive: false,
            id: 2,
            role: 'none'
          }
        ];
        wrapper.setProps({gameState: updatedState, players: deadPlayers});
      });

      it('displays correct role for user', () => {
        const listItemTexts = wrapper.find('WithStyles(ListItemText)');
        expect(listItemTexts.first().props()['primary']).toEqual(users[1].user.username);
        expect(listItemTexts.first().props()['secondary']).toEqual(`Dead, Role: ${players[1].role}`);
      });
    });

    describe('on icon click, creates new conversation', () => {
      beforeEach(() => {
        const userLink = wrapper.find('WithStyles(IconButton)');
        userLink.first().simulate('click');
        wrapper.update();
      });

      it('conversation create is called', () => {
        expect(Conversation.create.mock.calls.length).toEqual(1);
      });

      describe('goes to new conversation', () => {
        let currentHistoryLength;

        beforeEach(() => {
          currentHistoryLength = wrapper.instance().props.history.length
          const invocationArgs = Conversation.create.mock.calls[0];
          const successCallback = invocationArgs[1];
          successCallback({
            conversation: {
              id: 10
            }
          });
          wrapper.update();
        });

        it('adds to history', () => {
          expect(wrapper.instance().props.history.length).toBeGreaterThan(currentHistoryLength);
        });
      });
    });
  });
});
