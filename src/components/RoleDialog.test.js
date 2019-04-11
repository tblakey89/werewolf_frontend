import React from 'react';
import { shallow } from 'enzyme';
import RoleDialog from './RoleDialog';

describe('RoleDialog', () => {
  let wrapper;
  let mockClose;
  let button;
  let closeButton;
  let game;
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
      role: 'villager',
      actions: {}
    },
    2: {
      alive: true,
      id: 2,
      role: 'werewolf',
      actions: {}
    },
    3: {
      alive: true,
      id: 3,
      role: 'villager',
      actions: {}
    }
  };
  const user = {
    username: 'tester',
    id: 1,
  };

  beforeEach(() => {
    mockClose = jest.fn();
    game = {
      state: {
        players: players,
        state: 'ready'
      }
    }
    wrapper = shallow(shallow(shallow(shallow(shallow(shallow(<RoleDialog onClose={mockClose} open={true} game={game} user={user} users={users} eligibleToVote={false} alreadyVoted={false}/>).get(0)).get(0)).get(0)).get(0)).get(0));
    button = wrapper.find('#submit');
  });

  afterEach(() => {
    mockClose.mockClear();
  });

  describe('User opens dialog', () => {
    describe('when not eligibleToVote', () => {
      it('does not show the select input', () => {
        expect(wrapper.find('WithStyles(Select)').length).toEqual(0);
      });
    });

    describe('when state is day_phase', () => {
      describe('when user is alive', () => {
        beforeEach(() => {
          const updatedGame = {
            state: {
              players: players,
              state: 'day_phase',
              phases: 1
            }
          }
          wrapper.setProps({ game: updatedGame, eligibleToVote: true });
        });

        it('does show the select input, with correct number of candidates', () => {
          expect(wrapper.find('WithStyles(Select)').length).toEqual(1);
          expect(wrapper.find('WithStyles(MenuItem)').length).toEqual(3);
        });

        describe('when user has already done action this phase', () => {
          beforeEach(() => {
            const updatedPlayers = {...players};
            updatedPlayers[1].actions = {
              1: {
                vote: {
                  target: 3
                }
              }
            }
            const updatedGame = {
              state: {
                players: updatedPlayers,
                state: 'day_phase',
                phases: 1
              }
            }
            wrapper.setProps({ game: updatedGame, eligibleToVote: false, alreadyVoted: true });
          });

          it('does not show the select input, shows action text', () => {
            expect(wrapper.find('WithStyles(Select)').length).toEqual(0);
            expect(wrapper.find('p').at(1).text()).toEqual(`You voted for ${users[3].user.username}`);
          });
        });
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
            role: 'villager',
            actions: {}
          },
          2: {
            alive: true,
            id: 2,
            role: 'werewolf',
            actions: {}
          },
          3: {
            alive: true,
            id: 3,
            role: 'werewolf',
            actions: {}
          }
        };
        const updatedGame = {
          state: {
            players: werewolfPlayers,
            state: 'night_phase'
          }
        }
        wrapper.setProps({ game: updatedGame, user: werewolfUser, eligibleToVote: true });
      });

      it('does show the select input, with correct number of candidates', () => {
        expect(wrapper.find('WithStyles(Select)').length).toEqual(1);
        expect(wrapper.find('WithStyles(MenuItem)').length).toEqual(2);
      });
    });
  });
});
