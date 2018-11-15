import React from 'react';
import { shallow } from 'enzyme';
import RoleDialog from './RoleDialog';

describe('RoleDialog', () => {
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
      state: 'accepted',
      user_id: 2,
      user: {
        id: 2,
        username: 'tester2',
      }
    },
    3: {
      id: 3,
      state: 'accepted',
      user_id: 3,
      user: {
        id: 3,
        username: 'tester3',
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
      role: 'werewolf'
    },
    3: {
      alive: true,
      id: 3,
      role: 'villager'
    }
  };
  const user = {
    username: 'tester',
    id: 1,
  };

  beforeEach(() => {
    mockClose = jest.fn();
    state = 'ready';
    wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<RoleDialog onClose={mockClose} open={true} gameState={state} players={players} user={user} users={users}/>).get(0)).get(0)).get(0)).get(0)).get(0));
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    mockClose.mockClear();
  });

  describe('User opens dialog', () => {
    describe('when state is ready', () => {
      it('does not show the select input', () => {
        expect(wrapper.find('WithStyles(Select)').length).toEqual(0);
      });
    });

    describe('when state is day_phase', () => {
      describe('when user is alive', () => {
        beforeEach(() => {
          wrapper.setProps({ gameState: 'day_phase' });
        });

        it('does show the select input, with correct number of candidates', () => {
          expect(wrapper.find('WithStyles(Select)').length).toEqual(1);
          expect(wrapper.find('WithStyles(MenuItem)').length).toEqual(3);
        });
      });

      describe('when user is dead', () => {
        beforeEach(() => {
          const deadPlayers = {
            1: {
              alive: false,
              id: 1,
              role: 'villager'
            }
          };
          wrapper.setProps({ gameState: 'day_phase', players: deadPlayers });
        });

        it('does show the select input, with correct number of candidates', () => {
          expect(wrapper.find('WithStyles(Select)').length).toEqual(0);
        });
      });
    });

    describe('when state is night_phase', () => {
      describe('when user is not a werewolf', () => {
        beforeEach(() => {
          wrapper.setProps({ gameState: 'night_phase' });
        });

        it('does not show the select input', () => {
          expect(wrapper.find('WithStyles(Select)').length).toEqual(0);
        });
      });

      describe('when user is a werewolf', () => {
        beforeEach(() => {
          const werewolfUser = {
            username: 'tester',
            id: 2,
          };
          const werewolfPlayers = {
            1: {
              alive: true,
              id: 1,
              role: 'villager'
            },
            2: {
              alive: true,
              id: 2,
              role: 'werewolf'
            },
            3: {
              alive: true,
              id: 3,
              role: 'werewolf'
            }
          };
          wrapper.setProps({ gameState: 'night_phase', user: werewolfUser, players: werewolfPlayers });
        });

        it('does show the select input, with correct number of candidates', () => {
          expect(wrapper.find('WithStyles(Select)').length).toEqual(1);
          expect(wrapper.find('WithStyles(MenuItem)').length).toEqual(2);
        });
      });
    });
  });
});
