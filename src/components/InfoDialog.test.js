import React from 'react';
import { shallow } from 'enzyme';
import InfoDialog from './InfoDialog';

describe('InfoDialog', () => {
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
    wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<InfoDialog onClose={mockClose} open={true} gameState={state} players={players} user={user} users={users}/>).get(0)).get(0)).get(0)).get(0)).get(0));
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    mockClose.mockClear();
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
        wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<InfoDialog onClose={mockClose} open={true} gameState={state} players={players} user={user} users={users}/>).get(0)).get(0)).get(0)).get(0)).get(0));
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
        wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<InfoDialog onClose={mockClose} open={true} gameState={updatedState} players={deadPlayers} user={user} users={users}/>).get(0)).get(0)).get(0)).get(0)).get(0));
      });

      it('displays correct role for user', () => {
        const listItemTexts = wrapper.find('WithStyles(ListItemText)');
        expect(listItemTexts.first().props()['primary']).toEqual(users[1].user.username);
        expect(listItemTexts.first().props()['secondary']).toEqual(`Dead, Role: ${players[1].role}`);
      });
    });
  });
});
